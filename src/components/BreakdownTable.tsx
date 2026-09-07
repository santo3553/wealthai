'use client';

import React from 'react';
import { CheckCircle2, ArrowRight, Shield, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { CalculationResults, CalculatorInputs } from '../types/calculator';
import { SOFTWARE_TIERS } from '../utils/presets';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

interface BreakdownTableProps {
  inputs: CalculatorInputs;
  results: CalculationResults;
}

export const BreakdownTable: React.FC<BreakdownTableProps> = ({ inputs, results }) => {
  const currentTier = SOFTWARE_TIERS[inputs.tier] || SOFTWARE_TIERS.pro;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/20 backdrop-blur-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Executive Financial Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Direct comparison between Status Quo and MetricsFlow Automation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
            Tier: {currentTier.name} (${currentTier.monthlyCost}/mo)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="pb-3 font-semibold">Financial Metric</th>
              <th className="pb-3 font-semibold">Status Quo (Manual)</th>
              <th className="pb-3 font-semibold text-emerald-400">With MetricsFlow</th>
              <th className="pb-3 font-semibold text-right text-emerald-300">Net Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {/* 1. Manual Hours Dedicated */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 font-medium text-slate-200">
                Annual Repetitive Manual Hours
                <div className="text-[11px] text-slate-400">
                  {inputs.teamSize} employees × {inputs.weeklyHours} hrs/wk × 52 wks
                </div>
              </td>
              <td className="py-3 text-slate-300">
                {formatNumber(inputs.teamSize * inputs.weeklyHours * 52)} hrs/yr
              </td>
              <td className="py-3 text-emerald-400 font-medium">
                {formatNumber(inputs.teamSize * inputs.weeklyHours * 52 - results.annualHoursSaved)} hrs/yr
              </td>
              <td className="py-3 text-right font-bold text-emerald-400">
                -{formatNumber(results.annualHoursSaved)} hrs ({inputs.efficiencyGain}% saved)
              </td>
            </tr>

            {/* 2. Workforce Labor Expense */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 font-medium text-slate-200">
                Annual Workforce Labor Expense
                <div className="text-[11px] text-slate-400">
                  Dedicated manual hours × ${inputs.hourlyRate}/hr labor rate
                </div>
              </td>
              <td className="py-3 text-slate-300">
                {formatCurrency(results.annualManualCost)}
              </td>
              <td className="py-3 text-indigo-300 font-medium">
                {formatCurrency(results.annualManualCost - results.annualGrossSavings)}
              </td>
              <td className="py-3 text-right font-bold text-emerald-400">
                +{formatCurrency(results.annualGrossSavings)} Gross
              </td>
            </tr>

            {/* 3. Software Subscription Cost */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 font-medium text-slate-200">
                Software Platform Investment
                <div className="text-[11px] text-slate-400">
                  MetricsFlow {currentTier.name} plan (${currentTier.monthlyCost}/month billed annually)
                </div>
              </td>
              <td className="py-3 text-slate-400">$0.00</td>
              <td className="py-3 text-slate-300 font-medium">
                {formatCurrency(results.annualPlatformCost)}/yr
              </td>
              <td className="py-3 text-right font-semibold text-slate-400">
                -${formatCurrency(results.annualPlatformCost)}/yr
              </td>
            </tr>

            {/* 4. Net Annual Savings */}
            <tr className="bg-emerald-950/20 hover:bg-emerald-950/30 transition-colors">
              <td className="py-3.5 font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Net Annual Value / Savings
              </td>
              <td className="py-3.5 text-slate-400 font-medium">$0</td>
              <td className="py-3.5 text-emerald-300 font-bold">
                {formatCurrency(results.netAnnualSavings)}
              </td>
              <td className="py-3.5 text-right font-extrabold text-emerald-400 text-base">
                +{formatCurrency(results.netAnnualSavings)}
              </td>
            </tr>

            {/* 5. 3-Year Cumulative Net Profit */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 font-medium text-slate-200">
                3-Year Cumulative Net Savings
                <div className="text-[11px] text-slate-400">
                  Compound capital saved over a 36-month operational cycle
                </div>
              </td>
              <td className="py-3 text-slate-400">$0</td>
              <td className="py-3 text-slate-200 font-medium">
                {formatCurrency((results.projections[2]?.cumulativeSavings || 0))}
              </td>
              <td className="py-3 text-right font-bold text-emerald-400">
                +{formatCurrency((results.projections[2]?.cumulativeSavings || 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
