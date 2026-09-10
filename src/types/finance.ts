export type TransactionType = 'income' | 'expense';

export type CategoryName =
  | 'Salary'
  | 'Dining'
  | 'Tech'
  | 'Shopping'
  | 'Gift'
  | 'Invest'
  | 'Other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: CategoryName;
  date: string; // ISO date format YYYY-MM-DD
  time: string; // HH:mm format, e.g. "14:32"
  icon: string; // Icon name e.g. 'Wallet', 'Utensils', 'Laptop', 'ShoppingBag', 'Gift', 'TrendingUp'
}

export interface MonthlyCashFlow {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategorySpending {
  category: CategoryName;
  amount: number;
  percentage: number;
  color: string;
}
