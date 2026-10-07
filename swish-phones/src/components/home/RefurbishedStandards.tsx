'use client';

import React from 'react';
import { Check, Shield, BatteryMedium, Cpu, Camera, Radio, FileText } from 'lucide-react';

export function RefurbishedStandards() {
  const standards = [
    {
      icon: BatteryMedium,
      title: 'Battery Health ≥ 90%',
      desc: 'Every phone undergoes continuous load cycle testing. Units with depleted or degraded cells are rejected or fitted with OEM parts.',
    },
    {
      icon: Cpu,
      title: 'Thermal & CPU Stress Test',
      desc: 'Hardware benchmarked across all CPU/GPU cores under peak workload to ensure zero micro-stutter, throttling, or logic board shorts.',
    },
    {
      icon: Camera,
      title: 'Optical Triple-Lens Calibration',
      desc: 'Sensors tested for OIS stabilization, autofocus tracking, multi-zoom telephoto sharpness, and scratch-free sapphire elements.',
    },
    {
      icon: Radio,
      title: '100% Unlocked & Clean IMEI',
      desc: 'Clean GSMA blacklist verification. 100% factory unlocked for all global SIM and eSIM networks.',
    },
  ];

  return (
    <section id="standards" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider w-fit">
            <Shield className="w-3.5 h-3.5" />
            Quality Control Standard
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Not just used. <br />
            <span className="text-gradient-emerald">Diagnostic Certified.</span>
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed">
            Buying second-hand shouldn't feel like a gamble. Every device in our inventory is personally inspected by certified technicians, cataloged by its unique IMEI number, and backed by our full 12-month replacement warranty.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            {[
              'Individual IMEI tracking on your receipt & certificate',
              'Complimentary USB-C braided charging cable & SIM key',
              'Eco-friendly compostable protective packaging',
              '14 days unconditional money-back trial period',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {standards.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col gap-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800/80 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
