'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/store/Navbar';
import {
  Search,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ShieldCheck,
  BatteryCharging,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

function TrackOrderInner() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams?.get('orderNumber') || '';
  const initialEmail = searchParams?.get('email') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState(initialEmail);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchOrder = async (queryNum: string, queryEmail?: string) => {
    if (!queryNum) return;
    try {
      setLoading(true);
      setErrorMessage('');
      const url = `/api/orders/track?orderNumber=${encodeURIComponent(queryNum)}${
        queryEmail ? `&email=${encodeURIComponent(queryEmail)}` : ''
      }`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Order not found');
      }
      setOrder(data.order);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error tracking order');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber, initialEmail);
    }
  }, [initialOrderNumber, initialEmail]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber, email);
  };

  // Pipeline stages
  const stages = [
    { key: 'PENDING_REVIEW', label: 'Order Confirmed', icon: Clock },
    { key: 'DIAGNOSTIC_PACKAGING', label: 'Diagnostic Testing & Packing', icon: Package },
    { key: 'SHIPPED', label: 'Dispatched to Courier', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return 0;
      case 'DIAGNOSTIC_PACKAGING':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStageIdx = order ? getStageIndex(order.orderStatus) : 0;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5]">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Real-Time Tracking
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-3">
            Track Certified Smartphone Order
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Enter your Order Number (e.g. SW-2026-XXXX) to view live inspection and shipping milestones.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="p-4 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl flex flex-col sm:flex-row gap-3 mb-10"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Order Number (e.g. SW-2026-8912)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="sm:w-64">
            <input
              type="email"
              placeholder="Customer Email (Optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition active:scale-95 disabled:opacity-50 shrink-0"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center mb-8">
            {errorMessage}
          </div>
        )}

        {/* Order Details View */}
        {order && (
          <div className="flex flex-col gap-8">
            {/* Live Pipeline Visual */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-zinc-900 pb-4">
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">
                    Order Reference
                  </span>
                  <span className="text-xl font-black text-white">{order.orderNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Status:</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {stages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isCompleted = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div
                      key={stage.key}
                      className={`p-4 rounded-2xl border flex flex-col gap-2 transition ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : isCompleted
                          ? 'border-zinc-800 bg-zinc-900/60'
                          : 'border-zinc-900 bg-zinc-950/40 opacity-40'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isCompleted
                            ? 'bg-emerald-500 text-black'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">{stage.label}</span>
                      <span className="text-[10px] text-zinc-400">
                        {isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Courier Tracking Info if shipped */}
              {order.carrierTrackingNumber && (
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                      Express Courier Tracking
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {order.carrierTrackingNumber}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-300">
                    Carrier: Express Courier Worldwide
                  </span>
                </div>
              )}
            </div>

            {/* Order Items & Refurbished Certificate */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Purchased Device & Refurbishment Guarantee
              </h3>

              <div className="flex flex-col gap-4 divide-y divide-zinc-900">
                {order.items?.map((item: any) => {
                  const inv = item.inventoryItem;
                  const prod = inv?.product;

                  return (
                    <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {prod?.modelName || 'Smartphone'}
                        </h4>
                        <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2 flex-wrap">
                          <span>{inv?.storage}</span>
                          <span>•</span>
                          <span>{inv?.color}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">
                            {inv?.conditionGrade} Grade
                          </span>
                        </div>

                        {inv?.imeiOrSerial && (
                          <div className="mt-2 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded-lg w-fit">
                            <span>Serialized IMEI:</span>
                            <span className="text-zinc-200">
                              •••• •••• •••• {inv.imeiOrSerial.slice(-4)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-baseline sm:items-end justify-between">
                        <span className="text-base font-black text-white">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> 1-Year Warranty
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total & Shipping Info */}
              <div className="border-t border-zinc-900 pt-4 flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping Recipient</span>
                  <span className="text-zinc-200 font-medium">{order.customerName}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Destination</span>
                  <span className="text-zinc-200 font-medium text-right max-w-xs">{order.shippingAddress}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Payment Method</span>
                  <span className="text-zinc-200 font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-900">
                  <span>Total Paid</span>
                  <span className="text-xl font-black text-emerald-400">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b]" />}>
      <TrackOrderInner />
    </Suspense>
  );
}
