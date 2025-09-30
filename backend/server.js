const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Railway deployment
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ai-powered-interview-assistant-six.vercel.app',
    'https://ai-powered-interview-assistant-63mh1rst7.vercel.app',
    'https://ai-powered-interview-assistant-5q5x2p8nz.vercel.app',
    'https://ai-powered-interview-assistant-g7zflgcq1.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting - temporarily disabled
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use('/api/', limiter);

// MongoDB connection
console.log('🔍 MongoDB URI:', process.env.MONGODB_URI ? 'Found in .env' : 'Using default localhost');
console.log('🔗 Connecting to:', process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true
}).then(() => {
  console.log('✅ MongoDB connection successful!');
}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  // Try without SSL as fallback
  console.log('🔄 Trying connection without SSL...');
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: false
  }).then(() => {
    console.log('✅ MongoDB connected without SSL!');
  }).catch((fallbackErr) => {
    console.error('❌ All connection attempts failed:', fallbackErr.message);
  });
});

// Routes
app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Check MongoDB connection status after a brief delay
  setTimeout(() => {
    console.log(`📊 MongoDB connected: ${mongoose.connection.readyState === 1 ? 'Yes' : 'No'}`);
  }, 2000);
});