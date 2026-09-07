'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Sparkles, HelpCircle } from 'lucide-react';
import { YearProjection } from '../types/calculator';
import { formatCurrency } from '../utils/formatters';

interface ChartSectionProps {
  projections: YearProjection[];
}

type ChartType = 'bar' | 'area';
type ProjectionView = 'cumulative' | 'annual';

export const ChartSection: React.FC<ChartSectionProps> = ({ projections }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [projectionView, setProjectionView] = useState<ProjectionView>('cumulative');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = projections.map((p) => {
    if (projectionView === 'cumulative') {
      return {
        year: p.year,
        statusQuo: p.statusQuoCost,
        automation: p.costWithAutomation,
        savings: p.cumulativeSavings,
      };
    } else {
      return {
        year: p.year,
        statusQuo: p.annualManualCost,
        automation: p.annualAutomationCost,
        savings: p.annualNetSavings,
      };
    }
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const statusQuoVal = payload.find((p: any) => p.dataKey === 'statusQuo')?.value || 0;
      const automationVal = payload.find((p: any) => p.dataKey === 'automation')?.value || 0;
      const netSavingsVal = statusQuoVal - automationVal;

      return (
        <div className="bg-slate-950/95 border border-slate-700/80 p-4 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-2.5 min-w-[220px]">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] text-slate-400 capitalize">{projectionView} View</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80" />
                <span>Status Quo Cost:</span>
              </div>
              <span className="font-semibold text-slate-200">{formatCurrency(statusQuoVal)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                <span>With Automation:</span>
              </div>
              <span className="font-semibold text-indigo-300">{formatCurrency(automationVal)}</span>
            </div>

            <div className="pt-2 border-t border-slate-800/90 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Net Savings:</span>
              </div>
              <span className="font-bold text-emerald-400 text-sm">
                +{formatCurrency(netSavingsVal)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/20 backdrop-blur-sm space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              3-Year Financial Trajectory
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
              Status Quo vs. Automation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Projected cumulative cost curves comparing current manual operations against MetricsFlow.
          </p>
        </div>

        {/* View and Chart Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Cumulative vs Annual Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setProjectionView('cumulative')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                projectionView === 'cumulative'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cumulative
            </button>
            <button
              type="button"
              onClick={() => setProjectionView('annual')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                projectionView === 'annual'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Annual
            </button>
          </div>

          {/* Bar vs Area Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'bar'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grouped Bar Chart"
              aria-label="Grouped Bar Chart"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'area'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Area Comparison Chart"
              aria-label="Area Comparison Chart"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        {!isMounted ? (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
            Loading chart visualization...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => formatCurrency(val, true)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.3 }} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                  formatter={(value) => {
                    if (value === 'statusQuo') return <span className="text-slate-400">Status Quo Cost</span>;
                    if (value === 'automation') return <span className="text-indigo-300">Cost with Automation</span>;
                    return value;
                  }}
                />
                <Bar
                  dataKey="statusQuo"
                  name="statusQuo"
                  fill="#f43f5e"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={55}
                />
                <Bar
                  dataKey="automation"
                  name="automation"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={55}
                />
              </BarChart>
            ) : (
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorStatusQuo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAutomation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => formatCurrency(val, true)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                  formatter={(value) => {
                    if (value === 'statusQuo') return <span className="text-slate-400">Status Quo Cost</span>;
                    if (value === 'automation') return <span className="text-emerald-300">Cost with Automation</span>;
                    return value;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="statusQuo"
                  name="statusQuo"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorStatusQuo)"
                />
                <Area
                  type="monotone"
                  dataKey="automation"
                  name="automation"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAutomation)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* 3-Year Projection Summary Pill Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">3-Year Cumulative Savings</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {formatCurrency(projections[2]?.cumulativeSavings || 0)}
          </div>
          <div className="text-[10px] text-slate-400">Total net capital retained</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">3-Year Status Quo Cost</div>
          <div className="text-lg font-bold text-slate-300 mt-0.5">
            {formatCurrency(projections[2]?.statusQuoCost || 0)}
          </div>
          <div className="text-[10px] text-slate-400">Manual labor expenditure</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">3-Year Cost with Automation</div>
          <div className="text-lg font-bold text-indigo-300 mt-0.5">
            {formatCurrency(projections[2]?.costWithAutomation || 0)}
          </div>
          <div className="text-[10px] text-slate-400">Labor + software platform</div>
        </div>
      </div>
    </div>
  );
};
