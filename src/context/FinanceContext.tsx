import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, MonthlyCashFlow, CategorySpending, CategoryName } from '../types/finance';
import { getFinancialInsights } from '../services/geminiService';

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => Transaction;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
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

// Bumped storage key so that old demo data from previous sessions is completely cleared
const STORAGE_KEY = 'wealthai_transactions_v2';
const LEGACY_STORAGE_KEY = 'wealthai_transactions';

const CATEGORY_COLORS: Record<CategoryName, string> = {
  Salary: '#10b981',    // Emerald
  Dining: '#f97316',    // Orange
  Tech: '#6366f1',      // Indigo
  Shopping: '#ec4899',  // Pink
  Gift: '#a855f7',      // Purple
  Invest: '#fbbf24',    // Gold
  Other: '#94a3b8',     // Slate
};

// Clean initial state: 0 demo transactions
export const INITIAL_TRANSACTIONS: Transaction[] = [];

const DEFAULT_INSIGHTS: string[] = [
  'Record your transactions to generate personalized AI wealth management insights.',
  'Authorize your primary capital accounts in Profile to unlock portfolio tracking.',
  'Discretionary expense management is ready. Log entries via voice or manual ledger.',
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      // Purge old legacy demo data key if present
      if (typeof window !== 'undefined' && localStorage.getItem(LEGACY_STORAGE_KEY)) {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load transactions from localStorage:', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [insights, setInsights] = useState<string[]>(DEFAULT_INSIGHTS);
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

  const clearAllTransactions = useCallback(() => {
    setTransactions([]);
    setInsights(DEFAULT_INSIGHTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
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
    if (transactions.length === 0) return 0.0;

    const priorTransactions = transactions.filter((t) => !t.date.startsWith(currentYearMonth));
    const balanceAtStartOfMonth = priorTransactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);

    const base = Math.abs(balanceAtStartOfMonth);
    if (base === 0) {
      return currentMonthNet > 0 ? 100.0 : (currentMonthNet < 0 ? -100.0 : 0.0);
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

  // Recurring expense detection
  const checkRecurringCandidate = useCallback((title: string, amount: number): boolean => {
    if (!title && (!amount || amount <= 0)) return false;

    const normalizedTitle = title.trim().toLowerCase();

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
    if (transactions.length === 0) {
      setInsights(DEFAULT_INSIGHTS);
      return;
    }
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
    clearAllTransactions,
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
