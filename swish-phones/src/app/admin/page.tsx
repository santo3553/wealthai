import React from 'react';
import { prisma } from '@/lib/prisma';
import {
  DollarSign,
  Smartphone,
  Package,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Aggregate real metrics from database
  const totalStock = await prisma.deviceInventoryItem.count({
    where: { stockStatus: 'AVAILABLE' },
  });

  const totalSold = await prisma.deviceInventoryItem.count({
    where: { stockStatus: 'SOLD' },
  });

  const pendingOrders = await prisma.order.count({
    where: {
      orderStatus: { in: ['PENDING_REVIEW', 'DIAGNOSTIC_PACKAGING'] },
    },
  });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      items: {
        include: {
          inventoryItem: {
            include: { product: true },
          },
        },
      },
    },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    {
      label: 'Total Certified Stock',
      value: totalStock,
      desc: 'Active units in warehouse',
      icon: Smartphone,
      color: 'text-emerald-400',
    },
    {
      label: 'Orders In Pipeline',
      value: pendingOrders,
      desc: 'Awaiting inspection/dispatch',
      icon: Package,
      color: 'text-blue-400',
    },
    {
      label: 'Total Units Sold',
      value: totalSold,
      desc: 'Fulfilled orders to date',
      icon: TrendingUp,
      color: 'text-purple-400',
    },
    {
      label: 'Recent Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      desc: 'From active demo orders',
      icon: DollarSign,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Operations & Warehouse Control
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time diagnostic inventory management and order dispatch pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            + Ingest New Phone
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-bold transition flex items-center gap-2"
          >
            Fulfillment Queue ({pendingOrders})
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between gap-4"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-zinc-400">{s.label}</span>
                <div className={`p-2 rounded-xl bg-zinc-900 border border-zinc-800 ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-white block">{s.value}</span>
                <span className="text-[11px] text-zinc-500 mt-1 block">{s.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Customer Orders</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Latest transactions placed on the storefront
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            View all orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">
            No customer orders placed yet. Place a test order from the catalog!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-500 uppercase tracking-wider border-b border-zinc-900 text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Order #</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Devices Ordered</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-900/40 transition">
                    <td className="py-3.5 font-mono font-bold text-white">{o.orderNumber}</td>
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{o.customerName}</div>
                      <div className="text-[10px] text-zinc-500">{o.customerEmail}</div>
                    </td>
                    <td className="py-3.5">
                      {o.items.map((it: any) => (
                        <div key={it.id} className="text-zinc-300">
                          {it.inventoryItem?.product?.modelName} ({it.inventoryItem?.storage})
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 font-bold text-emerald-400">
                      ${o.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {o.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-xs text-zinc-400 hover:text-white px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
