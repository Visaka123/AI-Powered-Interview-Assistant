const express = require('express');
const router = express.Router();

// POST /api/ai/generate-question - Generate AI question
router.post('/generate-question', async (req, res) => {
  try {
    const { questionIndex, candidateData, previousAnswers } = req.body;
    
    const difficulties = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard'];
    const timeLimits = [20, 20, 60, 60, 120, 120];
    const difficulty = difficulties[questionIndex];
    const maxTime = timeLimits[questionIndex];
    
    // Build AI prompt
    let prompt = `Generate a unique ${difficulty} level technical interview question for a software developer.\n\n`;
    
    const questionFocus = [
      'JavaScript fundamentals, ES6 features, or basic programming concepts',
      'Frontend frameworks (React/Vue/Angular), CSS, or web development',
      'Backend development, APIs, databases, or server-side concepts', 
      'System design, architecture, scalability, or performance optimization',
      'Advanced algorithms, data structures, security, or complex problem solving',
      'Real-world system architecture, distributed systems, or scalability challenges'
    ];
    
    prompt += `Question ${questionIndex + 1}/6 - Topic: ${questionFocus[questionIndex]}\n`;
    prompt += `Difficulty: ${difficulty.toUpperCase()}\n\n`;
    
    if (previousAnswers && previousAnswers.length > 0) {
      prompt += 'Avoid these already covered topics: ';
      previousAnswers.forEach((answer, i) => {
        const topic = answer.question.split(' ').slice(0, 4).join(' ');
        prompt += `"${topic}" `;
      });
      prompt += '\n\n';
    }
    
    prompt += 'Requirements:\n';
    prompt += '- Generate ONE specific, clear question\n';
    prompt += '- Make it interview-appropriate and professional\n';
    prompt += '- Ensure it tests practical knowledge\n';
    prompt += '- Keep it concise (1-2 sentences max)\n';
    prompt += '- No examples needed in the question\n\n';
    prompt += 'Question:';
    
    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const aiQuestion = data.choices[0]?.message?.content?.trim();
      
      if (aiQuestion && aiQuestion.length > 10 && aiQuestion.length < 300) {
        return res.json({
          id: (questionIndex + 1).toString(),
          text: aiQuestion,
          difficulty,
          maxTime,
          category: 'AI Generated'
        });
      }
    }
    
    // Fallback questions
    const fallbackQuestions = {
      easy: [
        'Explain the difference between == and === in JavaScript.',
        'What is the purpose of the "this" keyword in JavaScript?',
        'How do you handle asynchronous operations in JavaScript?'
      ],
      medium: [
        'How would you optimize a React application for better performance?',
        'Explain the concept of RESTful APIs and their design principles.',
        'What is the difference between SQL and NoSQL databases?'
      ],
      hard: [
        'Design a scalable chat application architecture for millions of users.',
        'How would you implement a distributed caching system?',
        'Explain microservices architecture and its trade-offs.'
      ]
    };
    
    const pool = fallbackQuestions[difficulty];
    const randomIndex = Math.floor(Math.random() * pool.length);
    
    res.json({
      id: (questionIndex + 1).toString(),
      text: pool[randomIndex],
      difficulty,
      maxTime,
      category: 'Fallback Pool'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/evaluate-answer - Evaluate answer with AI
router.post('/evaluate-answer', async (req, res) => {
  try {
    const { question, answer, timeSpent } = req.body;
    
    const prompt = `You are an expert technical interviewer evaluating a candidate's answer.

Question (${question.difficulty.toUpperCase()}): ${question.text}
Candidate Answer: ${answer}
Time Used: ${timeSpent}s out of ${question.maxTime}s

Evaluate this answer considering:
1. Technical accuracy (40%)
2. Completeness (30%) 
3. Clarity (20%)
4. Time efficiency (10%)

Provide: SCORE: X.X/10 | ANALYSIS: detailed feedback`;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.1
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';
      
      const scoreMatch = aiResponse.match(/SCORE:\s*([0-9.]+)/);
      const baseScore = scoreMatch ? parseFloat(scoreMatch[1]) : 5;
      
      const multiplier = question.difficulty === 'easy' ? 1 : question.difficulty === 'medium' ? 1.5 : 2;
      const finalScore = Math.round(Math.min(baseScore * multiplier, 20));
      
      res.json({
        score: finalScore,
        feedback: aiResponse,
        model: 'groq-llama3.3-70b'
      });
    } else {
      throw new Error('AI evaluation failed');
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;