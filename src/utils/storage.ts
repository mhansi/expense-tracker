import { Expense } from "../types/expense";

const LOCAL_STORAGE_EXPENSES_KEY = 'EXPENSES_LOCAL';
const LOCAL_STORAGE_PENDING_KEY = 'EXPENSES_PENDING';

export function saveExpensesToLocal(expenses: Expense[]) {
  localStorage.setItem(LOCAL_STORAGE_EXPENSES_KEY, JSON.stringify(expenses));
}

export function getExpensesFromLocal(): Expense[] {
  const data = localStorage.getItem(LOCAL_STORAGE_EXPENSES_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export interface PendingChange {
  type: 'add' | 'update' | 'delete';
  expense: Expense | { id: string };
}

export function getPendingChanges(): PendingChange[] {
  const data = localStorage.getItem(LOCAL_STORAGE_PENDING_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function setPendingChanges(changes: PendingChange[]) {
  localStorage.setItem(LOCAL_STORAGE_PENDING_KEY, JSON.stringify(changes));
}

export function addPendingChange(change: PendingChange) {
  const changes = getPendingChanges();
  changes.push(change);
  setPendingChanges(changes);
}