'use client';

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import { Navbar } from '@/components/store/Navbar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import Link from 'next/link';
import { Sparkles, ShieldCheck, BatteryCharging, ArrowRight, Layers, Smartphone } from 'lucide-react';

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
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5]">
      <Navbar cartCount={items.length} onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            Verified Inventory
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Certified Pre-Owned Catalog
          </h1>
          <p className="mt-2 text-zinc-400 text-sm sm:text-base max-w-2xl">
            Each smartphone is individually serialized, bench-tested, and photographed. Click any model to inspect in real-time 3D.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pb-8 mb-8 border-b border-zinc-800">
          {/* Brand Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition shrink-0 ${
                  selectedBrand === b
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {b === 'all' ? 'All Brands' : b}
              </button>
            ))}
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">Cosmetic Grade:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
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
                className="h-96 rounded-3xl bg-zinc-900/50 border border-zinc-800 animate-pulse"
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
                <div
                  key={p.id}
                  className="rounded-3xl bg-zinc-950/70 border border-zinc-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
                >
                  {/* Top Header Card */}
                  <div className="p-6 pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-black tracking-widest text-emerald-400 uppercase">
                        {p.brand}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {inStockCount} In Stock
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                      {p.modelName}
                    </h3>

                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Visual Preview Banner */}
                  <div className="relative h-48 w-full bg-gradient-to-b from-zinc-900/50 to-zinc-950 flex items-center justify-center overflow-hidden my-2">
                    <div className="w-24 h-40 rounded-2xl bg-zinc-800 border-2 border-zinc-700/80 shadow-2xl group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500 flex flex-col justify-between p-2">
                      <div className="w-8 h-2 rounded-full bg-black mx-auto" />
                      <div className="text-center text-[9px] font-bold text-emerald-400">
                        3D READY
                      </div>
                      <div className="w-4 h-1 rounded-full bg-zinc-600 mx-auto" />
                    </div>

                    <div className="absolute bottom-2 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-zinc-800 text-[10px] text-emerald-400 font-semibold">
                      <BatteryCharging className="w-3 h-3" />
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
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        1-Yr Warranty
                      </span>
                    </div>

                    <Link
                      href={`/phones/${p.slug}`}
                      className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-emerald-500 hover:text-black border border-zinc-800 hover:border-emerald-400 text-white text-xs font-bold text-center transition flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-emerald-500/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Inspect in 3D & Select Grade
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
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
