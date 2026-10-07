'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Sparkles, Search, UserCheck } from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              SWISH
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase -mt-1">
              Certified Used 3D
            </span>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
          <Link href="/catalog" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Shop Phones
          </Link>
          <Link href="/#standards" className="hover:text-white transition-colors">
            Diagnostic Standards
          </Link>
          <Link href="/#verify-imei" className="hover:text-white transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Verify IMEI
          </Link>
          <Link href="/#faq-support" className="hover:text-white transition-colors">
            Warranty & FAQ
          </Link>
          <Link href="/track-order" className="hover:text-white transition-colors">
            Track Order
          </Link>
        </nav>

        {/* Right CTA & Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/catalog"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition"
          >
            <Search className="w-3.5 h-3.5" />
            Find Phone
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 px-3 py-1.5 rounded-lg border border-zinc-800/80 hover:border-emerald-500/40 transition"
            title="Admin Portal"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white transition group"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
