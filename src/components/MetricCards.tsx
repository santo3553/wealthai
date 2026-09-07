'use client';

import React from 'react';
import {
  TrendingUp,
  Clock,
  CalendarCheck,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CalculationResults } from '../types/calculator';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface MetricCardsProps {
  results: CalculationResults;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ results }) => {
  const {
    netAnnualSavings,
    annualGrossSavings,
    annualPlatformCost,
    roiMultiple,
    roiMultipleFormatted,
    annualHoursSaved,
    paybackPeriodFormatted,
  } = results;

  // Approximate FTE equivalent (assuming 2,000 work hours/year)
  const fteEquivalent = (annualHoursSaved / 2000).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Net Annual Savings (Hero Card with glowing emerald accent) */}
      <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/50 p-5 shadow-[0_0_30px_-8px_rgba(16,185,129,0.3)] transition-all duration-300 hover:border-emerald-400">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Net Annual Savings
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ArrowUpRight className="w-3 h-3" />
            Bottom Line
          </span>
        </div>

        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-1">
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
              {formatCurrency(netAnnualSavings)}
            </span>
            <span className="text-xs text-emerald-400/80 font-normal">/yr</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between border-t border-emerald-500/20 pt-2">
            <span>Gross: {formatCurrency(annualGrossSavings, true)}</span>
            <span className="text-slate-400">Cost: {formatCurrency(annualPlatformCost, true)}</span>
          </p>
        </div>
      </div>

      {/* 2. ROI Multiple */}
      <div className="relative group overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            ROI Multiple
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {roiMultiple >= 5 ? 'High Impact' : 'Positive Return'}
          </span>
        </div>

        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-1">
            <span className="text-white">{roiMultipleFormatted}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800/80 pt-2 truncate">
            ${roiMultiple.toFixed(2)} generated per $1 software cost
          </p>
        </div>
      </div>

      {/* 3. Total Hours Reclaimed */}
      <div className="relative group overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            Total Hours Reclaimed
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Workforce
          </span>
        </div>

        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-1">
            <span className="text-white">{formatNumber(annualHoursSaved)}</span>
            <span className="text-xs text-slate-400 font-normal">hrs/yr</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800/80 pt-2 truncate">
            Equivalent to ~{fteEquivalent} full-time roles unlocked
          </p>
        </div>
      </div>

      {/* 4. Payback Time */}
      <div className="relative group overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-teal-400" />
            Payback Time
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            Speed to Value
          </span>
        </div>

        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-1">
            <span className="text-white">{paybackPeriodFormatted}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800/80 pt-2 truncate">
            Fast capital recovery & immediate cash flow ROI
          </p>
        </div>
      </div>
    </div>
  );
};
