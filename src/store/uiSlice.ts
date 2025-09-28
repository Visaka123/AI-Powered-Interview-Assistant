import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  activeTab: 'interviewee' | 'interviewer';
  showWelcomeBack: boolean;
}

const initialState: UIState = {
  activeTab: 'interviewee',
  showWelcomeBack: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'interviewee' | 'interviewer'>) => {
      state.activeTab = action.payload;
    },
    setShowWelcomeBack: (state, action: PayloadAction<boolean>) => {
      state.showWelcomeBack = action.payload;
    }
  }
});

export const { setActiveTab, setShowWelcomeBack } = uiSlice.actions;
export default uiSlice.reducer;