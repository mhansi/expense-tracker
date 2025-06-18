import { Middleware } from "@reduxjs/toolkit";
import {
  addExpense,
  updateExpense,
  deleteExpense,
  setOffline,
  setSyncing,
  clearPendingChanges,
  replaceExpense,
} from "../redux/expensesSlice";
import {
  addPendingChange,
  getPendingChanges,
  setPendingChanges,
} from "../utils/storage";
import axios from "axios";
import { Expense } from "../types/expense";

export const offlineMiddleware: Middleware =
  (store) => (next) => async (action: any) => {
    const { dispatch } = store;
    const state = store.getState() as any;

    if (action.type === "@@network/ONLINE") {
      dispatch(setOffline(false));
      dispatch({ type: "expenses/syncPending" });
    }
    if (action.type === "@@network/OFFLINE") {
      dispatch(setOffline(true));
    }

    const isExpenseAction =
      action.type === addExpense.type ||
      action.type === updateExpense.type ||
      action.type === deleteExpense.type;

    if (isExpenseAction) {
      if (state.expenses.offline) {
        if (action.type === addExpense.type) {
          addPendingChange({ type: "add", expense: action.payload });
        } else if (action.type === updateExpense.type) {
          addPendingChange({ type: "update", expense: action.payload });
        } else if (action.type === deleteExpense.type) {
          addPendingChange({ type: "delete", expense: { id: action.payload } });
        }

        next(action);

        const expensesState = (store.getState() as any).expenses;
        localStorage.setItem(
          "EXPENSES_LOCAL",
          JSON.stringify(expensesState.expenses)
        );
        return;
      }
    }

    next(action);

    if (action.type === "expenses/syncPending") {
  dispatch(setSyncing(true));
  const pendingChanges = getPendingChanges();

  for (const change of pendingChanges) {
    try {
      if (change.type === "add") {
        // If the expense has an offline id, keep track of it
        const isOfflineId = typeof change.expense.id === "string" && change.expense.id.startsWith("offline-");
        const response = await axios.post("/api/expenses", change.expense);
        if (isOfflineId) {
          // Replace the offline expense with the server one
          dispatch(
            replaceExpense({
              oldId: change.expense.id,
              newExpense: response.data,
            })
          );
        }
      } else if (change.type === "update") {
        const exp = change.expense as Expense;
        await axios.put(`/api/expenses/${exp.id}`, exp);
      } else if (change.type === "delete") {
        const exp = change.expense as { id: string };
        await axios.delete(`/api/expenses/${exp.id}`);
      }
    } catch (error) {
      dispatch(setSyncing(false));
      return;
    }
  }

  setPendingChanges([]);
  dispatch(clearPendingChanges());
  dispatch(setSyncing(false));
  dispatch({ type: "expenses/refetch" });
}
  };
