export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeFile?: File;
  score: number;
  summary: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  completedAt?: string;
  answers: Answer[];
  currentQuestionIndex: number;
}

export interface Answer {
  questionId: string;
  question: string;
  answer: string;
  timeSpent: number;
  maxTime: number;
  score: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  maxTime: number;
  category: string;
}

export interface InterviewState {
  currentCandidate: Candidate | null;
  isInterviewActive: boolean;
  currentQuestion: Question | null;
  timeRemaining: number;
  isPaused: boolean;
}

export interface AppState {
  candidates: Candidate[];
  interview: InterviewState;
  ui: {
    activeTab: 'interviewee' | 'interviewer';
    showWelcomeBack: boolean;
  };
}