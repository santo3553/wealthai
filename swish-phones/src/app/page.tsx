'use client';

import dynamic from 'next/dynamic';
import { CartProvider, useCart } from '@/context/CartContext';
import { Navbar } from '@/components/store/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { RefurbishedStandards } from '@/components/home/RefurbishedStandards';
import { ImeiVerificationTool } from '@/components/services/ImeiVerificationTool';
import { CustomerProtectionSuite } from '@/components/services/CustomerProtectionSuite';
import { CartDrawer } from '@/components/cart/CartDrawer';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

const DynamicBackground3D = dynamic(
  () => import('@/components/canvas/DynamicBackground3D').then((m) => m.DynamicBackground3D),
  { ssr: false }
);


function HomeContent() {
  const { items, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] relative overflow-hidden">
      {/* 3D Animated WebGL Dynamic Background */}
      <DynamicBackground3D />

      {/* Foreground Content */}
      <div className="relative z-10">
        {/* Global Navigation */}
        <Navbar cartCount={items.length} onOpenCart={() => setIsCartOpen(true)} />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* Hero Section with Live Stats */}
        <HeroSection />

        {/* 50-Point Diagnostic Refurbished Standards */}
        <RefurbishedStandards />

        {/* Essential 2nd-Hand Service 2: Live IMEI Diagnostic Report Verification */}
        <ImeiVerificationTool />

        {/* Essential 2nd-Hand Service 3: 1-Year Warranty Claim & Buyer FAQ */}
        <CustomerProtectionSuite />

        {/* Catalog Banner CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-r from-rose-950/50 via-purple-950/40 to-zinc-950/90 border border-rose-500/30 p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col gap-3 max-w-xl">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-400" /> Ready to Upgrade?
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                Explore Every Available Certified Flagship
              </h3>
              <p className="text-sm text-zinc-300">
                Browse serialized units by verified battery health, cosmetic grades, and clean IMEI tracking numbers.
              </p>
            </div>

            <Link
              href="/catalog"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-black text-sm shadow-xl shadow-rose-500/30 active:scale-95 transition flex items-center gap-2 shrink-0 glow-coral"
            >
              Open Store Catalog
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-rose-500/10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-zinc-500 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">SWISH Smartphones Inc.</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/track-order" className="hover:text-zinc-300 transition">
              Track Order
            </Link>
            <Link href="/catalog" className="hover:text-zinc-300 transition">
              Catalog
            </Link>
            <Link href="/#standards" className="hover:text-zinc-300 transition">
              Quality Standards
            </Link>
            <Link href="/#verify-imei" className="hover:text-zinc-300 transition">
              Verify IMEI
            </Link>
            <Link href="/admin" className="hover:text-rose-400 transition">
              Staff Portal
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}
