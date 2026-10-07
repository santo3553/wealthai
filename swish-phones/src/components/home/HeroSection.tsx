'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, BatteryCharging, Sparkles, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Gen-Z / Aurora Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/30 border border-rose-500/30 text-rose-200 text-xs font-semibold mb-6 hover:border-rose-400/50 transition backdrop-blur-md">
        <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
        <span className="text-rose-400 font-bold uppercase tracking-wider">October Gen-Z Drop</span>
        <span className="text-zinc-600">|</span>
        <span>Over 40+ Certified Flagships Ready to Ship</span>
      </div>

      {/* Main Title with Aurora Gradient */}
      <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl leading-[1.05]">
        Certified Used Flagships.{' '}
        <span className="text-gradient-aurora">Inspected in 3D.</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed">
        Save up to <strong className="text-rose-400 font-bold">50% off retail</strong> on certified second-hand iPhones & Galaxies. 
        Zero hidden defects. 100% genuine OEM parts with 12-month full warranty protection.
      </p>

      {/* CTAs with Glow and Hover Physics */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Link
          href="/catalog"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-black text-base shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group glow-coral"
        >
          <Sparkles className="w-5 h-5 text-white" />
          Explore Certified Phones
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="#verify-imei"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-white font-semibold text-base border border-rose-500/20 hover:border-rose-400/50 transition-all flex items-center justify-center gap-2"
        >
          Verify Phone IMEI
        </Link>
      </div>

      {/* Trust Grid in Aurora Tones */}
      <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl pt-8 border-t border-rose-500/10">
        <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-void-900/80 border border-rose-500/15">
          <div className="flex items-center gap-2 text-rose-400 font-black text-2xl">
            <span>50-Point</span>
          </div>
          <span className="text-xs text-zinc-400 mt-1">Hardware Diagnostic</span>
        </div>

        <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-void-900/80 border border-orange-500/15">
          <div className="flex items-center gap-2 text-orange-400 font-black text-2xl">
            <BatteryCharging className="w-6 h-6" />
            <span>90%+</span>
          </div>
          <span className="text-xs text-zinc-400 mt-1">Battery Health Guarantee</span>
        </div>

        <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-void-900/80 border border-purple-500/15">
          <div className="flex items-center gap-2 text-purple-400 font-black text-2xl">
            <ShieldCheck className="w-6 h-6" />
            <span>12 Mos</span>
          </div>
          <span className="text-xs text-zinc-400 mt-1">Refurbished Warranty</span>
        </div>

        <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-void-900/80 border border-pink-500/15">
          <div className="flex items-center gap-2 text-pink-400 font-black text-2xl">
            <CheckCircle2 className="w-6 h-6" />
            <span>14 Days</span>
          </div>
          <span className="text-xs text-zinc-400 mt-1">Risk-Free Returns</span>
        </div>
      </div>
    </section>
  );
}
