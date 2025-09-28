const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  timeSpent: { type: Number, required: true },
  maxTime: { type: Number, required: true },
  score: { type: Number, default: 0 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true }
});

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resumeText: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending' 
  },
  score: { type: Number, default: 0 },
  summary: { type: String },
  answers: [answerSchema],
  currentQuestionIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

module.exports = mongoose.model('Candidate', candidateSchema);