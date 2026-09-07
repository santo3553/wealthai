'use client';

import React from 'react';
import { CalculationResults, CalculatorInputs } from '../types/calculator';
import { LeadInfo } from './ExecutiveSummaryModal';
import { SOFTWARE_TIERS } from '../utils/presets';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

interface PrintSummaryViewProps {
  inputs: CalculatorInputs;
  results: CalculationResults;
  lead: LeadInfo | null;
}

export const PrintSummaryView: React.FC<PrintSummaryViewProps> = ({
  inputs,
  results,
  lead,
}) => {
  const currentTier = SOFTWARE_TIERS[inputs.tier] || SOFTWARE_TIERS.pro;
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="hidden print:block w-full bg-white text-slate-900 p-8 font-sans">
      {/* Document Header */}
      <div className="border-b-2 border-slate-900 pb-6 mb-6 flex justify-between items-start">
        <div>
          <div className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            MetricsFlow <span className="text-emerald-700">ROI</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Executive Business Case & Financial Impact Summary
          </p>
        </div>

        <div className="text-right text-xs">
          <div className="font-bold text-slate-900 text-sm">
            {lead?.companyName || 'Executive Enterprise Brief'}
          </div>
          <div className="text-slate-600">
            Prepared for: {lead?.fullName ? `${lead.fullName} (${lead.workEmail})` : 'Executive Stakeholder'}
          </div>
          <div className="text-slate-400 mt-1">Report Date: {today}</div>
        </div>
      </div>

      {/* Hero Financial Value Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-slate-50 border border-emerald-600 rounded-lg">
          <div className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider">
            Net Annual Savings
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(results.netAnnualSavings)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Annual bottom-line impact</div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg">
          <div className="text-[11px] font-bold uppercase text-slate-700 tracking-wider">
            ROI Multiple
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {results.roiMultipleFormatted}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            ${results.roiMultiple.toFixed(2)} return per $1 spent
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg">
          <div className="text-[11px] font-bold uppercase text-slate-700 tracking-wider">
            Hours Reclaimed
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatNumber(results.annualHoursSaved)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Productive hours/year</div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg">
          <div className="text-[11px] font-bold uppercase text-slate-700 tracking-wider">
            Payback Timeline
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {results.paybackPeriodFormatted}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Break-even milestone</div>
        </div>
      </div>

      {/* Model Assumptions Grid */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider border-b border-slate-200 pb-1.5 mb-3">
          1. Operational & Workforce Assumptions
        </h3>
        <table className="w-full text-xs text-left border border-slate-200">
          <tbody className="divide-y divide-slate-200">
            <tr className="bg-slate-50">
              <td className="p-2 font-semibold text-slate-700 w-1/4">Dedicated Team Size</td>
              <td className="p-2 text-slate-900 w-1/4">{inputs.teamSize} Employees (FTEs)</td>
              <td className="p-2 font-semibold text-slate-700 w-1/4">Hourly Labor Rate</td>
              <td className="p-2 text-slate-900 w-1/4">${inputs.hourlyRate}/hour blended</td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-slate-700">Manual Hours / Week</td>
              <td className="p-2 text-slate-900">{inputs.weeklyHours} hrs/week per employee</td>
              <td className="p-2 font-semibold text-slate-700">Efficiency Gain</td>
              <td className="p-2 text-slate-900">{inputs.efficiencyGain}% process automation</td>
            </tr>
            <tr className="bg-slate-50">
              <td className="p-2 font-semibold text-slate-700">MetricsFlow Tier</td>
              <td className="p-2 text-slate-900">{currentTier.name} Plan (${currentTier.monthlyCost}/mo)</td>
              <td className="p-2 font-semibold text-slate-700">Annual Platform Cost</td>
              <td className="p-2 text-slate-900">{formatCurrency(results.annualPlatformCost)}/yr</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Financial Comparison Table */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider border-b border-slate-200 pb-1.5 mb-3">
          2. Financial Impact Breakdown
        </h3>
        <table className="w-full text-xs text-left border border-slate-200">
          <thead className="bg-slate-100 font-bold text-slate-800">
            <tr>
              <th className="p-2 border-b border-slate-300">Category</th>
              <th className="p-2 border-b border-slate-300">Status Quo (Manual)</th>
              <th className="p-2 border-b border-slate-300">With MetricsFlow</th>
              <th className="p-2 border-b border-slate-300 text-right">Net Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="p-2 font-medium">Repetitive Workload Hours</td>
              <td className="p-2">{formatNumber(inputs.teamSize * inputs.weeklyHours * 52)} hrs/yr</td>
              <td className="p-2">{formatNumber(inputs.teamSize * inputs.weeklyHours * 52 - results.annualHoursSaved)} hrs/yr</td>
              <td className="p-2 text-right font-bold text-emerald-800">-{formatNumber(results.annualHoursSaved)} hrs/yr</td>
            </tr>
            <tr>
              <td className="p-2 font-medium">Workforce Labor Expense</td>
              <td className="p-2">{formatCurrency(results.annualManualCost)}</td>
              <td className="p-2">{formatCurrency(results.annualManualCost - results.annualGrossSavings)}</td>
              <td className="p-2 text-right font-bold text-emerald-800">+{formatCurrency(results.annualGrossSavings)}</td>
            </tr>
            <tr>
              <td className="p-2 font-medium">Software Subscription</td>
              <td className="p-2">$0</td>
              <td className="p-2">{formatCurrency(results.annualPlatformCost)}</td>
              <td className="p-2 text-right text-slate-600">-${formatCurrency(results.annualPlatformCost)}</td>
            </tr>
            <tr className="bg-emerald-50 font-bold">
              <td className="p-2 text-slate-900">Net Annual Cost Savings</td>
              <td className="p-2 text-slate-500">$0</td>
              <td className="p-2 text-emerald-900">{formatCurrency(results.netAnnualSavings)}</td>
              <td className="p-2 text-right text-emerald-900 text-sm">+{formatCurrency(results.netAnnualSavings)}/yr</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3-Year Cumulative Projections */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider border-b border-slate-200 pb-1.5 mb-3">
          3. 3-Year Cumulative Projections
        </h3>
        <table className="w-full text-xs text-left border border-slate-200">
          <thead className="bg-slate-100 font-bold text-slate-800">
            <tr>
              <th className="p-2 border-b border-slate-300">Period</th>
              <th className="p-2 border-b border-slate-300">Cumulative Status Quo Cost</th>
              <th className="p-2 border-b border-slate-300">Cumulative Automated Cost</th>
              <th className="p-2 border-b border-slate-300 text-right">Cumulative Net Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {results.projections.map((p) => (
              <tr key={p.year}>
                <td className="p-2 font-semibold text-slate-800">{p.year}</td>
                <td className="p-2 text-slate-600">{formatCurrency(p.statusQuoCost)}</td>
                <td className="p-2 text-slate-600">{formatCurrency(p.costWithAutomation)}</td>
                <td className="p-2 text-right font-bold text-emerald-800">+{formatCurrency(p.cumulativeSavings)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signatures / Execution Block */}
      <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-600">
        <div>
          <div className="border-b border-slate-400 pb-1 w-48 mb-1"></div>
          <div className="font-semibold text-slate-800">Executive Sponsor Signature</div>
          <div className="text-[10px] text-slate-400">Date: ________________________</div>
        </div>
        <div>
          <div className="border-b border-slate-400 pb-1 w-48 mb-1"></div>
          <div className="font-semibold text-slate-800">MetricsFlow Solutions Architect</div>
          <div className="text-[10px] text-slate-400">Date: ________________________</div>
        </div>
      </div>
    </div>
  );
};
