'use client';

import React from 'react';
import {
  Users,
  Clock,
  DollarSign,
  Zap,
  Layers,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { CalculatorInputs, TierId, PresetId } from '../types/calculator';
import { INDUSTRY_PRESETS, SOFTWARE_TIERS } from '../utils/presets';
import { formatCurrency } from '../utils/formatters';

interface InputPanelProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
  onApplyPreset: (presetId: PresetId) => void;
  activePreset: PresetId | null;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  inputs,
  onChange,
  onApplyPreset,
  activePreset,
}) => {
  const updateField = <K extends keyof CalculatorInputs>(
    field: K,
    value: CalculatorInputs[K]
  ) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  const handleNumericInput = (
    field: 'teamSize' | 'weeklyHours' | 'hourlyRate' | 'efficiencyGain',
    value: string,
    min: number,
    max: number
  ) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    const clamped = Math.max(min, Math.min(max, num));
    updateField(field, clamped);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/20 backdrop-blur-sm space-y-7">
      {/* Industry Presets Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Quick Industry Presets
          </label>
          <span className="text-[11px] text-slate-400">1-Click Auto-Fill</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {INDUSTRY_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset.id)}
                className={`group relative text-left p-3 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500/60 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/50 border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-white group-hover:text-emerald-300 transition-colors">
                    {preset.name}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {preset.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {preset.weeklyHours}h/wk • ${preset.hourlyRate}/h • {preset.efficiencyGain}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders & Numeric Controls */}
      <div className="space-y-6 pt-1 border-t border-slate-800/60">
        <h2 className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Workforce & Labor Inputs
        </h2>

        {/* 1. Team Size */}
        <div className="space-y-2.5 group">
          <div className="flex items-center justify-between">
            <label
              htmlFor="team-size-slider"
              className="text-sm font-medium text-slate-200 flex items-center gap-2 cursor-pointer"
            >
              <span className="p-1.5 rounded-lg bg-indigo-950/50 border border-indigo-800/40 text-indigo-400">
                <Users className="w-4 h-4" />
              </span>
              <span>Team Size</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Employees:</span>
              <div className="relative">
                <input
                  type="number"
                  id="team-size-input"
                  min={1}
                  max={250}
                  value={inputs.teamSize}
                  onChange={(e) => handleNumericInput('teamSize', e.target.value, 1, 250)}
                  className="w-18 px-2.5 py-1 text-right text-sm font-semibold text-emerald-400 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label="Team size value"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              id="team-size-slider"
              min={1}
              max={250}
              step={1}
              value={inputs.teamSize}
              onChange={(e) => updateField('teamSize', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <div className="flex justify-between text-[11px] text-slate-400 px-0.5">
              <span>1 FTE</span>
              <span>125 FTEs</span>
              <span>250 FTEs</span>
            </div>
          </div>
        </div>

        {/* 2. Weekly Manual Hours per Employee */}
        <div className="space-y-2.5 group">
          <div className="flex items-center justify-between">
            <label
              htmlFor="weekly-hours-slider"
              className="text-sm font-medium text-slate-200 flex items-center gap-2 cursor-pointer"
            >
              <span className="p-1.5 rounded-lg bg-amber-950/50 border border-amber-800/40 text-amber-400">
                <Clock className="w-4 h-4" />
              </span>
              <span>Weekly Manual Hours / Employee</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Hours:</span>
              <div className="relative">
                <input
                  type="number"
                  id="weekly-hours-input"
                  min={1}
                  max={30}
                  value={inputs.weeklyHours}
                  onChange={(e) => handleNumericInput('weeklyHours', e.target.value, 1, 30)}
                  className="w-18 px-2.5 py-1 text-right text-sm font-semibold text-emerald-400 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label="Weekly manual hours"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              id="weekly-hours-slider"
              min={1}
              max={30}
              step={1}
              value={inputs.weeklyHours}
              onChange={(e) => updateField('weeklyHours', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <div className="flex justify-between text-[11px] text-slate-400 px-0.5">
              <span>1 hr/wk</span>
              <span>15 hrs/wk</span>
              <span>30 hrs/wk</span>
            </div>
          </div>
        </div>

        {/* 3. Average Hourly Labor Cost */}
        <div className="space-y-2.5 group">
          <div className="flex items-center justify-between">
            <label
              htmlFor="hourly-cost-slider"
              className="text-sm font-medium text-slate-200 flex items-center gap-2 cursor-pointer"
            >
              <span className="p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </span>
              <span>Average Hourly Labor Cost</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Rate:</span>
              <div className="relative">
                <input
                  type="number"
                  id="hourly-cost-input"
                  min={15}
                  max={150}
                  value={inputs.hourlyRate}
                  onChange={(e) => handleNumericInput('hourlyRate', e.target.value, 15, 150)}
                  className="w-18 px-2.5 py-1 text-right text-sm font-semibold text-emerald-400 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label="Hourly cost"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              id="hourly-cost-slider"
              min={15}
              max={150}
              step={1}
              value={inputs.hourlyRate}
              onChange={(e) => updateField('hourlyRate', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <div className="flex justify-between text-[11px] text-slate-400 px-0.5">
              <span>$15/hr</span>
              <span>$85/hr</span>
              <span>$150/hr</span>
            </div>
          </div>
        </div>

        {/* 4. Estimated Process Efficiency Gain */}
        <div className="space-y-2.5 group">
          <div className="flex items-center justify-between">
            <label
              htmlFor="efficiency-gain-slider"
              className="text-sm font-medium text-slate-200 flex items-center gap-2 cursor-pointer"
            >
              <span className="p-1.5 rounded-lg bg-teal-950/50 border border-teal-800/40 text-teal-400">
                <Zap className="w-4 h-4" />
              </span>
              <span>Estimated Efficiency Gain</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Gain:</span>
              <div className="relative">
                <input
                  type="number"
                  id="efficiency-gain-input"
                  min={10}
                  max={80}
                  value={inputs.efficiencyGain}
                  onChange={(e) => handleNumericInput('efficiencyGain', e.target.value, 10, 80)}
                  className="w-18 px-2.5 py-1 text-right text-sm font-semibold text-emerald-400 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label="Efficiency gain percentage"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              id="efficiency-gain-slider"
              min={10}
              max={80}
              step={1}
              value={inputs.efficiencyGain}
              onChange={(e) => updateField('efficiencyGain', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <div className="flex justify-between text-[11px] text-slate-400 px-0.5">
              <span>10% (Conservative)</span>
              <span>45% (Typical)</span>
              <span>80% (Aggressive)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Software Tier Radio Cards */}
      <div className="space-y-3 pt-1 border-t border-slate-800/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Software Platform Tier
          </label>
          <span className="text-[11px] text-slate-400">Billed annually</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {Object.values(SOFTWARE_TIERS).map((tier) => {
            const isSelected = inputs.tier === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => updateField('tier', tier.id)}
                className={`relative p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/30 border-emerald-500/70 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-400'
                          : 'border-slate-600 bg-transparent'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{tier.name}</span>
                        {tier.recommended && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{tier.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-white">
                      ${tier.monthlyCost}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">/mo</span>
                    <div className="text-[10px] text-slate-400">
                      ${tier.annualCost.toLocaleString()}/yr
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
