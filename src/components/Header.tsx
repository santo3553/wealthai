'use client';

import React from 'react';
import { Sparkles, FileText, Code2, RotateCcw, TrendingUp } from 'lucide-react';

interface HeaderProps {
  onOpenExportModal: () => void;
  onOpenEmbedModal: () => void;
  onResetDefaults: () => void;
  isCustomized: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExportModal,
  onOpenEmbedModal,
  onResetDefaults,
  isCustomized,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand & Status */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-[1px] shadow-lg shadow-emerald-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="absolute -inset-0.5 bg-emerald-500/20 blur-sm rounded-xl -z-10" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                MetricsFlow <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">ROI</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-950">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Production Demo
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Interactive B2B Workforce & Workflow Cost-Savings Model
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isCustomized && (
            <button
              onClick={onResetDefaults}
              type="button"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-800/60 transition-colors"
              title="Reset inputs to initial default benchmark"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={onOpenEmbedModal}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 sm:px-3.5 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/70 hover:bg-slate-800/80 transition-all shadow-sm"
          >
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Embed Widget</span>
            <span className="sm:hidden">&lt;/&gt;</span>
          </button>

          <button
            onClick={onOpenExportModal}
            type="button"
            className="group relative inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-950 px-3.5 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            <span>Download Summary <span className="hidden sm:inline">(PDF)</span></span>
            <span className="absolute -bottom-px left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </button>
        </div>
      </div>
    </header>
  );
};
