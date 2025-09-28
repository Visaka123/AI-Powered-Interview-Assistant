# AI Interview Assistant - Backend

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Setup environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB:**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

4. **Run the server:**
```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create new candidate
- `GET /api/candidates/:id` - Get candidate by ID
- `PUT /api/candidates/:id` - Update candidate
- `POST /api/candidates/:id/answers` - Add answer
- `POST /api/candidates/:id/complete` - Complete interview

### AI Services
- `POST /api/ai/generate-question` - Generate AI question
- `POST /api/ai/evaluate-answer` - Evaluate answer with AI

### Interviews
- `POST /api/interviews/start` - Start new interview
- `GET /api/interviews/stats` - Get statistics

### Health Check
- `GET /api/health` - Server health status

## 🔧 Configuration

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-interview
FRONTEND_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
```

### Database Schema
```javascript
Candidate {
  name: String,
  email: String,
  phone: String,
  resumeText: String,
  status: 'pending' | 'in-progress' | 'completed',
  score: Number,
  summary: String,
  answers: [Answer],
  currentQuestionIndex: Number,
  createdAt: Date,
  completedAt: Date
}
```

## 🛡️ Security Features
- **Helmet.js** - Security headers
- **CORS** - Cross-origin protection
- **Rate Limiting** - API abuse prevention
- **Input Validation** - Data sanitization

## 📊 Features
- **MongoDB Integration** - Persistent data storage
- **AI Question Generation** - Dynamic questions via Groq
- **Real-time Evaluation** - AI-powered answer scoring
- **Statistics API** - Interview analytics
- **Error Handling** - Comprehensive error management

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production (Heroku)
```bash
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Production (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

## 🔗 Frontend Integration

Update frontend API calls to use backend:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

The backend provides secure API key management and persistent data storage for the AI interview system.