import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import candidatesReducer from './candidatesSlice';
import interviewReducer from './interviewSlice';
import uiReducer from './uiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['candidates', 'interview']
};

const rootReducer = combineReducers({
  candidates: candidatesReducer,
  interview: interviewReducer,
  ui: uiReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;