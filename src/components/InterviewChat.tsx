import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Input, Button, Progress, Typography, Space, message } from 'antd';
import { ClockCircleOutlined, SendOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { updateTimer, setCurrentQuestion, endInterview } from '../store/interviewSlice';
import { addAnswerToCandidate, completeInterviewBackend, addAnswer } from '../store/candidatesSlice';
import { AIService } from '../utils/aiService';
import { Answer } from '../types';

const { TextArea } = Input;
const { Title, Text } = Typography;

const InterviewChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentCandidate, currentQuestion, timeRemaining, isInterviewActive, isPaused } = useSelector(
    (state: RootState) => state.interview
  );
  const candidates = useSelector((state: RootState) => state.candidates.candidates);
  
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'question' | 'answer'; content: string; timestamp: Date }>>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const timerRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadQuestion = useCallback(async (index: number) => {
    if (index >= 6) return;

    try {
      setLoading(true);
      const question = await AIService.generateQuestion(index);
      dispatch(setCurrentQuestion(question));
      
      const questionContent = `Question ${index + 1}/6 (${question.difficulty.toUpperCase()}): ${question.text}`;
      setMessages(prev => {
        // Check if a question for this index already exists
        const hasQuestionForIndex = prev.some(msg => 
          msg.type === 'question' && msg.content.includes(`Question ${index + 1}/6`)
        );
        if (hasQuestionForIndex) {
          return prev;
        }
        return [...prev, {
          type: 'question',
          content: questionContent,
          timestamp: new Date()
        }];
      });
    } catch (error) {
      message.error('Failed to load question');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Start interview and load first question
  useEffect(() => {
    if (isInterviewActive && currentCandidate && !interviewStarted) {
      setInterviewStarted(true);
      loadQuestion(0);
    }
  }, [isInterviewActive, currentCandidate, interviewStarted, loadQuestion]);

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !currentCandidate || !answer.trim() || loading) return;

    console.log('🔍 Current candidate in handleSubmitAnswer:', currentCandidate);
    console.log('🔍 Candidate ID:', currentCandidate.id);
    console.log('🔍 Candidate _id:', (currentCandidate as any)._id);

    try {
      setLoading(true);
      const timeSpent = currentQuestion.maxTime - timeRemaining;
      const score = await AIService.evaluateAnswer(currentQuestion, answer, timeSpent);

      const answerObj: Answer = {
        questionId: currentQuestion.id,
        question: currentQuestion.text,
        answer: answer.trim(),
        timeSpent,
        maxTime: currentQuestion.maxTime,
        score,
        difficulty: currentQuestion.difficulty
      };

      const candidateId = currentCandidate.id || (currentCandidate as any)._id;
      dispatch(addAnswerToCandidate({ candidateId, answer: answerObj }));
      
      setMessages(prev => [...prev, {
        type: 'answer',
        content: answer.trim(),
        timestamp: new Date()
      }]);

      setAnswer('');
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      
      console.log(`📝 Completed question ${questionIndex + 1}/6, next: ${nextIndex}`);
      console.log('🔍 Current candidate answers:', currentCandidate.answers.length);
      
      // Check if interview is complete
      if (nextIndex >= 6) {
        console.log('🏁 Interview complete! All 6 questions answered.');
        console.log('📊 Total answers collected:', currentCandidate.answers.length);
        setTimeout(() => {
          console.log('🚀 Calling completeInterviewProcess...');
          completeInterviewProcess();
        }, 2000);
      } else {
        console.log(`🔄 Loading next question: ${nextIndex + 1}/6`);
        loadQuestion(nextIndex);
      }
      
    } catch (error) {
      message.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = useCallback(() => {
    if (loading) return;
    
    console.log('🔍 Current candidate in handleTimeUp:', currentCandidate);
    console.log('🔍 Candidate ID in timeout:', currentCandidate?.id);
    
    const answerObj: Answer = {
      questionId: currentQuestion!.id,
      question: currentQuestion!.text,
      answer: answer.trim() || '(No answer provided - time expired)',
      timeSpent: currentQuestion!.maxTime,
      maxTime: currentQuestion!.maxTime,
      score: 0,
      difficulty: currentQuestion!.difficulty
    };

    const candidateId = currentCandidate!.id || (currentCandidate as any)._id;
    dispatch(addAnswerToCandidate({ candidateId, answer: answerObj }));
    setMessages(prev => [...prev, {
      type: 'answer',
      content: answer.trim() || '(No answer provided - time expired)',
      timestamp: new Date()
    }]);
    
    setAnswer('');
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    
    console.log(`⏰ Time up for question ${questionIndex + 1}/6, next: ${nextIndex}`);
    
    // Check if interview is complete
    if (nextIndex >= 6) {
      console.log('🏁 Interview complete after timeout! Starting completion process...');
      setTimeout(() => {
        completeInterviewProcess();
      }, 1500);
    } else {
      // Load next question
      loadQuestion(nextIndex);
    }
  }, [loading, currentQuestion, currentCandidate, answer, dispatch, questionIndex, loadQuestion]);

  // Timer logic - placed after handleTimeUp is defined
  useEffect(() => {
    if (isInterviewActive && !isPaused && timeRemaining > 0 && currentQuestion) {
      timerRef.current = setTimeout(() => {
        dispatch(updateTimer(timeRemaining - 1));
      }, 1000) as unknown as number;
    } else if (timeRemaining === 0 && currentQuestion) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, isInterviewActive, isPaused, currentQuestion, dispatch, handleTimeUp]);

  const completeInterviewProcess = async () => {
    if (!currentCandidate) return;

    try {
      console.log('🏁 Completing interview for:', currentCandidate.name);
      
      // Wait a bit to ensure all answers are saved
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the latest candidate data from Redux store
      const latestCandidate = candidates.find(c => {
        const candidateId = c.id || (c as any)._id;
        const currentId = currentCandidate.id || (currentCandidate as any)._id;
        return candidateId === currentId;
      });
      
      const answersToEvaluate = latestCandidate?.answers || currentCandidate.answers || [];
      
      console.log('📊 Current answers from store:', answersToEvaluate);
      console.log('🔢 Total answers found:', answersToEvaluate.length);
      
      // Calculate total score from individual answer scores
      const totalScore = answersToEvaluate.reduce((sum, answer) => sum + (answer.score || 0), 0);
      const maxPossibleScore = 120; // 6 questions × 20 points each
      const finalPercentage = Math.round((totalScore / maxPossibleScore) * 100);
      
      console.log('📊 Score calculation:', {
        totalScore,
        maxPossibleScore,
        finalPercentage,
        answersCount: answersToEvaluate.length
      });
      
      // Generate final summary with all answers
      const { summary } = await AIService.generateFinalSummary(answersToEvaluate);
      
      console.log('🎯 Final score calculated:', finalPercentage);
      
      // Complete the interview with final score and summary
      console.log('📤 Dispatching completeInterview with:', { candidateId: currentCandidate.id, score: finalPercentage, summary });
      
      const candidateId = currentCandidate.id || (currentCandidate as any)._id;
      dispatch(completeInterviewBackend({ 
        candidateId, 
        score: finalPercentage, 
        summary 
      }));
      
      console.log('✅ Interview completion dispatched successfully');
      
      dispatch(endInterview());
      
      setMessages(prev => [...prev, {
        type: 'question',
        content: `Interview Completed Successfully!\n\nFinal Score: ${finalPercentage}%\n\nSummary: ${summary}\n\nThank you for participating in this AI-powered interview!`,
        timestamp: new Date()
      }]);
      
      message.success(`Interview completed! Final score: ${finalPercentage}%`, 5);
    } catch (error) {
      console.error('❌ Failed to complete interview:', error);
      message.error('Failed to complete interview');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercent = () => {
    if (!currentQuestion) return 0;
    return ((currentQuestion.maxTime - timeRemaining) / currentQuestion.maxTime) * 100;
  };

  if (!isInterviewActive || !currentCandidate) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>No active interview</Title>
        <Text>Please upload your resume to start the interview.</Text>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Card style={{ marginBottom: 16 }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Interview: {currentCandidate.name}
            </Title>
            <Text type="secondary">
              Question {questionIndex + 1}/6
            </Text>
          </div>
          
          {currentQuestion && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ClockCircleOutlined />
                <Text strong>{formatTime(timeRemaining)}</Text>
              </div>
              <Progress
                percent={getProgressPercent()}
                size="small"
                status={timeRemaining <= 10 ? 'exception' : 'active'}
                style={{ width: 200 }}
              />
            </div>
          )}
        </Space>
      </Card>

      <Card style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', padding: '0 16px' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: 16,
                textAlign: msg.type === 'question' ? 'left' : 'right'
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  backgroundColor: msg.type === 'question' ? '#f0f0f0' : '#1890ff',
                  color: msg.type === 'question' ? '#000' : '#fff'
                }}
              >
                {msg.content}
              </div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {currentQuestion && questionIndex < 6 && (
        <Card style={{ marginTop: 16 }}>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={3}
              disabled={loading || timeRemaining === 0}
              onPressEnter={(e) => {
                if (e.shiftKey) return;
                e.preventDefault();
                handleSubmitAnswer();
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmitAnswer}
              loading={loading}
              disabled={!answer.trim() || timeRemaining === 0}
            >
              Submit
            </Button>
          </Space.Compact>
        </Card>
      )}
    </div>
  );
};

export default InterviewChat;