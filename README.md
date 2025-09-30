# 🤖 InterviewAI Pro - AI-Powered Interview Assistant

A comprehensive React application that serves as an AI-powered interview assistant with dual interfaces for both interviewees and interviewers. Built with real AI integration, cloud database, and enterprise-grade features.

## 🚀 Live Demo

**[View Live Application](https://ai-powered-interview-assistant-mp2cwq4y3.vercel.app)**

## 📋 Project Overview

InterviewAI Pro is a full-stack application that automates technical interviews using AI. It features resume parsing, dynamic question generation, real-time evaluation, and comprehensive analytics - all powered by cutting-edge AI technology.

### 🎯 Key Features

#### For Interviewees
- **📄 Smart Resume Upload**: Drag-and-drop PDF/DOCX support with automatic data extraction
- **🤖 AI Question Generation**: Dynamic questions tailored to full-stack development roles
- **⏱️ Timed Interviews**: Progressive difficulty with smart time management
- **💬 Chat Interface**: Intuitive conversation-based interview experience
- **🔄 Session Recovery**: Resume interrupted interviews seamlessly

#### For Interviewers
- **📊 Analytics Dashboard**: Comprehensive candidate performance overview
- **🔍 Advanced Search & Sort**: Filter by name, email, score, or date
- **📈 Detailed Reports**: Complete interview history with AI analysis
- **📱 Real-time Updates**: Live notifications and synchronized data

#### Enterprise Features
- **🌙 Dark/Light Mode**: Professional theme switching
- **🔔 Smart Notifications**: Real-time interview completion alerts
- **⚙️ Settings Panel**: Configurable AI and system preferences
- **👤 User Management**: Professional profile and authentication
- **☁️ Cloud Storage**: MongoDB Atlas for scalable data persistence

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Redux Toolkit** + **Redux Persist** for state management
- **Ant Design** for professional UI components
- **Mammoth.js** & **PDF-Parse** for document processing

### Backend
- **Express.js** RESTful API server
- **MongoDB Atlas** cloud database
- **Groq AI** (Llama 3.3 70B) for question generation and evaluation
- **CORS** and **Helmet** for security

### AI Integration
- **Real AI Evaluation**: Groq API with Llama 3.3 70B model
- **Dynamic Questions**: Context-aware question generation
- **Intelligent Scoring**: Multi-factor answer evaluation
- **Fallback Systems**: Multiple AI providers for reliability

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── ResumeUpload.tsx
│   │   ├── InterviewChat.tsx
│   │   ├── InterviewerDashboard.tsx
│   │   └── WelcomeBackModal.tsx
│   ├── store/              # Redux store and slices
│   │   ├── index.ts
│   │   ├── candidatesSlice.ts
│   │   ├── interviewSlice.ts
│   │   └── uiSlice.ts
│   ├── utils/              # Utility functions
│   │   ├── resumeParser.ts
│   │   └── aiService.ts
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts
│   └── App.tsx
├── backend/
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Express middleware
│   └── server.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)
- **Groq API** key (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Visaka123/AI-Powered-Interview-Assistant.git
cd AI-Powered-Interview-Assistant
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Environment Setup**

Create `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
GROQ_API_KEY=your_groq_api_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

5. **Start the backend server**
```bash
cd backend
npm start
```

6. **Start the frontend application**
```bash
# In the root directory
npm start
```

7. **Open your browser**
Navigate to `http://localhost:3000`

## 🎯 Interview Flow

### 1. Resume Upload & Data Extraction
- Upload PDF or DOCX resume
- Automatic extraction of name, email, and phone
- Smart prompts for missing information

### 2. AI-Powered Interview Process
- **6 Questions Total**: Progressive difficulty system
- **Question 1-2**: Easy (20 seconds each)
- **Question 3-4**: Medium (60 seconds each)  
- **Question 5-6**: Hard (120 seconds each)
- **Real-time Evaluation**: Each answer scored by AI
- **Auto-progression**: Automatic advancement on timeout

### 3. Results & Analytics
- **Final Score**: Calculated from individual question scores
- **AI Summary**: Comprehensive performance analysis
- **Detailed Report**: Complete interview history
- **Recommendations**: AI-generated feedback

## 🔧 Configuration

### AI Service Configuration
The application uses Groq AI for question generation and evaluation. To configure:

1. **Get Groq API Key**: Sign up at [Groq Console](https://console.groq.com)
2. **Update Environment**: Add your API key to `.env`
3. **Customize Models**: Modify `aiService.ts` for different AI models

### Database Configuration
MongoDB Atlas is used for data persistence:

1. **Create Cluster**: Set up free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. **Get Connection String**: Copy your connection URI
3. **Update Environment**: Add URI to `.env` file

### File Upload Limits
- **Supported Formats**: PDF, DOCX
- **Maximum Size**: 10MB (configurable)
- **Processing**: Automatic text extraction with fallback

## 📊 Features Deep Dive

### Resume Processing
- **PDF Support**: Full text extraction with metadata
- **DOCX Support**: Rich document parsing
- **Data Extraction**: Regex-based contact information detection
- **Validation**: Smart field validation and error handling

### AI Integration
- **Question Generation**: Context-aware, role-specific questions
- **Answer Evaluation**: Multi-criteria scoring system
- **Performance Analysis**: Comprehensive candidate assessment
- **Fallback Systems**: Multiple AI providers for reliability

### State Management
- **Redux Toolkit**: Modern Redux with simplified syntax
- **Redux Persist**: Automatic state persistence
- **Real-time Sync**: Live updates across tabs
- **Session Recovery**: Seamless interview resumption

### UI/UX Design
- **Responsive Design**: Mobile-first approach
- **Glassmorphism**: Modern visual effects
- **Dark/Light Themes**: Professional appearance options
- **Accessibility**: WCAG compliant design

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build the project
npm run build

# Deploy to Vercel
npx vercel --prod
```

### Backend (Railway/Heroku)
```bash
# In backend directory
git init
git add .
git commit -m "Initial commit"

# Deploy to Railway
railway login
railway init
railway up
```

### Environment Variables
Set the following in your deployment platform:
- `MONGODB_URI`
- `GROQ_API_KEY`
- `FRONTEND_URL`

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
```

### Manual Testing Checklist
- [ ] Resume upload (PDF/DOCX)
- [ ] Data extraction accuracy
- [ ] Interview flow completion
- [ ] Timer functionality
- [ ] Score calculation
- [ ] Dashboard features
- [ ] Search and sort
- [ ] Theme switching
- [ ] Session persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 API Documentation

### Candidates Endpoints
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create new candidate
- `GET /api/candidates/:id` - Get candidate by ID
- `PUT /api/candidates/:id` - Update candidate
- `POST /api/candidates/:id/answers` - Add answer
- `POST /api/candidates/:id/complete` - Complete interview

### AI Endpoints
- `POST /api/ai/generate-question` - Generate interview question
- `POST /api/ai/evaluate-answer` - Evaluate candidate answer

## 🔒 Security Features

- **Rate Limiting**: API request throttling
- **Input Validation**: Comprehensive data sanitization
- **CORS Protection**: Cross-origin request security
- **Helmet Integration**: Security headers
- **Environment Variables**: Secure configuration management

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading for components
- **Memoization**: React.memo for expensive renders
- **Bundle Optimization**: Webpack optimizations
- **Database Indexing**: MongoDB performance tuning
- **Caching**: Redis integration ready

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check connection string format
mongodb+srv://username:password@cluster.mongodb.net/database
```

**AI API Errors**
```bash
# Verify API key in .env file
GROQ_API_KEY=gsk_your_actual_api_key_here
```

**File Upload Issues**
- Ensure file size is under 10MB
- Check file format (PDF/DOCX only)
- Verify CORS settings for file uploads

## 📞 Support

For questions or issues:
- **Email**: visakavisaka2705@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/Visaka123/AI-Powered-Interview-Assistant/issues)
- **Documentation**: [Wiki](https://github.com/Visaka123/AI-Powered-Interview-Assistant/wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq AI** for powerful language models
- **MongoDB Atlas** for cloud database services
- **Ant Design** for beautiful UI components
- **React Team** for the amazing framework
- **Open Source Community** for invaluable tools and libraries

---

**Built with ❤️ by VISAKA P**

**⭐ Star this repo if you found it helpful!**