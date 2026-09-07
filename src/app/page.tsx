'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { InputPanel } from '../components/InputPanel';
import { MetricCards } from '../components/MetricCards';
import { ChartSection } from '../components/ChartSection';
import { BreakdownTable } from '../components/BreakdownTable';
import { ExecutiveSummaryModal, LeadInfo } from '../components/ExecutiveSummaryModal';
import { EmbedModal } from '../components/EmbedModal';
import { PrintSummaryView } from '../components/PrintSummaryView';
import { CalculatorInputs, PresetId } from '../types/calculator';
import { DEFAULT_INPUTS, INDUSTRY_PRESETS } from '../utils/presets';
import { calculateROI } from '../utils/calculations';
import { FileText, Code2, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function CalculatorPage() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [activePreset, setActivePreset] = useState<PresetId | null>('growth_stage');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [capturedLead, setCapturedLead] = useState<LeadInfo | null>(null);

  // Real-time calculation memoized
  const results = useMemo(() => calculateROI(inputs), [inputs]);

  // Check if inputs have been customized away from defaults
  const isCustomized = useMemo(() => {
    return (
      inputs.teamSize !== DEFAULT_INPUTS.teamSize ||
      inputs.weeklyHours !== DEFAULT_INPUTS.weeklyHours ||
      inputs.hourlyRate !== DEFAULT_INPUTS.hourlyRate ||
      inputs.efficiencyGain !== DEFAULT_INPUTS.efficiencyGain ||
      inputs.tier !== DEFAULT_INPUTS.tier
    );
  }, [inputs]);

  const handleApplyPreset = (presetId: PresetId) => {
    const found = INDUSTRY_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setInputs({
        teamSize: found.teamSize,
        weeklyHours: found.weeklyHours,
        hourlyRate: found.hourlyRate,
        efficiencyGain: found.efficiencyGain,
        tier: found.tier,
      });
      setActivePreset(presetId);
    }
  };

  const handleInputChange = (newInputs: CalculatorInputs) => {
    setInputs(newInputs);
    // Check if new inputs match any preset
    const match = INDUSTRY_PRESETS.find(
      (p) =>
        p.teamSize === newInputs.teamSize &&
        p.weeklyHours === newInputs.weeklyHours &&
        p.hourlyRate === newInputs.hourlyRate &&
        p.efficiencyGain === newInputs.efficiencyGain &&
        p.tier === newInputs.tier
    );
    setActivePreset(match ? match.id : null);
  };

  const handleResetDefaults = () => {
    setInputs(DEFAULT_INPUTS);
    setActivePreset(null);
  };

  return (
    <>
      {/* Printable View - Only visible during window.print() */}
      <PrintSummaryView inputs={inputs} results={results} lead={capturedLead} />

      {/* Screen Interactive Web App */}
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 print:hidden relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Global Header */}
        <Header
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
          onResetDefaults={handleResetDefaults}
          isCustomized={isCustomized}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* Subtitle / Intro Bar */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Workforce Productivity & Automation Benchmark
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                B2B SaaS ROI & Cost-Savings Calculator
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Simulate how much manual labor expenditure your organization reclaims by deploying automated workflows. Real-time payback, ROI multiple, and 3-year cash flow projections.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Audited Formulas
              </span>
              <span>•</span>
              <span>Dynamic 52-wk Model</span>
            </div>
          </div>

          {/* Two-Column Responsive Split */}
          {/* Left panel: 40% on desktop (sticky), Right panel: 60% */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Left Column (Inputs Panel - 40% Desktop Sticky) */}
            <section
              aria-label="Calculator Inputs"
              className="w-full lg:w-[40%] lg:sticky lg:top-24 space-y-6"
            >
              <InputPanel
                inputs={inputs}
                onChange={handleInputChange}
                onApplyPreset={handleApplyPreset}
                activePreset={activePreset}
              />
            </section>

            {/* Right Column (Visual Output Panel - 60% Desktop) */}
            <section
              aria-label="Calculator Results & Visualizations"
              className="w-full lg:w-[60%] space-y-6"
            >
              {/* 1. Four Key Metric Cards */}
              <MetricCards results={results} />

              {/* 2. Interactive Chart (Recharts) */}
              <ChartSection projections={results.projections} />

              {/* 3. Detailed Financial Breakdown Comparison */}
              <BreakdownTable inputs={inputs} results={results} />

              {/* 4. Action Banner / Executive Callout */}
              <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/50 border border-emerald-500/40 p-5 sm:p-7 shadow-xl shadow-emerald-950/20 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Executive Next Step
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-400">Ready for Review</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Need this analysis for your executive leadership team?
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    Export a customized 1-page financial memorandum complete with your company details and 3-year cash flow projections.
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setIsEmbedModalOpen(true)}
                    type="button"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs sm:text-sm font-semibold transition-all"
                  >
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <span>Embed Widget</span>
                  </button>

                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    type="button"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Summary (PDF)</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">MetricsFlow ROI Engine</span>
              <span>•</span>
              <span>Calculated over 52-week work cycles</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Zero external trackers</span>
              <span>•</span>
              <span>Client-side computation</span>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <ExecutiveSummaryModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          inputs={inputs}
          results={results}
          onLeadCaptured={(lead) => setCapturedLead(lead)}
        />

        <EmbedModal
          isOpen={isEmbedModalOpen}
          onClose={() => setIsEmbedModalOpen(false)}
        />
      </div>
    </>
  );
}
