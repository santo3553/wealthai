'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartProvider, useCart } from '@/context/CartContext';
import { Navbar } from '@/components/store/Navbar';
import { ShieldCheck, CreditCard, Banknote, Building, CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

function CheckoutContent() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    paymentMethod: 'STRIPE_CARD' as 'STRIPE_CARD' | 'CASH_ON_DELIVERY' | 'BANK_TRANSFER',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          shippingAddress: formData.shippingAddress,
          paymentMethod: formData.paymentMethod,
          items: items.map((i) => ({
            id: i.id,
            productId: i.productId,
            price: i.price,
            imei: i.imei,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Success
      clearCart();
      router.push(`/track-order?orderNumber=${data.orderNumber}&email=${encodeURIComponent(formData.customerEmail)}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong processing your order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5]">
        <Navbar cartCount={0} />
        <div className="max-w-md mx-auto pt-32 px-4 text-center">
          <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
          <p className="text-zinc-400 text-sm mt-2">Add a certified phone before checking out.</p>
          <Link
            href="/catalog"
            className="mt-6 inline-block px-6 py-3 rounded-xl bg-emerald-500 text-black font-bold text-sm"
          >
            Browse Phones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5]">
      <Navbar cartCount={items.length} />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-8">
          Secure Certified Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Form Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Contact & Shipping */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Shipping & Contact Information
              </h3>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Alex Johnson"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                    Email Address * (For Tracking & Warranty)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                  Complete Street Address & Apartment *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  placeholder="742 Evergreen Terrace, Apt 4B, Springfield, OR 97477"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Select Payment Method
              </h3>

              <div className="flex flex-col gap-3">
                {[
                  {
                    id: 'STRIPE_CARD',
                    icon: CreditCard,
                    title: 'Credit / Debit Card (Stripe Test Simulator)',
                    desc: 'Instant verification with 256-bit SSL encryption. Auto-approved in test mode.',
                  },
                  {
                    id: 'CASH_ON_DELIVERY',
                    icon: Banknote,
                    title: 'Cash On Delivery (COD)',
                    desc: 'Inspect the phone upon courier delivery before paying cash or card.',
                  },
                  {
                    id: 'BANK_TRANSFER',
                    icon: Building,
                    title: 'Direct Bank Wire Transfer',
                    desc: 'Account payment details provided upon order confirmation.',
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <label
                      key={m.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: m.id as any })}
                      className={`p-4 rounded-2xl border flex items-start gap-4 cursor-pointer transition ${
                        formData.paymentMethod === m.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === m.id}
                        onChange={() => {}}
                        className="mt-1 accent-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <Icon className="w-4 h-4 text-emerald-400" />
                          {m.title}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{m.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-4 sticky top-24">
              <h3 className="text-base font-bold text-white">Order Summary ({items.length} items)</h3>

              <div className="flex flex-col gap-3 divide-y divide-zinc-900 max-h-80 overflow-y-auto">
                {items.map((i) => (
                  <div key={i.id} className="pt-3 first:pt-0 flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold text-white">{i.modelName}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {i.storage} • {i.conditionGrade} Grade • {i.batteryHealth}% Battery
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white">${i.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-4 flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>50-Point Certified Inspection</span>
                  <span className="text-emerald-400 font-bold">INCLUDED</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Express Courier Shipping</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Total Due</span>
                  <span className="text-2xl font-black text-emerald-400">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-black" />
                    Place Certified Order
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Backed by 12-Month Refurbished Warranty</span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  );
}
