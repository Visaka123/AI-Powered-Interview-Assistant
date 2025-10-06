const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// GET /api/candidates - Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/candidates - Create new candidate
router.post('/', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/candidates/:id - Get candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/candidates/:id - Update candidate
router.put('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/candidates/:id/answers - Add answer to candidate
router.post('/:id/answers', async (req, res) => {
  try {
    console.log('📝 Adding answer for candidate:', req.params.id);
    console.log('📝 Answer data:', req.body);
    
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // Validate required fields
    const { questionId, question, answer, timeSpent, maxTime, difficulty } = req.body;
    if (!questionId || !question || !answer || timeSpent === undefined || !maxTime || !difficulty) {
      console.log('❌ Missing required fields:', { questionId, question, answer, timeSpent: timeSpent !== undefined, maxTime, difficulty });
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    candidate.answers.push(req.body);
    candidate.currentQuestionIndex = candidate.answers.length;
    await candidate.save();
    
    console.log('✅ Answer added successfully');
    res.json(candidate);
  } catch (error) {
    console.error('❌ Error adding answer:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// POST /api/candidates/:id/complete - Complete interview
router.post('/:id/complete', async (req, res) => {
  try {
    const { score, summary } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        score,
        summary,
        completedAt: new Date()
      },
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;