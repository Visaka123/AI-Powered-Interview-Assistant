const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Environment validation
console.log('🔍 Environment Check:');
console.log('- PORT:', PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('- GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing');

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
    'https://ai-powered-interview-assistant-1ry3hcij3.vercel.app',
    'https://ai-powered-interview-assistant-mp2cwq4y3.vercel.app',
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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://interview-user:interview123@cluster0.mongodb.net/ai-interview?retryWrites=true&w=majority';

console.log('🔗 Connecting to MongoDB...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected successfully!');
}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.log('⚠️ Server will continue without database...');
});

// Routes
app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/ai', require('./routes/ai'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Interview Assistant API', 
    status: 'Running',
    endpoints: {
      health: '/api/health',
      candidates: '/api/candidates',
      interviews: '/api/interviews',
      ai: '/api/ai'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📊 MongoDB connection closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  
  // Check MongoDB connection status after a brief delay
  setTimeout(() => {
    const dbStatus = mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected';
    console.log(`📊 MongoDB: ${dbStatus}`);
  }, 3000);
});

server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;