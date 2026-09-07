'use client';

import React, { useState, useEffect } from 'react';
import { X, Code2, Copy, Check, ExternalLink, Sliders } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [embedHeight, setEmbedHeight] = useState('780');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://roi.metricsflow.io';
  const embedUrl = `${currentOrigin}`;

  const snippet = `<iframe
  src="${embedUrl}"
  width="100%"
  height="${embedHeight}px"
  style="border: 0; border-radius: 16px; overflow: hidden;"
  title="MetricsFlow ROI & Cost Savings Calculator"
  loading="lazy"
  allow="clipboard-write"
></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = snippet;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="embed-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px] shadow-lg shadow-indigo-500/20 flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Code2 className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <h3 id="embed-modal-title" className="text-lg font-bold text-white tracking-tight">
              Embed Calculator on Your Website
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Embed this responsive interactive ROI calculator in your landing pages, docs, or sales enablement portals.
            </p>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>HTML &lt;iframe&gt; Integration Code</span>
            <span className="text-[11px] text-emerald-400">Responsive & Sandboxed</span>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed select-all">
              {snippet}
            </pre>

            <button
              onClick={handleCopy}
              type="button"
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition-all active:scale-95 shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Height configuration */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Recommended Height:</span>
          </div>
          <div className="flex items-center gap-2">
            {['700', '780', '850'].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setEmbedHeight(h)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  embedHeight === h
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {h}px
              </button>
            ))}
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="mt-5 text-xs text-slate-400 space-y-1.5 border-t border-slate-800/80 pt-4">
          <p className="font-semibold text-slate-300">Quick Integration Tips:</p>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
            <li>Paste this snippet anywhere inside your Webflow, WordPress, React, or custom HTML page.</li>
            <li>The calculator automatically optimizes touch sliders and responsive columns.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
