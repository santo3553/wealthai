'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, BatteryCharging, Sparkles, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Gen-Z / Modern Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium mb-6 hover:border-zinc-700 transition">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-400 font-semibold">October Drop</span>
        <span className="text-zinc-600">|</span>
        <span>Over 40+ Certified Used iPhones & Galaxies Added</span>
      </div>

      {/* Main Title */}
      <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl leading-[1.05]">
        Certified Used Flagships.{' '}
        <span className="text-gradient-emerald">Inspected in 3D.</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed">
        Save up to <strong className="text-white font-bold">50% off retail</strong> on premium second-hand smartphones. 
        100% genuine OEM components, verified GSMA clean IMEI, and 12-month full warranty protection.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Link
          href="/catalog"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
          <Sparkles className="w-5 h-5 text-black" />
          Explore Certified Phones
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="#trade-in"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-white font-semibold text-base border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2"
        >
          Trade-In Old Phone
        </Link>
      </div>

      {/* Trust Grid */}
      <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl pt-8 border-t border-zinc-800/80">
        <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/60">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-2xl">
            <span>50-Point</span>
          </div>
          <span className="text-xs text-zinc-400 mt-1">Hardware Diagnostic</span>
        </div>

        <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/60">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-2xl">
            <BatteryCharging className="w-6 h-6" />
            <span>90%+</span>
          </div>
          <span className="text-xs text-zinc-400 mt-1">Battery Health Guarantee</span>
        </div>

        <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/60">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-2xl">
            <ShieldCheck className="w-6 h-6" />
            <span>12 Mos</span>
          </div>
          <span className="text-xs text-zinc-400 mt-1">Refurbished Warranty</span>
        </div>

        <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/60">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-2xl">
            <CheckCircle2 className="w-6 h-6" />
            <span>14 Days</span>
          </div>
          <span className="text-xs text-zinc-400 mt-1">Risk-Free Returns</span>
        </div>
      </div>
    </section>
  );
}
