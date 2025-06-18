export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: 'Food' | 'Travel' | 'Shopping' | 'Other';
  notes?: string;
  synced?: boolean;
}
