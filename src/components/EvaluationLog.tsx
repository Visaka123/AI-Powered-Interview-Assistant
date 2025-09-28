import React, { useState, useEffect } from 'react';
import { Card, Typography, Timeline, Tag, Button, Modal } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface EvaluationEntry {
  timestamp: string;
  question: string;
  answer: string;
  gptResponse: string;
  score: number;
  model: string;
}

const EvaluationLog: React.FC = () => {
  const [evaluations, setEvaluations] = useState<EvaluationEntry[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Listen for evaluation events
    const handleEvaluation = (event: CustomEvent) => {
      const { question, answer, gptResponse, score, model, timestamp } = event.detail;
      setEvaluations(prev => [...prev, {
        timestamp,
        question: question.substring(0, 100) + '...',
        answer: answer.substring(0, 100) + '...',
        gptResponse,
        score,
        model
      }]);
    };

    window.addEventListener('aiEvaluation', handleEvaluation as EventListener);
    
    return () => {
      window.removeEventListener('aiEvaluation', handleEvaluation as EventListener);
    };
  }, []);

  return (
    <>
      <Button 
        icon={<RobotOutlined />} 
        onClick={() => setVisible(true)}
        style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}
      >
        AI Evaluation Log ({evaluations.length})
      </Button>

      <Modal
        title="🤖 Real-time AI Evaluation Log"
        open={visible}
        onCancel={() => setVisible(false)}
        width={800}
        footer={null}
      >
        <Card>
          <Title level={4}>GPT-4 Evaluation Transparency</Title>
          <Paragraph>
            This log shows real-time communication with OpenAI's GPT-4 API to prove 
            authentic AI evaluation of candidate answers.
          </Paragraph>

          <Timeline
            items={evaluations.map((evaluation, index) => ({
              key: index,
              dot: <RobotOutlined />,
              children: (
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <Tag color="blue">{evaluation.model}</Tag>
                    <Tag color="orange">Score: {evaluation.score}/20</Tag>
                    <Tag color="green">{new Date(evaluation.timestamp).toLocaleTimeString()}</Tag>
                  </div>
                  
                  <Text strong>Question:</Text>
                  <Paragraph style={{ fontSize: '12px', color: '#666' }}>
                    {evaluation.question}
                  </Paragraph>
                  
                  <Text strong>Answer:</Text>
                  <Paragraph style={{ fontSize: '12px', color: '#666' }}>
                    {evaluation.answer}
                  </Paragraph>
                  
                  <Text strong>🤖 AI Evaluation:</Text>
                  <Paragraph 
                    code 
                    style={{ 
                      background: '#f0f9ff', 
                      border: '1px solid #0ea5e9',
                      padding: '12px', 
                      marginTop: '8px',
                      fontSize: '12px',
                      borderRadius: '6px'
                    }}
                  >
                    {evaluation.gptResponse}
                  </Paragraph>
                </div>
              )
            }))}
          />

          {evaluations.length === 0 && (
            <Text type="secondary">
              No evaluations yet. Start answering questions to see real-time GPT-4 responses.
            </Text>
          )}
        </Card>
      </Modal>
    </>
  );
};

export default EvaluationLog;