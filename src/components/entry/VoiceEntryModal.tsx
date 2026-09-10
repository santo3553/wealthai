import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, X, Sparkles, Languages, Check, ArrowRight } from 'lucide-react';
import { voiceBridge } from '../../services/voiceService';
import { parseVoiceTranscript, ParsedVoiceResult } from '../../services/geminiService';
import { useAppSettings } from '../../context/AppSettingsContext';

interface VoiceEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: ParsedVoiceResult) => void;
}

export const VoiceEntryModal: React.FC<VoiceEntryModalProps> = ({
  isOpen,
  onClose,
  onParsed,
}) => {
  const { settings } = useAppSettings();
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en-US' | 'bn-BD'>('en-US');
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    voiceBridge.setLanguage(language);
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      voiceBridge.stopListening();
      setIsListening(false);
      return;
    }

    setErrorMsg(null);
    voiceBridge.startListening({
      onStart: () => setIsListening(true),
      onResult: (text) => {
        setTranscript(text);
        setIsListening(false);
      },
      onError: (err) => {
        setErrorMsg(err);
        setIsListening(false);
      },
      onEnd: () => setIsListening(false),
    });
  };

  const handleProcessTranscript = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const parsed = await parseVoiceTranscript(textToProcess, settings.apiKey);
      onParsed(parsed);
    } catch (err: any) {
      setErrorMsg('Could not parse voice command. Please refine your speech.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Preset sample test phrases for quick testing in both English and Bangla
  const samplePrompts = [
    { label: 'Dinner $180 (Dining)', text: 'I spent $180 on dinner at Nobu' },
    { label: 'Salary $12000 (Income)', text: 'Received monthly executive salary $12000' },
    { label: 'Tech Gadget $450 (Tech)', text: 'Bought tech hardware accessory for $450' },
    { label: 'বেতন ২০০০০ (Bangla Income)', text: 'এই মাসে বেতন পেয়েছি ২০০০০ টাকা' },
    { label: 'রেস্টুরেন্টে খরচ ২৫০০ (Bangla Expense)', text: 'রেস্টুরেন্টে খাবার খরচ ২৫০০ টাকা' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="relative w-full max-w-sm heavy-glass border border-white/20 rounded-3xl p-6 shadow-2xl bg-[#120d0b]/95 z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Voice Intelligence
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between mb-5 px-3 py-1.5 rounded-xl glass-panel border border-white/10 text-xs">
          <span className="text-white/50 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            Language Mode
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLanguage('en-US')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                language === 'en-US'
                  ? 'bg-amber-400 text-[#120d0b]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('bn-BD')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                language === 'bn-BD'
                  ? 'bg-amber-400 text-[#120d0b]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* Microphone Pulse Circle */}
        <div className="my-6 flex flex-col items-center">
          <div className="relative">
            {isListening && (
              <div className="absolute -inset-4 rounded-full bg-amber-400/20 animate-ping" />
            )}
            <button
              type="button"
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-xl shadow-orange-500/40 scale-105'
                  : 'bg-white/10 hover:bg-white/20 border border-white/20'
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 text-white animate-pulse" />
              ) : (
                <MicOff className="w-8 h-8 text-white/50" />
              )}
            </button>
          </div>
          <span className="text-xs font-semibold text-white/70 mt-3">
            {isListening ? 'Listening now... speak clearly' : 'Tap microphone to speak'}
          </span>
        </div>

        {/* Live / Editable Transcript */}
        <div className="mb-4">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Or type speech transcript (e.g. 'I spent $120 on dining dinner' or 'বেতন জমা ২০০০০')..."
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-amber-400/50 resize-none"
          />
        </div>

        {/* Sample Prompt Chips for Quick Test */}
        <div className="mb-5">
          <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1.5">
            Quick Test Prompts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(s.text);
                  handleProcessTranscript(s.text);
                }}
                className="text-[10px] px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300/80 border border-white/10 transition-colors flex items-center gap-1"
              >
                <span>{s.label}</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <p className="text-[11px] text-rose-400 text-center mb-3">{errorMsg}</p>
        )}

        {/* Process Button */}
        <button
          type="button"
          onClick={() => handleProcessTranscript(transcript)}
          disabled={!transcript.trim() || isProcessing}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-[#120d0b] font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.99] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span>Analyzing Transcript with Gemini...</span>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              Analyze & Populate Transaction
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};
