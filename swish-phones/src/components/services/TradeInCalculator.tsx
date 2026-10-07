'use client';

import React, { useState } from 'react';
import { ArrowRight, DollarSign, RefreshCw, CheckCircle2, Smartphone, ShieldCheck } from 'lucide-react';

export function TradeInCalculator() {
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 13 Pro');
  const [storage, setStorage] = useState('128GB');
  const [condition, setCondition] = useState('Flawless');
  const [submitted, setSubmitted] = useState(false);

  // Valuation matrix
  const getEstimatedValue = () => {
    let base = 350;
    if (model.includes('14')) base = 480;
    if (model.includes('13')) base = 360;
    if (model.includes('12')) base = 250;
    if (model.includes('S23')) base = 420;
    if (model.includes('S22')) base = 310;
    if (model.includes('Pixel 7')) base = 280;

    if (storage === '256GB') base += 50;
    if (storage === '512GB') base += 100;

    if (condition === 'Good') base *= 0.85;
    if (condition === 'Broken/Cracked') base *= 0.45;

    return Math.round(base);
  };

  const estimatedValue = getEstimatedValue();

  return (
    <section id="trade-in" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider w-fit">
              <RefreshCw className="w-3.5 h-3.5" />
              Instant Trade-In Valuation
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Sell or Trade-In <br />
              <span className="text-gradient-emerald">Your Old Smartphone</span>
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Upgrade without paying full price. Get an instant cash quote for your current device and apply it directly as a discount on your certified purchase, or receive direct bank payout.
            </p>

            <div className="flex flex-col gap-2.5 text-xs text-zinc-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Free prepaid insured shipping box mailed to your door</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Data sanitization & factory wipe certificate included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant payout via Direct Deposit, PayPal, or Store Credit</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Valuation Box */}
          <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-xl">
            {submitted ? (
              <div className="py-8 text-center flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Trade-In Kit Requested!</h3>
                <p className="text-xs text-zinc-400 max-w-sm">
                  We have locked your valuation at <strong className="text-emerald-400 font-bold">${estimatedValue}</strong>. Your prepaid shipping kit is being prepared.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200"
                >
                  Calculate Another Device
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Brand */}
                  <div>
                    <label className="text-xs text-zinc-400 font-semibold block mb-1.5">
                      Your Device Brand
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => {
                        setBrand(e.target.value);
                        if (e.target.value === 'Apple') setModel('iPhone 13 Pro');
                        if (e.target.value === 'Samsung') setModel('Galaxy S23');
                        if (e.target.value === 'Google') setModel('Pixel 7 Pro');
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Apple">Apple iPhone</option>
                      <option value="Samsung">Samsung Galaxy</option>
                      <option value="Google">Google Pixel</option>
                    </select>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="text-xs text-zinc-400 font-semibold block mb-1.5">
                      Specific Model
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      {brand === 'Apple' && (
                        <>
                          <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                          <option value="iPhone 14">iPhone 14</option>
                          <option value="iPhone 13 Pro">iPhone 13 Pro</option>
                          <option value="iPhone 13">iPhone 13</option>
                          <option value="iPhone 12 Pro">iPhone 12 Pro</option>
                        </>
                      )}
                      {brand === 'Samsung' && (
                        <>
                          <option value="Galaxy S23 Ultra">Galaxy S23 Ultra</option>
                          <option value="Galaxy S23">Galaxy S23</option>
                          <option value="Galaxy S22 Ultra">Galaxy S22 Ultra</option>
                          <option value="Galaxy S22">Galaxy S22</option>
                        </>
                      )}
                      {brand === 'Google' && (
                        <>
                          <option value="Pixel 7 Pro">Pixel 7 Pro</option>
                          <option value="Pixel 7">Pixel 7</option>
                          <option value="Pixel 6 Pro">Pixel 6 Pro</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Storage */}
                  <div>
                    <label className="text-xs text-zinc-400 font-semibold block mb-1.5">
                      Storage Capacity
                    </label>
                    <select
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                    </select>
                  </div>

                  {/* Physical Condition */}
                  <div>
                    <label className="text-xs text-zinc-400 font-semibold block mb-1.5">
                      Physical Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Flawless">Flawless (No visible scuffs)</option>
                      <option value="Good">Good (Normal wear, screen intact)</option>
                      <option value="Broken/Cracked">Cracked screen or back glass</option>
                    </select>
                  </div>
                </div>

                {/* Live Value Card */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                      Estimated Trade-In Payout
                    </span>
                    <span className="text-3xl font-black text-emerald-400">
                      ${estimatedValue}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 text-right">
                    Value locked for 14 days <br />
                    with free shipping box
                  </span>
                </div>

                {/* Submission CTA */}
                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <DollarSign className="w-4 h-4" />
                  Accept Offer & Request Free Shipping Kit
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
