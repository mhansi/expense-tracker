import { http, HttpResponse } from 'msw';
import { Expense } from '../types/expense';

let expenses: Expense[] = [
  { id: '1', title: 'Groceries', amount: 50, date:"2025/07/04", category:'Food' },
  { id: '2', title: 'Gas', amount: 30, date:"2025/07/04", category: 'Food' },
];

export const handlers = [
  http.get('/api/expenses', ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('limit') || '10', 10);
  const category = searchParams.get('category');
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('order') || 'asc';

  let results = [...expenses];

  // Filter by category
  if (category) {
    results = results.filter(expense => expense.category === category);
  }

  // Sort by date or amount
  if (sortBy === 'date' || sortBy === 'amount') {
    results.sort((a, b) => {
      const aVal = sortBy === 'date' ? new Date(a.date).getTime() : a.amount;
      const bVal = sortBy === 'date' ? new Date(b.date).getTime() : b.amount;

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

  // Pagination logic
  const start = (page - 1) * pageSize;
  const paginatedResults = results.slice(start, start + pageSize);
  const totalPageCount = Math.ceil(results.length / pageSize);


  return HttpResponse.json({
    data: paginatedResults,
    total: results.length,
    page,
    pageSize,
    totalPageCount,
  }, { status: 200 });
}),

  http.post('/api/expenses', async ({ request, ...ctx }) => {
    const newExpense = await request.json() as Expense;
    expenses.push(newExpense);
    return HttpResponse.json(newExpense, { status: 201 });
  }),
  http.put('/api/expenses/:id', async ({ request, params, ...ctx }) => {
    const { id } = params;
    const updated = await request.json() as Expense;
    expenses = expenses.map(exp => (exp.id === id ? updated : exp));
    return HttpResponse.json(updated);
  }),
  http.delete('/api/expenses/:id', ({ params, ...ctx }) => {
    const { id } = params;
    expenses = expenses.filter(exp => exp.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];