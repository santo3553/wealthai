import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Wallet,
  Utensils,
  Laptop,
  ShoppingBag,
  Gift,
  TrendingUp,
  Mic,
  Calendar,
  Sparkles,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import { CategoryName, TransactionType } from '../../types/finance';
import { getTodayISO, getCurrentTime } from '../../utils/date';
import { getQuickObservation } from '../../services/geminiService';
import { VoiceEntryModal } from './VoiceEntryModal';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { name: CategoryName; icon: React.ReactNode }[] = [
  { name: 'Salary', icon: <Wallet className="w-5 h-5" /> },
  { name: 'Dining', icon: <Utensils className="w-5 h-5" /> },
  { name: 'Tech', icon: <Laptop className="w-5 h-5" /> },
  { name: 'Shopping', icon: <ShoppingBag className="w-5 h-5" /> },
  { name: 'Gift', icon: <Gift className="w-5 h-5" /> },
  { name: 'Invest', icon: <TrendingUp className="w-5 h-5" /> },
];

export const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, checkRecurringCandidate } = useFinance();
  const { settings } = useAppSettings();

  const [amountStr, setAmountStr] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<CategoryName>('Dining');
  const [date, setDate] = useState<string>(getTodayISO());
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecurringDetected, setIsRecurringDetected] = useState(false);
  const [aiObservation, setAiObservation] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmountStr('');
      setTitle('');
      setType('expense');
      setCategory('Dining');
      setDate(getTodayISO());
      setIsRecurringDetected(false);
      setAiObservation(null);
    }
  }, [isOpen]);

  // Smart Suggestions logic:
  // "Compare new input with previous history. If a similar amount/title exists in the previous month,
  // show a banner: 'This looks like a recurring monthly expense. Schedule it?'"
  useEffect(() => {
    const num = parseFloat(amountStr);
    if ((title.length >= 3 || num > 0) && type === 'expense') {
      const match = checkRecurringCandidate(title, isNaN(num) ? 0 : num);
      setIsRecurringDetected(match);
    } else {
      setIsRecurringDetected(false);
    }
  }, [title, amountStr, type, checkRecurringCandidate]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    // Allow only one decimal point
    const parts = val.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setAmountStr(val);
  };

  const handleVoiceDataParsed = (parsed: {
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: CategoryName;
  }) => {
    setTitle(parsed.title);
    setAmountStr(String(parsed.amount));
    setType(parsed.type);
    setCategory(parsed.category);
    setShowVoiceModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amountStr);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    setIsSaving(true);
    const resolvedTitle = title.trim() || `${category} ${type === 'income' ? 'Income' : 'Expense'}`;

    // Get 10-word AI observation (Task 2)
    try {
      const observation = await getQuickObservation(
        {
          title: resolvedTitle,
          amount: numericAmount,
          type,
          category,
        },
        settings.apiKey
      );
      setAiObservation(observation);
    } catch {
      // Non-blocking
    }

    addTransaction({
      title: resolvedTitle,
      amount: numericAmount,
      type,
      category,
      date,
      time: getCurrentTime(),
      icon: category,
    });

    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container:
              Animation: Slide up from the bottom on entry, slide down on exit.
              Spring physics: damping: 25, stiffness: 200 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
            }}
            className="relative w-full max-w-md heavy-glass border-t border-white/20 rounded-t-[36px] p-6 pb-10 shadow-2xl bg-[#120d0b]/95 overflow-y-auto max-h-[92vh] z-10"
          >
            {/* Top Drag Indicator & Close */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  New Ledger Entry
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowVoiceModal(true)}
                  className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 hover:bg-amber-500/20 transition-colors"
                  title="Voice Input (Bangla/English)"
                  aria-label="Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Income vs Expense Toggle */}
            <div className="flex p-1 rounded-2xl glass-panel border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  type === 'expense'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  type === 'income'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Income
              </button>
            </div>

            {/* Input Logic: Large text-6xl input for amount */}
            <div className="my-6 text-center">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-3xl font-light text-amber-400/80">
                  {settings.currency === 'USD' ? '$' : settings.currency}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amountStr}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  autoFocus
                  className="text-6xl font-extrabold text-[#ffffff] bg-transparent text-center focus:outline-none w-full max-w-[280px] tracking-tight placeholder-white/20"
                />
              </div>
              <p className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">
                Enter Transaction Amount
              </p>
            </div>

            {/* Smart Suggestions Recurring Expense Banner */}
            {isRecurringDetected && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>This looks like a recurring monthly expense. Schedule it?</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRecurringDetected(false)}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-[#120d0b] font-bold text-[10px] ml-2 shrink-0 hover:bg-amber-300"
                >
                  Schedule
                </button>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title / Description */}
              <div>
                <label className="text-xs font-semibold text-white/50 block mb-1.5 uppercase tracking-wider">
                  Transaction Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Executive Lunch, Tech Hardware, Dividend"
                  className="w-full px-4 py-3 rounded-2xl glass-panel border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400/50"
                />
              </div>

              {/* Category List: Horizontal icons for Salary, Dining, Tech, Shopping, Gift, Invest */}
              <div>
                <label className="text-xs font-semibold text-white/50 block mb-2 uppercase tracking-wider">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.name;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setCategory(cat.name)}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-left ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                            : 'glass-panel border-white/10 text-white/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-white/5'
                          }`}
                        >
                          {cat.icon}
                        </div>
                        <span className="text-xs font-semibold truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label className="text-xs font-semibold text-white/50 block mb-1.5 uppercase tracking-wider">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-panel border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              {/* AI Observation Feedback if available */}
              {aiObservation && (
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-start gap-2 text-xs text-orange-200">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{aiObservation}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving || !amountStr || parseFloat(amountStr) <= 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-[#120d0b] font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {isSaving ? (
                  <>
                    <Check className="w-4 h-4" />
                    Recording in Vault...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#120d0b]" />
                    Authorize Transaction
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Voice Recognition Modal for Bangla/English */}
      {showVoiceModal && (
        <VoiceEntryModal
          isOpen={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          onParsed={handleVoiceDataParsed}
        />
      )}
    </AnimatePresence>
  );
};
