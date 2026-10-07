'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ArrowRight, ShieldCheck, BatteryCharging, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const { items, removeItem, isCartOpen, setIsCartOpen, totalAmount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Your Cart ({items.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white">Your cart is empty</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Inspect our 3D certified smartphones and find your next flagship at half price.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-white hover:border-zinc-700"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3 group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {item.brand}
                      </span>
                      <h4 className="text-sm font-bold text-white">{item.modelName}</h4>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {item.storage} • {item.color}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-500 hover:text-red-400 transition p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.conditionGrade === 'PRISTINE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.conditionGrade === 'GOOD'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {item.conditionGrade} GRADE
                    </span>

                    <span className="text-[10px] text-zinc-300 flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded-md">
                      <BatteryCharging className="w-3 h-3 text-emerald-400" />
                      {item.batteryHealth}% Battery
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-zinc-800/50">
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      1-Yr Warranty
                    </div>
                    <span className="text-sm font-extrabold text-white">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Inspected Shipping</span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
                  FREE (Express)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-white">Total Amount</span>
                <span className="text-2xl font-black text-emerald-400">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm text-center shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition flex items-center justify-center gap-2 group"
              >
                Proceed to Secure Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
