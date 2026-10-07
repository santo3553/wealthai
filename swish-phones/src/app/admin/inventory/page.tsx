'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  X,
  BatteryCharging,
  Tag,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [newItem, setNewItem] = useState({
    productId: '',
    imeiOrSerial: '',
    storage: '256GB',
    color: 'Natural Titanium',
    conditionGrade: 'PRISTINE' as 'PRISTINE' | 'GOOD' | 'FAIR',
    batteryHealth: 98,
    salePrice: 799,
    inspectionNotes: 'Verified 50-point diagnostic inspection. Battery OEM, 0 screen defects.',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      if (data.items) setItems(data.items);
      if (data.products) {
        setProducts(data.products);
        if (data.products.length > 0 && !newItem.productId) {
          setNewItem((prev) => ({ ...prev, productId: data.products[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          batteryHealth: Number(newItem.batteryHealth),
          salePrice: Number(newItem.salePrice),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to ingest device');
      }

      setShowModal(false);
      // Reset form
      setNewItem({
        productId: products[0]?.id || '',
        imeiOrSerial: '',
        storage: '256GB',
        color: 'Natural Titanium',
        conditionGrade: 'PRISTINE',
        batteryHealth: 98,
        salePrice: 799,
        inspectionNotes: 'Verified 50-point diagnostic inspection. Battery OEM, 0 screen defects.',
      });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: any) => {
    const nextStatus = item.stockStatus === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE';
    try {
      await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, stockStatus: nextStatus }),
      });
      loadData();
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this device record?')) return;
    try {
      await fetch(`/api/admin/inventory?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error('Error deleting item', err);
    }
  };

  const filteredItems = items.filter(
    (i) =>
      i.imeiOrSerial.toLowerCase().includes(search.toLowerCase()) ||
      i.product?.modelName.toLowerCase().includes(search.toLowerCase()) ||
      i.color.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Device Ingestion & Inventory Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track certified smartphones by unique IMEI, cosmetic grade, and battery health
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Ingest Refurbished Unit
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-3">
        <Search className="w-4 h-4 text-zinc-500 shrink-0" />
        <input
          type="text"
          placeholder="Search by IMEI / Serial number, device model, or colorway..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
        />
        <span className="text-xs text-zinc-500 shrink-0">
          {filteredItems.length} units listed
        </span>
      </div>

      {/* Inventory Table */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-500 animate-pulse">
            Loading inventory database records...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500">
            No devices found. Click "+ Ingest Refurbished Unit" to add your first physical stock item!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-500 uppercase tracking-wider border-b border-zinc-900 bg-zinc-900/40 text-[10px]">
                <tr>
                  <th className="py-4 px-6 font-semibold">Device Model</th>
                  <th className="py-4 px-6 font-semibold">Serialized IMEI</th>
                  <th className="py-4 px-6 font-semibold">Grade</th>
                  <th className="py-4 px-6 font-semibold">Battery %</th>
                  <th className="py-4 px-6 font-semibold">Sale Price</th>
                  <th className="py-4 px-6 font-semibold">Stock Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">
                        {item.product?.modelName}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {item.storage} • {item.color}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-zinc-300 font-medium">
                      {item.imeiOrSerial}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.conditionGrade === 'PRISTINE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : item.conditionGrade === 'GOOD'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {item.conditionGrade}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                        {item.batteryHealth}%
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-emerald-400 text-sm">
                      ${item.salePrice.toFixed(2)}
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition ${
                          item.stockStatus === 'AVAILABLE'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : item.stockStatus === 'RESERVED'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                        title="Click to toggle status"
                      >
                        {item.stockStatus}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 transition rounded-lg hover:bg-zinc-900"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ingestion Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl z-10 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Ingest Refurbished Smartphone</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="flex flex-col gap-4 text-xs">
              {/* Product Model */}
              <div>
                <label className="text-zinc-400 font-semibold block mb-1.5">
                  Select Base Phone Model *
                </label>
                <select
                  value={newItem.productId}
                  onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} {p.modelName} (Base: ${p.basePrice})
                    </option>
                  ))}
                </select>
              </div>

              {/* IMEI */}
              <div>
                <label className="text-zinc-400 font-semibold block mb-1.5">
                  Hardware IMEI / Serial Number (15 digits) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="358921098471999"
                  value={newItem.imeiOrSerial}
                  onChange={(e) => setNewItem({ ...newItem, imeiOrSerial: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Storage */}
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1.5">Storage *</label>
                  <select
                    value={newItem.storage}
                    onChange={(e) => setNewItem({ ...newItem, storage: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1.5">Colorway *</label>
                  <input
                    type="text"
                    required
                    value={newItem.color}
                    onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Condition Grade */}
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1.5">
                    Cosmetic Grade *
                  </label>
                  <select
                    value={newItem.conditionGrade}
                    onChange={(e) =>
                      setNewItem({ ...newItem, conditionGrade: e.target.value as any })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PRISTINE">PRISTINE (Like New)</option>
                    <option value="GOOD">GOOD (Minor Scuffs)</option>
                    <option value="FAIR">FAIR (Visible Wear)</option>
                  </select>
                </div>

                {/* Battery Health */}
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1.5">
                    Tested Battery Health % *
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    required
                    value={newItem.batteryHealth}
                    onChange={(e) =>
                      setNewItem({ ...newItem, batteryHealth: parseInt(e.target.value) || 90 })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-zinc-400 font-semibold block mb-1.5">
                  Assigned Sale Price ($ USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newItem.salePrice}
                  onChange={(e) =>
                    setNewItem({ ...newItem, salePrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              {/* Inspection Notes */}
              <div>
                <label className="text-zinc-400 font-semibold block mb-1.5">
                  Technician Inspection Notes
                </label>
                <textarea
                  rows={2}
                  value={newItem.inspectionNotes}
                  onChange={(e) => setNewItem({ ...newItem, inspectionNotes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold transition disabled:opacity-50"
                >
                  {submitting ? 'Cataloging...' : 'Save Unit to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
