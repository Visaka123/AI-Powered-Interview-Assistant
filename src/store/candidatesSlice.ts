import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Candidate, Answer } from '../types';

interface CandidatesState {
  candidates: Candidate[];
  loading: boolean;
}

const initialState: CandidatesState = {
  candidates: [],
  loading: false
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://scintillating-intuition-production-ed4c.up.railway.app/api';

// Async thunks for backend API calls
export const createCandidate = createAsyncThunk(
  'candidates/create',
  async (candidateData: Omit<Candidate, 'id' | 'createdAt'>) => {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidateData)
    });
    return response.json();
  }
);

export const fetchCandidates = createAsyncThunk(
  'candidates/fetchAll',
  async () => {
    const response = await fetch(`${API_BASE_URL}/candidates`);
    return response.json();
  }
);

export const addAnswerToCandidate = createAsyncThunk(
  'candidates/addAnswer',
  async ({ candidateId, answer }: { candidateId: string; answer: Answer }) => {
    console.log('🔍 Adding answer for candidate ID:', candidateId);
    
    // Skip backend call for local candidates
    if (candidateId.startsWith('local_')) {
      console.log('💾 Local candidate, skipping backend call');
      return { candidateId, answer, isLocal: true };
    }
    
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answer)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add answer: ${response.status}`);
    }
    
    return response.json();
  }
);

export const completeInterviewBackend = createAsyncThunk(
  'candidates/complete',
  async ({ candidateId, score, summary }: { candidateId: string; score: number; summary: string }) => {
    // Skip backend call for local candidates
    if (candidateId.startsWith('local_')) {
      console.log('📝 Local candidate, skipping backend call');
      return { candidateId, score, summary, isLocal: true };
    }
    
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, summary })
    });
    return response.json();
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    // Keep local actions for fallback
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action: PayloadAction<{ id: string; updates: Partial<Candidate> }>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload.updates };
      }
    },
    addAnswer: (state, action: PayloadAction<{ candidateId: string; answer: Answer }>) => {
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate) {
        candidate.answers.push(action.payload.answer);
        candidate.currentQuestionIndex = candidate.answers.length;
      }
    },
    completeInterview: (state, action: PayloadAction<{ candidateId: string; score: number; summary: string }>) => {
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate) {
        candidate.status = 'completed';
        candidate.score = action.payload.score;
        candidate.summary = action.payload.summary;
        candidate.completedAt = new Date().toISOString();
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        // Handle case where API returns error or non-array data
        if (Array.isArray(action.payload)) {
          state.candidates = action.payload.map((candidate: any) => ({
            ...candidate,
            id: candidate._id || candidate.id
          }));
        } else {
          console.warn('API returned non-array data:', action.payload);
          state.candidates = [];
        }
        state.loading = false;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        const candidate = action.payload;
        if (candidate && (candidate._id || candidate.id)) {
          state.candidates.push({ ...candidate, id: candidate._id || candidate.id });
        }
        state.loading = false;
      })
      .addCase(addAnswerToCandidate.fulfilled, (state, action) => {
        const payload = action.payload;
        
        if (payload.isLocal) {
          // Handle local candidate
          const candidate = state.candidates.find(c => c.id === payload.candidateId);
          if (candidate) {
            candidate.answers.push(payload.answer);
            candidate.currentQuestionIndex = candidate.answers.length;
          }
        } else {
          // Handle backend candidate
          const candidate = payload;
          const index = state.candidates.findIndex(c => c.id === (candidate._id || candidate.id));
          if (index !== -1) {
            state.candidates[index] = { ...candidate, id: candidate._id || candidate.id };
          }
        }
        state.loading = false;
      })
      .addCase(completeInterviewBackend.fulfilled, (state, action) => {
        const payload = action.payload;
        
        if (payload.isLocal) {
          // Handle local candidate
          const candidate = state.candidates.find(c => c.id === payload.candidateId);
          if (candidate) {
            candidate.status = 'completed';
            candidate.score = payload.score;
            candidate.summary = payload.summary;
            candidate.completedAt = new Date().toISOString();
          }
        } else {
          // Handle backend candidate
          const candidate = payload;
          const index = state.candidates.findIndex(c => c.id === (candidate._id || candidate.id));
          if (index !== -1) {
            state.candidates[index] = { ...candidate, id: candidate._id || candidate.id };
          }
        }
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
        }
      );
  }
});

export const { addCandidate, updateCandidate, addAnswer, completeInterview } = candidatesSlice.actions;
export default candidatesSlice.reducer;