import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  RefreshCw,
  PieChart as PieIcon,
  ArrowUpRight,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import { formatCurrency } from '../../utils/currency';
import { getCategoryIcon } from '../transactions/TransactionItem';

export const AnalyticsScreen: React.FC = () => {
  const { categorySpendings, insights, isLoadingInsights, refreshInsights, currentMonthExpense } =
    useFinance();
  const { settings } = useAppSettings();

  const totalExpense = useMemo(() => {
    return categorySpendings.reduce((acc, c) => acc + c.amount, 0);
  }, [categorySpendings]);

  // Recommendation icons for the 3 distinct cards
  const recommendationIcons = [
    <TrendingUp className="w-5 h-5 text-amber-400" />,
    <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    <Zap className="w-5 h-5 text-orange-400" />,
  ];

  return (
    <div className="pb-28 pt-6 px-6 max-w-md mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#ffffff] tracking-tight">
            Portfolio Analytics
          </h2>
          <p className="text-xs text-white/40">Capital allocation & intelligence</p>
        </div>
        <button
          onClick={() => refreshInsights(settings.apiKey)}
          disabled={isLoadingInsights}
          className="p-2 rounded-xl glass-panel border border-white/10 hover:border-white/20 text-amber-400 transition-colors disabled:opacity-50"
          title="Refresh AI Analysis"
          aria-label="Refresh AI Analysis"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingInsights ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Donut Chart Section:
          Inner radius: 60, Outer: 80. Center text shows "Total Spent." */}
      <div className="p-6 rounded-3xl heavy-glass border border-white/15 relative overflow-hidden shadow-2xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Expense Breakdown</h3>
          </div>
          <span className="text-[11px] text-white/40">All-time active</span>
        </div>

        <div className="relative h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: any) => formatCurrency(Number(value), settings.currency)}
                contentStyle={{
                  backgroundColor: 'rgba(18, 13, 11, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Pie
                data={
                  categorySpendings.length > 0
                    ? categorySpendings
                    : [{ category: 'No Spend', amount: 1, color: 'rgba(255, 255, 255, 0.08)' }]
                }
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={categorySpendings.length > 0 ? 4 : 0}
                stroke="none"
              >
                {categorySpendings.length > 0 ? (
                  categorySpendings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))
                ) : (
                  <Cell fill="rgba(255, 255, 255, 0.08)" />
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text: "Total Spent" */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-white/40">
              Total Spent
            </span>
            <span className="text-xl font-extrabold text-[#ffffff] tracking-tight">
              {formatCurrency(totalExpense, settings.currency)}
            </span>
          </div>
        </div>

        {/* Legend: Color-coded list of categories with percentage values */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
          {categorySpendings.length > 0 ? (
            categorySpendings.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-white/70 truncate">{cat.category}</span>
                </div>
                <span className="font-bold text-white ml-2">{cat.percentage}%</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-white/40 text-center col-span-2 py-1">
              No category allocations yet. Log an expense to populate analytics.
            </p>
          )}
        </div>
      </div>

      {/* AI Recommendations: 3 distinct cards with icons based on Gemini's advice */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Wealth Advisory Directives
            </h3>
          </div>
          <span className="text-[10px] text-amber-300/80 font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
            3 Recommendations
          </span>
        </div>

        {insights.slice(0, 3).map((tip, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-amber-400/30 transition-all flex items-start gap-3.5 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/10 transition-colors">
              {recommendationIcons[idx % recommendationIcons.length]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Directive {idx + 1}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-amber-300 transition-colors" />
              </div>
              <p className="text-xs font-medium text-white/90 leading-relaxed">
                {tip}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
