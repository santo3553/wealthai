import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import { formatCurrency } from '../../utils/currency';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  currency: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="heavy-glass p-3 rounded-xl border border-white/20 shadow-2xl text-xs">
        <p className="font-semibold text-white/90 mb-1">{label}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4 my-0.5">
            <span className="flex items-center gap-1.5 text-white/60">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}:
            </span>
            <span className="font-medium text-white">
              {formatCurrency(item.value, currency)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const CashFlowChart: React.FC = () => {
  const { monthlyCashFlows } = useFinance();
  const { settings } = useAppSettings();

  return (
    <div className="mx-6 mt-6 p-5 rounded-3xl glass-panel border border-white/10 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">Cash Flow Analysis</h3>
          <p className="text-[11px] text-white/40">Inflow vs. Outflow trajectory</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
            <span className="text-white/60">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f97316]" />
            <span className="text-white/60">Expense</span>
          </div>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyCashFlows} barGap={6} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 11 }}
            />
            <Tooltip
              content={<CustomTooltip currency={settings.currency} />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
            />
            {/* Dual Bars with exact rounded corners (radius:[4, 4, 0, 0]) */}
            <Bar
              dataKey="income"
              name="Income"
              fill="#fbbf24"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
