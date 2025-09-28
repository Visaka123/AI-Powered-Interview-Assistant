const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// POST /api/interviews/start - Start new interview
router.post('/start', async (req, res) => {
  try {
    const { name, email, phone, resumeText } = req.body;
    
    const candidate = new Candidate({
      name,
      email,
      phone,
      resumeText,
      status: 'in-progress'
    });
    
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/interviews/stats - Get interview statistics
router.get('/stats', async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const completedInterviews = await Candidate.countDocuments({ status: 'completed' });
    const inProgressInterviews = await Candidate.countDocuments({ status: 'in-progress' });
    const averageScore = await Candidate.aggregate([
      { $match: { status: 'completed', score: { $gt: 0 } } },
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);
    
    res.json({
      totalCandidates,
      completedInterviews,
      inProgressInterviews,
      averageScore: averageScore[0]?.avgScore || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;