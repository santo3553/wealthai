import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, MonthlyCashFlow, CategorySpending, CategoryName } from '../types/finance';
import { getFinancialInsights } from '../services/geminiService';

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => Transaction;
  deleteTransaction: (id: string) => void;
  totalBalance: number;
  currentMonthIncome: number;
  currentMonthExpense: number;
  currentMonthNet: number;
  growthPercentage: number;
  monthlyCashFlows: MonthlyCashFlow[];
  categorySpendings: CategorySpending[];
  checkRecurringCandidate: (title: string, amount: number) => boolean;
  insights: string[];
  isLoadingInsights: boolean;
  refreshInsights: (apiKey?: string) => Promise<void>;
}

const STORAGE_KEY = 'wealthai_transactions';

const CATEGORY_COLORS: Record<CategoryName, string> = {
  Salary: '#10b981',    // Emerald
  Dining: '#f97316',    // Orange
  Tech: '#6366f1',      // Indigo
  Shopping: '#ec4899',  // Pink
  Gift: '#a855f7',      // Purple
  Invest: '#fbbf24',    // Gold
  Other: '#94a3b8',     // Slate
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Executive Advisory Retainer',
    amount: 18500.0,
    type: 'income',
    category: 'Salary',
    date: '2026-09-10',
    time: '09:15',
    icon: 'Wallet',
  },
  {
    id: 'tx-2',
    title: 'Le Bernardin Private Dining',
    amount: 1420.5,
    type: 'expense',
    category: 'Dining',
    date: '2026-09-09',
    time: '21:30',
    icon: 'Utensils',
  },
  {
    id: 'tx-3',
    title: 'Apple Vision Pro M3 Tranche',
    amount: 3899.0,
    type: 'expense',
    category: 'Tech',
    date: '2026-09-06',
    time: '14:20',
    icon: 'Laptop',
  },
  {
    id: 'tx-4',
    title: 'Venture Seed Liquidity Yield',
    amount: 9250.0,
    type: 'income',
    category: 'Invest',
    date: '2026-09-04',
    time: '11:00',
    icon: 'TrendingUp',
  },
  {
    id: 'tx-5',
    title: 'Hermès Private Client Order',
    amount: 4650.0,
    type: 'expense',
    category: 'Shopping',
    date: '2026-09-02',
    time: '16:45',
    icon: 'ShoppingBag',
  },
  {
    id: 'tx-6',
    title: 'Endowment Philanthropy Contribution',
    amount: 2500.0,
    type: 'expense',
    category: 'Gift',
    date: '2026-08-28',
    time: '10:00',
    icon: 'Gift',
  },
  {
    id: 'tx-7',
    title: 'Private Equity Distribution',
    amount: 24000.0,
    type: 'income',
    category: 'Invest',
    date: '2026-08-15',
    time: '15:30',
    icon: 'TrendingUp',
  },
  {
    id: 'tx-8',
    title: 'Cloud Infrastructure Cluster',
    amount: 1200.0,
    type: 'expense',
    category: 'Tech',
    date: '2026-08-10',
    time: '13:00',
    icon: 'Laptop',
  },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load transactions from localStorage:', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [insights, setInsights] = useState<string[]>([
    'High liquidity detected; allocate 15% surplus capital to high-yield treasury instruments.',
    'Discretionary lifestyle spending is disciplined; continue scaling venture equity tranches.',
    'Maintain a 6-month prime liquidity buffer before committing to new angel rounds.',
  ]);
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);

  // Auto-sync all changes to window.localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Failed to save transactions to localStorage:', e);
    }
  }, [transactions]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>): Transaction => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Total balance: all income - all expense
  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
  }, [transactions]);

  // Current Month calculations
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(currentYearMonth));
  }, [transactions, currentYearMonth]);

  const currentMonthIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [currentMonthTransactions]);

  const currentMonthExpense = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [currentMonthTransactions]);

  const currentMonthNet = currentMonthIncome - currentMonthExpense;

  // Growth logic: (currentMonthNet / |balanceAtStartOfMonth|) * 100
  const growthPercentage = useMemo(() => {
    const priorTransactions = transactions.filter((t) => !t.date.startsWith(currentYearMonth));
    const balanceAtStartOfMonth = priorTransactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);

    const base = Math.abs(balanceAtStartOfMonth);
    if (base === 0) {
      return currentMonthNet >= 0 ? 12.5 : -5.0; // Graceful default if initial month
    }
    return Number(((currentMonthNet / base) * 100).toFixed(1));
  }, [transactions, currentYearMonth, currentMonthNet]);

  // Monthly Cashflows for Dual Bar Chart & History Accordion
  const monthlyCashFlows = useMemo(() => {
    const monthMap: Record<string, { income: number; expense: number }> = {};
    
    // Initialize past 4 months for smooth visual display
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap[key] = { income: 0, expense: 0 };
    }

    transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      if (!monthMap[key]) {
        monthMap[key] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthMap[key].income += t.amount;
      } else {
        monthMap[key].expense += t.amount;
      }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-5)
      .map(([key, data]) => {
        const [y, m] = key.split('-');
        const label = `${monthNames[parseInt(m, 10) - 1]} ${y.slice(2)}`;
        return {
          month: label,
          income: Math.round(data.income),
          expense: Math.round(data.expense),
          net: Math.round(data.income - data.expense),
        };
      });
  }, [transactions]);

  // Category Spendings for Donut Chart
  const categorySpendings = useMemo(() => {
    const expenseTx = transactions.filter((t) => t.type === 'expense');
    const totalExp = expenseTx.reduce((acc, t) => acc + t.amount, 0);
    const catMap: Record<string, number> = {};

    expenseTx.forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

    return Object.entries(catMap).map(([cat, amount]) => {
      const category = cat as CategoryName;
      return {
        category,
        amount: Math.round(amount),
        percentage: totalExp > 0 ? Math.round((amount / totalExp) * 100) : 0,
        color: CATEGORY_COLORS[category] || '#94a3b8',
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Recurring expense detection:
  // "Compare new input with previous history. If a similar amount/title exists in the previous month, show a banner:
  // 'This looks like a recurring monthly expense. Schedule it?'"
  const checkRecurringCandidate = useCallback((title: string, amount: number): boolean => {
    if (!title && (!amount || amount <= 0)) return false;

    const normalizedTitle = title.trim().toLowerCase();

    // Check transactions in previous 45 days
    const past45Days = new Date();
    past45Days.setDate(past45Days.getDate() - 45);

    return transactions.some((t) => {
      if (t.type !== 'expense') return false;
      const txDate = new Date(t.date);
      if (txDate > past45Days) {
        const sameTitle = normalizedTitle.length > 2 && t.title.toLowerCase().includes(normalizedTitle);
        const similarAmount = amount > 0 && Math.abs(t.amount - amount) / Math.max(t.amount, 1) < 0.05;
        return sameTitle || similarAmount;
      }
      return false;
    });
  }, [transactions]);

  const refreshInsights = useCallback(async (apiKey?: string) => {
    setIsLoadingInsights(true);
    try {
      const res = await getFinancialInsights(transactions, apiKey);
      if (res && res.length > 0) {
        setInsights(res);
      }
    } catch (err) {
      console.warn('Failed to refresh insights:', err);
    } finally {
      setIsLoadingInsights(false);
    }
  }, [transactions]);

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    totalBalance,
    currentMonthIncome,
    currentMonthExpense,
    currentMonthNet,
    growthPercentage,
    monthlyCashFlows,
    categorySpendings,
    checkRecurringCandidate,
    insights,
    isLoadingInsights,
    refreshInsights,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
