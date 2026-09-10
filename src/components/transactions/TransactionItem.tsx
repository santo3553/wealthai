import React from 'react';
import {
  Wallet,
  Utensils,
  Laptop,
  ShoppingBag,
  Gift,
  TrendingUp,
  CircleDollarSign,
  Trash2,
} from 'lucide-react';
import { Transaction, CategoryName } from '../../types/finance';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/currency';

interface TransactionItemProps {
  transaction: Transaction;
  showDelete?: boolean;
}

export const getCategoryIcon = (category: CategoryName | string) => {
  switch (category) {
    case 'Salary':
      return <Wallet className="w-5 h-5 text-emerald-400" />;
    case 'Dining':
      return <Utensils className="w-5 h-5 text-orange-400" />;
    case 'Tech':
      return <Laptop className="w-5 h-5 text-indigo-400" />;
    case 'Shopping':
      return <ShoppingBag className="w-5 h-5 text-pink-400" />;
    case 'Gift':
      return <Gift className="w-5 h-5 text-purple-400" />;
    case 'Invest':
      return <TrendingUp className="w-5 h-5 text-amber-400" />;
    default:
      return <CircleDollarSign className="w-5 h-5 text-amber-300" />;
  }
};

export const getCategoryBadgeBg = (category: CategoryName | string) => {
  switch (category) {
    case 'Salary':
      return 'bg-emerald-500/10 border-emerald-500/20';
    case 'Dining':
      return 'bg-orange-500/10 border-orange-500/20';
    case 'Tech':
      return 'bg-indigo-500/10 border-indigo-500/20';
    case 'Shopping':
      return 'bg-pink-500/10 border-pink-500/20';
    case 'Gift':
      return 'bg-purple-500/10 border-purple-500/20';
    case 'Invest':
      return 'bg-amber-500/10 border-amber-500/20';
    default:
      return 'bg-white/10 border-white/20';
  }
};

/**
 * Item UI:
 * - Left icon (category specific)
 * - Center text (Title/Time)
 * - Right side amount (Green for +, White for -)
 */
export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  showDelete = false,
}) => {
  const { settings } = useAppSettings();
  const { deleteTransaction } = useFinance();

  const isIncome = transaction.type === 'income';

  return (
    <div className="group flex items-center justify-between p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all">
      {/* Left Icon (Category Specific) */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-inner shrink-0 ${getCategoryBadgeBg(
            transaction.category
          )}`}
        >
          {getCategoryIcon(transaction.category)}
        </div>

        {/* Center Text (Title / Time) */}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#ffffff] truncate tracking-tight">
            {transaction.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-white/40">
            <span>{transaction.time}</span>
            <span>•</span>
            <span className="truncate">{transaction.category}</span>
          </div>
        </div>
      </div>

      {/* Right Side Amount: Green for +, White for - */}
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <div className="text-right">
          <span
            className={`text-sm font-bold tracking-tight block ${
              isIncome ? 'text-[#10b981]' : 'text-[#ffffff]'
            }`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount, settings.currency)}
          </span>
          <span className="text-[10px] text-white/30 capitalize">
            {transaction.type}
          </span>
        </div>

        {showDelete && (
          <button
            onClick={() => deleteTransaction(transaction.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-all ml-1"
            title="Delete transaction"
            aria-label="Delete transaction"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
