import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InterviewState, Question, Candidate } from '../types';

const initialState: InterviewState = {
  currentCandidate: null,
  isInterviewActive: false,
  currentQuestion: null,
  timeRemaining: 0,
  isPaused: false
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startInterview: (state, action: PayloadAction<Candidate>) => {
      const candidate = action.payload;
      // Ensure we use the correct ID format
      state.currentCandidate = {
        ...candidate,
        id: (candidate as any)._id || candidate.id
      };
      state.isInterviewActive = true;
      state.isPaused = false;
    },
    setCurrentQuestion: (state, action: PayloadAction<Question>) => {
      state.currentQuestion = action.payload;
      state.timeRemaining = action.payload.maxTime;
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    pauseInterview: (state) => {
      state.isPaused = true;
    },
    resumeInterview: (state) => {
      state.isPaused = false;
    },
    endInterview: (state) => {
      state.isInterviewActive = false;
      state.currentCandidate = null;
      state.currentQuestion = null;
      state.timeRemaining = 0;
      state.isPaused = false;
    },
    resetInterview: (state) => {
      return initialState;
    },
    updateCurrentCandidate: (state, action: PayloadAction<Candidate>) => {
      state.currentCandidate = action.payload;
    }
  }
});

export const {
  startInterview,
  setCurrentQuestion,
  updateTimer,
  pauseInterview,
  resumeInterview,
  endInterview,
  resetInterview,
  updateCurrentCandidate
} = interviewSlice.actions;

export default interviewSlice.reducer;