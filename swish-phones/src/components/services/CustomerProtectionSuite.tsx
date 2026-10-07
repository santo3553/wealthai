'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldAlert,
  RotateCcw,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  X,
  FileCheck,
} from 'lucide-react';

export function CustomerProtectionSuite() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How do I know the battery is healthy on a used phone?',
      a: 'Every phone in our certified inventory undergoes continuous load battery testing. We reject any device with under 90% battery health, ensuring you get all-day battery life without needing an immediate replacement.',
    },
    {
      q: 'Are the screens and cameras original OEM parts?',
      a: 'Yes. Our certified technicians run spectral and TrueTone diagnostics to verify all OLED panels, digitizers, and camera lenses are genuine manufacturer parts. We do not use cheap counterfeit replacement displays.',
    },
    {
      q: 'Will my existing carrier SIM or eSIM work?',
      a: '100% guaranteed. All phones sold on SWISH are fully factory unlocked for all carriers globally (AT&T, T-Mobile, Verizon, Vodafone, EE, etc.).',
    },
    {
      q: 'What if I am unhappy with the cosmetic condition?',
      a: 'You have a 14-day risk-free trial. If the cosmetic grade is not what you expected, generate a free prepaid return shipping label and receive a 100% refund or free exchange.',
    },
  ];

  return (
    <section id="faq-support" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Customer Guarantees & Support CTAs */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider w-fit">
            <HelpCircle className="w-3.5 h-3.5" />
            Buyer Protection Services
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight">
            Comprehensive Customer <br />
            <span className="text-gradient-emerald">Care & Warranty Coverage</span>
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed">
            Second-hand buying made as reliable and protected as buying brand new. We back every order with our dedicated repair & replacement hub.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => setShowWarrantyModal(true)}
              className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    File a 1-Year Warranty Claim
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Free hardware repair or replacement unit
                  </div>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-bold">Submit &rarr;</span>
            </button>

            <a
              href="https://wa.me/15552345678"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Live WhatsApp Customer Specialist
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Instant advice on model selection and stock
                  </div>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-bold">Chat Live &rarr;</span>
            </a>
          </div>
        </div>

        {/* Right Column: FAQ Accordion */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <h3 className="text-base font-bold text-white mb-2">
            Frequently Asked Questions by 2nd-Hand Buyers
          </h3>

          {faqs.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left flex justify-between items-center text-xs font-bold text-white hover:text-emerald-400 transition"
              >
                <span>{f.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    openFaq === i ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/40 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Warranty Claim Modal */}
      {showWarrantyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowWarrantyModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 z-10 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                12-Month Warranty Service Request
              </h3>
              <button
                onClick={() => setShowWarrantyModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {claimSubmitted ? (
              <div className="py-6 text-center flex flex-col items-center gap-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Warranty Ticket Created!</h4>
                <p className="text-xs text-zinc-400">
                  Our diagnostics support technician will email you a prepaid return shipping label within 2 business hours.
                </p>
                <button
                  onClick={() => {
                    setClaimSubmitted(false);
                    setShowWarrantyModal(false);
                  }}
                  className="mt-3 px-5 py-2 rounded-xl bg-zinc-900 text-xs text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setClaimSubmitted(true);
                }}
                className="flex flex-col gap-3 text-xs"
              >
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Order Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="SW-2026-XXXX"
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Device Serial / IMEI *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="358921098471923"
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Describe Hardware Issue *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="E.g., battery discharging faster than usual, camera sensor blur, audio glitch..."
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition"
                >
                  Submit Warranty Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
