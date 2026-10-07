'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Search,
  X,
  ShieldCheck,
  BatteryCharging,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [selectedOrderForShip, setSelectedOrderForShip] = useState<any>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, nextStatus: string, tracking?: string) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          orderStatus: nextStatus,
          carrierTrackingNumber: tracking,
        }),
      });
      setSelectedOrderForShip(null);
      setTrackingNumberInput('');
      loadOrders();
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filterStatus === 'ALL' || o.orderStatus === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Order Fulfillment & Dispatch Pipeline
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review customer orders, verify diagnostic IMEI units, and record courier tracking numbers
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'PENDING_REVIEW', label: 'Pending Review' },
            { id: 'DIAGNOSTIC_PACKAGING', label: 'Testing / Packing' },
            { id: 'SHIPPED', label: 'Shipped' },
            { id: 'DELIVERED', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === tab.id
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order # or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-500 animate-pulse">
            Loading orders pipeline...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-500 uppercase tracking-wider border-b border-zinc-900 bg-zinc-900/40 text-[10px]">
                <tr>
                  <th className="py-4 px-6 font-semibold">Order Reference</th>
                  <th className="py-4 px-6 font-semibold">Customer & Destination</th>
                  <th className="py-4 px-6 font-semibold">Unit IMEI & Model</th>
                  <th className="py-4 px-6 font-semibold">Payment</th>
                  <th className="py-4 px-6 font-semibold">Pipeline Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Fulfillment Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-white text-sm">
                        {order.orderNumber}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{order.customerName}</div>
                      <div className="text-[11px] text-zinc-400">{order.customerEmail}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 truncate max-w-xs">
                        {order.shippingAddress}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {order.items.map((it: any) => {
                        const inv = it.inventoryItem;
                        return (
                          <div key={it.id} className="mb-1 last:mb-0">
                            <span className="font-medium text-white">
                              {inv?.product?.modelName}
                            </span>
                            <div className="text-[11px] text-zinc-400 font-mono">
                              IMEI: {inv?.imeiOrSerial} • {inv?.conditionGrade}
                            </div>
                          </div>
                        );
                      })}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-emerald-400 text-sm">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold inline-block ${
                          order.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : order.orderStatus === 'SHIPPED'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                      {order.carrierTrackingNumber && (
                        <div className="text-[10px] font-mono text-zinc-500 mt-1">
                          Tracking: {order.carrierTrackingNumber}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Status Advancement Buttons */}
                        {order.orderStatus === 'PENDING_REVIEW' && (
                          <button
                            onClick={() =>
                              handleStatusChange(order.id, 'DIAGNOSTIC_PACKAGING')
                            }
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs"
                          >
                            Mark Testing
                          </button>
                        )}

                        {order.orderStatus === 'DIAGNOSTIC_PACKAGING' && (
                          <button
                            onClick={() => {
                              setSelectedOrderForShip(order);
                              setTrackingNumberInput(`SW-EXP-${Math.floor(100000 + Math.random() * 900000)}`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20"
                          >
                            Dispatch & Ship
                          </button>
                        )}

                        {order.orderStatus === 'SHIPPED' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-xs"
                          >
                            Mark Delivered
                          </button>
                        )}

                        {/* Invoice & Warranty Certificate */}
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800"
                          title="Print Warranty Certificate & Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dispatch & Tracking Modal */}
      {selectedOrderForShip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrderForShip(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 z-10 flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              Dispatch Order to Courier
            </h3>
            <p className="text-xs text-zinc-400">
              Provide the tracking code for Order #{selectedOrderForShip.orderNumber}.
            </p>

            <div>
              <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                Courier Carrier Tracking Code *
              </label>
              <input
                type="text"
                value={trackingNumberInput}
                onChange={(e) => setTrackingNumberInput(e.target.value)}
                placeholder="DHL-98124018"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrderForShip(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusChange(
                    selectedOrderForShip.id,
                    'SHIPPED',
                    trackingNumberInput
                  )
                }
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Refurbishment Warranty Certificate & Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setSelectedOrderForInvoice(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl z-10 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            {/* Action Bar */}
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-base">
                  Official Refurbishment Certificate & Invoice
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-400"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Certificate
                </button>
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Certificate Body (Printable layout) */}
            <div className="bg-white text-black p-8 rounded-2xl flex flex-col gap-6 shadow-inner font-sans">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-zinc-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-black">SWISH</h2>
                  <div className="text-xs text-zinc-600">
                    Certified Pre-Owned Smartphone Diagnostics Lab
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">warranty@swishphones.com</div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                    12-MONTH CERTIFIED WARRANTY
                  </span>
                  <div className="text-xs font-mono font-bold mt-2 text-zinc-800">
                    Order Ref: {selectedOrderForInvoice.orderNumber}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="text-xs grid grid-cols-2 gap-4">
                <div>
                  <strong className="block text-zinc-500 uppercase tracking-wider text-[10px]">
                    Customer / Recipient:
                  </strong>
                  <div className="font-bold text-sm text-zinc-900">
                    {selectedOrderForInvoice.customerName}
                  </div>
                  <div className="text-zinc-600">{selectedOrderForInvoice.customerEmail}</div>
                  <div className="text-zinc-600">{selectedOrderForInvoice.shippingAddress}</div>
                </div>

                <div>
                  <strong className="block text-zinc-500 uppercase tracking-wider text-[10px]">
                    Carrier & Tracking:
                  </strong>
                  <div className="font-mono text-xs text-zinc-900">
                    {selectedOrderForInvoice.carrierTrackingNumber || 'Pending Dispatch'}
                  </div>
                  <div className="text-zinc-500 text-[10px] mt-1">
                    Payment Method: {selectedOrderForInvoice.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Items & Diagnostic Tests */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-100 text-zinc-600 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Device & Hardware IMEI</th>
                      <th className="py-2.5 px-3">Battery Health</th>
                      <th className="py-2.5 px-3">Cosmetic Grade</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {selectedOrderForInvoice.items.map((it: any) => (
                      <tr key={it.id}>
                        <td className="py-3 px-3">
                          <div className="font-bold text-zinc-900">
                            {it.inventoryItem?.product?.modelName} ({it.inventoryItem?.storage})
                          </div>
                          <div className="font-mono text-[11px] text-zinc-600">
                            IMEI: {it.inventoryItem?.imeiOrSerial}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-emerald-700">
                          {it.inventoryItem?.batteryHealth}% Capacity
                        </td>
                        <td className="py-3 px-3 font-semibold text-zinc-800">
                          {it.inventoryItem?.conditionGrade}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-zinc-900">
                          ${it.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 50-Point Inspection Stamp */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  <div>
                    <div className="font-bold text-zinc-900">
                      50-Point Hardware Certification Passed
                    </div>
                    <div className="text-[10px] text-zinc-600">
                      Includes 12-month hardware warranty against defective parts, touch panel, or battery degradation.
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-zinc-900">
                    Total: ${selectedOrderForInvoice.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">PAID IN FULL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
