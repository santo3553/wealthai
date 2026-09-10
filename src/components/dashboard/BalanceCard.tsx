import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import { formatCurrency } from '../../utils/currency';

export const BalanceCard: React.FC = () => {
  const { totalBalance, growthPercentage, currentMonthIncome, currentMonthExpense } = useFinance();
  const { settings } = useAppSettings();

  const isPositive = growthPercentage >= 0;

  return (
    <div className="mx-6 p-6 rounded-3xl heavy-glass border border-white/15 relative overflow-hidden shadow-2xl">
      {/* Decorative Gold Sheen */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Balance Title & Currency Indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Total Net Worth
        </span>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/10 text-amber-300/90 border border-white/10">
          {settings.currency}
        </span>
      </div>

      {/* Big #ffffff Balance */}
      <div className="mt-2 text-4xl font-extrabold tracking-tight text-[#ffffff] font-sans">
        {formatCurrency(totalBalance, settings.currency)}
      </div>

      {/* Underneath: % Growth Label */}
      {/* Logic: Calculate (currentMonthNet / |balanceAtStartOfMonth|) * 100 */}
      <div className="mt-3 flex items-center gap-2">
        <div
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            isPositive
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
          <span>{isPositive ? `+${growthPercentage}%` : `${growthPercentage}%`}</span>
        </div>
        <span className="text-xs text-white/40 font-medium">vs. previous month</span>
      </div>

      {/* Monthly Inflow / Outflow Quick Stats */}
      <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-[11px] text-white/40 block">This Month In</span>
            <span className="text-sm font-semibold text-emerald-400">
              +{formatCurrency(currentMonthIncome, settings.currency)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <span className="text-[11px] text-white/40 block">This Month Out</span>
            <span className="text-sm font-semibold text-white/90">
              -{formatCurrency(currentMonthExpense, settings.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
