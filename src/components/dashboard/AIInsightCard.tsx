import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAppSettings } from '../../context/AppSettingsContext';

export const AIInsightCard: React.FC = () => {
  const { insights, isLoadingInsights, refreshInsights } = useFinance();
  const { settings } = useAppSettings();

  // Display the first string from the Gemini insight array
  const firstInsight = insights?.[0] || 'Optimizing capital deployment across liquid and high-yield instruments.';

  const handleRefresh = () => {
    refreshInsights(settings.apiKey);
  };

  return (
    <div className="mx-6 mt-4 p-5 rounded-3xl glow-orange relative overflow-hidden transition-all duration-300">
      {/* Background Accent Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              WealthAI Intelligence
            </span>
            <span className="text-[10px] text-white/40 block">Gemini 2.0 Flash</span>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoadingInsights}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-amber-300 transition-colors disabled:opacity-50"
          title="Refresh Advice"
          aria-label="Refresh Advice"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInsights ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      <div className="mt-3 relative z-10">
        <p className="text-sm font-medium text-white/90 leading-relaxed font-sans">
          "{firstInsight}"
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-orange-500/20 text-[10px] text-amber-300/60 font-medium">
        <span>Private Wealth Advisory</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Live Advisory
        </span>
      </div>
    </div>
  );
};
