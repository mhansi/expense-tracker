import { configureStore } from '@reduxjs/toolkit';
import { offlineMiddleware } from './offlineMiddleware';
import expensesReducer from './expensesSlice';

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(offlineMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
