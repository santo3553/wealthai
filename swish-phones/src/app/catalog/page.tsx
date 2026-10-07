'use client';

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import { Navbar } from '@/components/store/Navbar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { HologramTiltCard } from '@/components/ui/HologramTiltCard';
import Link from 'next/link';
import { Sparkles, ShieldCheck, BatteryCharging, ArrowRight, Smartphone, Eye } from 'lucide-react';

function CatalogContent() {
  const { items, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?brand=${selectedBrand}&condition=${selectedGrade}`);
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, [selectedBrand, selectedGrade]);

  const brands = ['all', 'Apple', 'Samsung', 'Google'];
  const grades = [
    { id: 'all', label: 'All Grades' },
    { id: 'PRISTINE', label: 'Pristine (Zero Blemish)' },
    { id: 'GOOD', label: 'Good (Minor Wear)' },
    { id: 'FAIR', label: 'Fair (Discount Deal)' },
  ];

  return (
    <div className="min-h-screen bg-[#06070d] text-[#f4f4f5]">
      <Navbar cartCount={items.length} onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm shadow-rose-500/20">
            <Smartphone className="w-3.5 h-3.5 text-rose-400" />
            Verified Pre-Owned Inventory
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Certified Pre-Owned <span className="text-gradient-aurora">Catalog</span>
          </h1>
          <p className="mt-2 text-zinc-400 text-sm sm:text-base max-w-2xl">
            Each smartphone is individually serialized, bench-tested, and photographed. Hover to feel the 3D holographic tilt or click any model to inspect in real-time 3D.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pb-8 mb-8 border-b border-zinc-800/80">
          {/* Brand Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200 shrink-0 ${
                  selectedBrand === b
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/25 border border-rose-400/40'
                    : 'bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:border-rose-500/40 hover:text-white'
                }`}
              >
                {b === 'all' ? 'All Brands' : b}
              </button>
            ))}
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">Cosmetic Grade:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 cursor-pointer"
            >
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-3xl bg-zinc-900/40 border border-zinc-800 animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-lg font-bold text-white">No devices found matching filters</h3>
            <p className="text-xs text-zinc-400 mt-1">Try resetting the brand or grade filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => {
              const inStockCount = p.inventoryItems?.length || 0;
              const minPrice =
                p.inventoryItems?.length > 0
                  ? Math.min(...p.inventoryItems.map((i: any) => i.salePrice))
                  : p.basePrice;
              const maxBattery =
                p.inventoryItems?.length > 0
                  ? Math.max(...p.inventoryItems.map((i: any) => i.batteryHealth))
                  : 98;

              return (
                <HologramTiltCard
                  key={p.id}
                  className="rounded-3xl bg-zinc-950/85 border border-zinc-800/80 hover:border-rose-500/50 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
                >
                  {/* Top Header Card */}
                  <div className="p-6 pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 uppercase">
                        {p.brand}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-300 bg-zinc-900/90 px-2.5 py-1 rounded-full border border-zinc-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                        {inStockCount} In Stock
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white group-hover:text-rose-400 transition-colors">
                      {p.modelName}
                    </h3>

                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Visual Preview Banner */}
                  <div className="relative h-48 w-full bg-gradient-to-b from-zinc-900/60 to-zinc-950 flex items-center justify-center overflow-hidden my-2">
                    <div className="w-24 h-40 rounded-2xl bg-zinc-900 border-2 border-zinc-700/80 shadow-2xl group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500 flex flex-col justify-between p-2">
                      <div className="w-8 h-2 rounded-full bg-black mx-auto" />
                      <div className="text-center text-[9px] font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-orange-400 tracking-wider">
                        3D READY
                      </div>
                      <div className="w-4 h-1 rounded-full bg-zinc-600 mx-auto" />
                    </div>

                    <div className="absolute bottom-2 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-rose-500/20 text-[10px] text-rose-300 font-semibold shadow-sm">
                      <BatteryCharging className="w-3 h-3 text-orange-400" />
                      Up to {maxBattery}% Battery
                    </div>
                  </div>

                  {/* Card Bottom / Actions */}
                  <div className="p-6 pt-2 border-t border-zinc-900 flex flex-col gap-4">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                          Certified Starting at
                        </span>
                        <span className="text-2xl font-black text-white">
                          ${minPrice.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-xs text-rose-400 flex items-center gap-1 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                        1-Yr Warranty
                      </span>
                    </div>

                    <Link
                      href={`/phones/${p.slug}`}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-orange-500/20 hover:from-rose-500 hover:via-purple-600 hover:to-orange-500 text-white hover:text-white border border-rose-500/30 hover:border-rose-400 text-xs font-black text-center transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-rose-500/25"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-400 group-hover:text-white transition-colors" />
                      Inspect in 3D & Select Grade
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </HologramTiltCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <CartProvider>
      <CatalogContent />
    </CartProvider>
  );
}
