'use client';

import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, Loader2, Sparkles, Building, Mail, User, Printer } from 'lucide-react';
import { CalculationResults, CalculatorInputs } from '../types/calculator';
import { formatCurrency } from '../utils/formatters';

export interface LeadInfo {
  fullName: string;
  workEmail: string;
  companyName: string;
}

interface ExecutiveSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CalculatorInputs;
  results: CalculationResults;
  onLeadCaptured: (info: LeadInfo) => void;
}

export const ExecutiveSummaryModal: React.FC<ExecutiveSummaryModalProps> = ({
  isOpen,
  onClose,
  inputs,
  results,
  onLeadCaptured,
}) => {
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [error, setError] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isGenerating) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isGenerating, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !workEmail.trim() || !companyName.trim()) {
      setError('Please fill out all required fields.');
      return;
    }
    setError('');
    setIsGenerating(true);
    setGenerationStep(1);

    const lead: LeadInfo = { fullName, workEmail, companyName };
    onLeadCaptured(lead);

    setTimeout(() => {
      setGenerationStep(2);
    }, 600);

    setTimeout(() => {
      setGenerationStep(3);
    }, 1100);

    setTimeout(() => {
      setIsGenerating(false);
      onClose();
      // Trigger print dialog
      setTimeout(() => {
        window.print();
      }, 300);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        {!isGenerating && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-white tracking-tight">
              Export Executive ROI Summary (PDF)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized business case report ready for board & stakeholder review.
            </p>
          </div>
        </div>

        {/* Quick Highlights Pill */}
        <div className="p-3.5 mb-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Net Value: </span>
            <span className="font-bold text-emerald-400">
              +{formatCurrency(results.netAnnualSavings)}/yr
            </span>
          </div>
          <div>
            <span className="text-slate-400">ROI: </span>
            <span className="font-bold text-white">{results.roiMultipleFormatted}</span>
          </div>
          <div>
            <span className="text-slate-400">Payback: </span>
            <span className="font-bold text-teal-300">{results.paybackPeriodFormatted}</span>
          </div>
        </div>

        {isGenerating ? (
          <div className="py-8 text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
              <Sparkles className="w-4 h-4 text-teal-300 absolute" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">
                {generationStep === 1 && 'Compiling workforce model...'}
                {generationStep === 2 && 'Calculating 3-year cash flow projections...'}
                {generationStep === 3 && 'Preparing printable executive brief...'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Your browser print dialog will open automatically in a moment.
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-48 mx-auto h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-300"
                style={{ width: `${(generationStep / 3) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="lead-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="lead-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700/90 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lead-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                Work Email <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="lead-email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="s.jenkins@company.com"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700/90 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lead-company" className="block text-xs font-medium text-slate-300 mb-1.5">
                Company Name <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="lead-company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Technologies, Inc."
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700/90 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.99]"
              >
                <Printer className="w-4 h-4" />
                <span>Generate & Print Executive Brief (PDF)</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400 pt-1">
              Selecting &ldquo;Save as PDF&rdquo; in the print destination creates a high-resolution 1-page report.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
