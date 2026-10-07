'use client';

import React, { useState } from 'react';
import { PhoneScene } from '../canvas/PhoneScene';
import { Sparkles, Layers, ShieldCheck, Eye, Cpu, BatteryCharging, Zap } from 'lucide-react';
import Link from 'next/link';

export function InteractiveShowcase() {
  const [activeMode, setActiveMode] = useState<'inspect' | 'exploded' | 'condition'>('inspect');
  const [activeColor, setActiveColor] = useState<string>('#8e8d89'); // Natural Titanium
  const [conditionGrade, setConditionGrade] = useState<'PRISTINE' | 'GOOD' | 'FAIR'>('PRISTINE');
  const [explodeFactor, setExplodeFactor] = useState<number>(0);

  const colors = [
    { name: 'Natural Titanium', hex: '#8e8d89', class: 'bg-[#8e8d89]' },
    { name: 'Space Black', hex: '#2b2b2e', class: 'bg-[#2b2b2e]' },
    { name: 'Deep Blue', hex: '#394452', class: 'bg-[#394452]' },
    { name: 'Desert Gold', hex: '#c5a07e', class: 'bg-[#c5a07e]' },
  ];

  const handleModeChange = (mode: 'inspect' | 'exploded' | 'condition') => {
    setActiveMode(mode);
    if (mode === 'exploded') {
      setExplodeFactor(0.85);
    } else {
      setExplodeFactor(0);
    }
  };

  return (
    <section id="showcase" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Real-time 3D Interactive Lab
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Inspect Before You Buy.{' '}
          <span className="text-gradient-emerald">Down to the Millimeter.</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400">
          Rotate in 360°, separate internal diagnostic components, and preview verified cosmetic condition grades before ordering.
        </p>
      </div>

      {/* 3D Showcase Studio Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-950/70 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
          {/* Mode Switcher */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5 block">
              Inspection Mode
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-zinc-900/90 rounded-2xl border border-zinc-800">
              <button
                onClick={() => handleModeChange('inspect')}
                className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition ${
                  activeMode === 'inspect'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                360° Orbit
              </button>
              <button
                onClick={() => handleModeChange('exploded')}
                className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition ${
                  activeMode === 'exploded'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                Exploded View
              </button>
              <button
                onClick={() => handleModeChange('condition')}
                className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition ${
                  activeMode === 'condition'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Grades
              </button>
            </div>
          </div>

          {/* Color Switcher */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5 flex justify-between items-center">
              <span>Chassis Colorway</span>
              <span className="text-emerald-400 font-normal">
                {colors.find((c) => c.hex === activeColor)?.name}
              </span>
            </label>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setActiveColor(c.hex)}
                  className={`w-10 h-10 rounded-full ${c.class} border-2 transition-transform ${
                    activeColor === c.hex
                      ? 'border-emerald-400 scale-110 shadow-lg shadow-emerald-500/30'
                      : 'border-zinc-700 hover:scale-105'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Exploded Mode Slider (Conditional) */}
          {activeMode === 'exploded' && (
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/30 animate-fadeIn">
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-300 mb-2">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Cpu className="w-4 h-4" /> Component Separation
                </span>
                <span>{Math.round(explodeFactor * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={explodeFactor}
                onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="mt-3 flex flex-col gap-2 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>A17 Pro 3nm Logic Board: 100% Benchmarked</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Lithium Battery: 90%+ Health Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Sapphire Lens Module: 0 Scratches</span>
                </div>
              </div>
            </div>
          )}

          {/* Condition Grade Mode (Conditional) */}
          {activeMode === 'condition' && (
            <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/30 animate-fadeIn">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Select Refurbished Grade:
              </span>
              <button
                onClick={() => setConditionGrade('PRISTINE')}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  conditionGrade === 'PRISTINE'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Pristine (Like New)
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    0 blemishes. 100% cosmetic perfection.
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400">$799</span>
              </button>

              <button
                onClick={() => setConditionGrade('GOOD')}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  conditionGrade === 'GOOD'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Good (Minor Wear)
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Light micro-scuff on frame edge. Screen immaculate.
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-300">
                  $729 <span className="text-[10px] text-emerald-400 font-normal">(-$70)</span>
                </span>
              </button>

              <button
                onClick={() => setConditionGrade('FAIR')}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  conditionGrade === 'FAIR'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Fair (Value Hero)
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Visible corner scuffs. 100% hardware certified.
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-300">
                  $649 <span className="text-[10px] text-emerald-400 font-normal">(-$150)</span>
                </span>
              </button>
            </div>
          )}

          {/* Quick CTA */}
          <Link
            href="/catalog"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-black font-extrabold text-sm text-center shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-black" />
            Shop Available Stock For This Model
          </Link>
        </div>

        {/* Center / Right 3D Viewport */}
        <div className="lg:col-span-8 h-[520px] sm:h-[600px] w-full relative flex items-center justify-center order-1 lg:order-2 bg-gradient-to-b from-zinc-900/30 to-zinc-950/80 rounded-2xl border border-zinc-800/60 overflow-hidden">
          {/* Overlay Tag */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-zinc-700 text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Drag to Rotate 360° | Multi-touch Supported
          </div>

          {/* Floating Hardware Specs Badges */}
          <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-zinc-800 text-[11px] text-zinc-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>A17 Pro 3nm</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-zinc-800 text-[11px] text-zinc-300">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              <span>96% Battery Health</span>
            </div>
          </div>

          {/* Actual 3D Canvas */}
          <PhoneScene
            color={activeColor}
            conditionGrade={conditionGrade}
            explodeFactor={explodeFactor}
            enableOrbit={true}
            autoRotate={activeMode === 'inspect' && explodeFactor === 0}
            floating={activeMode === 'inspect'}
            scale={1.05}
          />
        </div>
      </div>
    </section>
  );
}
