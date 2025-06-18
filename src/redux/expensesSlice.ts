import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Expense } from "../types/expense";

interface ExpensesState {
  expenses: Expense[];
  offlineQueue: Expense[];
  items: Expense[];
  syncing: boolean;
  offline: boolean;
  pendingChanges: number;
}

const initialState: ExpensesState = {
  expenses: [],
  items: [],
  offlineQueue: [],
  syncing: false,
  offline: false,
  pendingChanges: 0,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses(state, action: PayloadAction<Expense[]>) {
      state.expenses = action.payload;
    },
    addExpense(state, action: PayloadAction<Expense>) {
      state.expenses.unshift(action.payload);
      state.pendingChanges += 1;
    },
    updateExpense(state, action: PayloadAction<Expense>) {
      const idx = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) {
        state.expenses[idx] = action.payload;
        state.pendingChanges += 1;
      }
    },
    deleteExpense(state, action: PayloadAction<string>) {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
      state.pendingChanges += 1;
    },
    setSyncing(state, action: PayloadAction<boolean>) {
      state.syncing = action.payload;
    },
    setOffline(state, action: PayloadAction<boolean>) {
      state.offline = action.payload;
    },
    clearPendingChanges(state) {
      state.pendingChanges = 0;
    },
    replaceExpense(
      state,
      action: PayloadAction<{ oldId: string; newExpense: Expense }>
    ) {
      const idx = state.expenses.findIndex(
        (e) => e.id === action.payload.oldId
      );
      if (idx !== -1) {
        state.expenses[idx] = action.payload.newExpense;
      }
    },
  },
});

export const {
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setSyncing,
  setOffline,
  clearPendingChanges,
  replaceExpense,
} = expensesSlice.actions;

export default expensesSlice.reducer;
