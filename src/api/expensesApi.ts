import axios from 'axios';
import { Expense } from '../types/expense';

export interface FetchExpensesParams {
  page: number;
  limit: number;
  category?: string;
  sortBy?: 'date' | 'amount';
  order?: 'asc' | 'desc';
}

export interface PaginatedExpenses {
  data: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPageCount: number;
}

export async function fetchExpenses(params: FetchExpensesParams): Promise<PaginatedExpenses> {
  const response = await axios.get<PaginatedExpenses>('/api/expenses', {
    params,
  });
  return response.data;
}

export async function addExpenseAPI(expense: Omit<Expense, 'id'>): Promise<Expense> {
  const response = await axios.post<Expense>('/api/expenses', expense);
  return response.data;
}

export async function updateExpenseAPI(expense: Expense): Promise<Expense> {
  const response = await axios.put<Expense>(`/api/expenses/${expense.id}`, expense);
  return response.data;
}

export async function deleteExpenseAPI(id: string): Promise<void> {
  await axios.delete(`/api/expenses/${id}`);
}
