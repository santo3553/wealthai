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
  Camera,
  UploadCloud,
  Sparkles,
  Eye,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Gallery preview state for existing items
  const [previewGalleryItem, setPreviewGalleryItem] = useState<any | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

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
    images: [] as string[],
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      setErrorMsg('');
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload pictures');
      }

      if (data.urls && data.urls.length > 0) {
        setNewItem((prev) => ({
          ...prev,
          images: [...prev.images, ...data.urls],
        }));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Image upload failed');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!customImageUrl.trim()) return;
    setNewItem((prev) => ({
      ...prev,
      images: [...prev.images, customImageUrl.trim()],
    }));
    setCustomImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setNewItem((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setNewItem((prev) => {
      const selected = prev.images[indexToPrimary];
      const remaining = prev.images.filter((_, idx) => idx !== indexToPrimary);
      return {
        ...prev,
        images: [selected, ...remaining],
      };
    });
  };

  const handleAddSamplePhotos = () => {
    const samples = [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    ];
    setNewItem((prev) => ({
      ...prev,
      images: Array.from(new Set([...prev.images, ...samples])),
    }));
  };

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
          images: newItem.images,
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
        images: [],
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
    (item) =>
      item.imeiOrSerial.toLowerCase().includes(search.toLowerCase()) ||
      item.product?.modelName?.toLowerCase().includes(search.toLowerCase()) ||
      item.color.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Device Ingestion & Inventory Studio
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Track individual serialized refurbished smartphones, real inspection photos, and battery diagnostics.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-black" />
          Ingest Refurbished Unit
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-800/80 p-2.5 rounded-2xl max-w-md">
        <Search className="w-4 h-4 text-zinc-400 ml-2" />
        <input
          type="text"
          placeholder="Search by IMEI, model name (iPhone, Galaxy), or color..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-white text-xs placeholder:text-zinc-500 focus:outline-none w-full"
        />
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-xs">
            Loading serialized units from database...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs">
            No inventory units matching search criteria.
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
                {filteredItems.map((item) => {
                  let photos: string[] = [];
                  try {
                    photos = item.imagesJson ? JSON.parse(item.imagesJson) : [];
                  } catch {}

                  return (
                    <tr key={item.id} className="hover:bg-zinc-900/30 transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white text-sm">
                          {item.product?.modelName}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {item.storage} • {item.color}
                        </div>
                        {photos.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewGalleryItem(item);
                              setActiveGalleryIndex(0);
                            }}
                            className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold transition group"
                          >
                            <Camera className="w-3 h-3 text-emerald-400" />
                            <span>{photos.length} Real Photo{photos.length > 1 ? 's' : ''}</span>
                            <Eye className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-zinc-600 italic block mt-1">
                            No physical photos
                          </span>
                        )}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ingestion Modal with Multi-Picture Add Option */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
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

              {/* MULTIPLE PICTURE ADD OPTION */}
              <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <label className="text-zinc-200 font-bold text-xs">
                      Physical Inspection Photos ({newItem.images.length})
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSamplePhotos}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
                  >
                    <Sparkles className="w-3 h-3" />
                    Insert Sample Photos
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Upload multiple photos of the physical smartphone (screen on, back housing, camera lens module, edges).
                </p>

                {/* Upload Action Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Box */}
                  <label className="relative border-2 border-dashed border-zinc-700 hover:border-emerald-500 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition bg-zinc-950/40 group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImages}
                      className="hidden"
                    />
                    {uploadingImages ? (
                      <div className="flex items-center gap-2 text-emerald-400 py-1">
                        <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-semibold">Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition mb-1" />
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400 transition">
                          Upload Files from Device
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Select multiple PNG, JPG, or WEBP
                        </span>
                      </>
                    )}
                  </label>

                  {/* Add URL Box */}
                  <div className="rounded-xl border border-zinc-800 p-2.5 flex flex-col justify-between bg-zinc-950/40">
                    <span className="text-[11px] font-semibold text-zinc-300 mb-1">
                      Or Add by Image URL:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://...image.jpg"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-[11px] focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddUrl}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-[11px] transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Picture Thumbnails Gallery */}
                {newItem.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {newItem.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 aspect-square"
                      >
                        <img
                          src={imgUrl}
                          alt={`Inspection photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Primary badge */}
                        <div className="absolute top-1 left-1">
                          {idx === 0 ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-black font-extrabold text-[9px] shadow">
                              COVER
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="px-1.5 py-0.5 rounded bg-zinc-900/80 text-zinc-300 hover:text-emerald-400 text-[9px] backdrop-blur-sm opacity-0 group-hover:opacity-100 transition"
                              title="Set as Cover Photo"
                            >
                              Make Cover
                            </button>
                          )}
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-950/80 hover:bg-red-600 text-red-200 hover:text-white transition opacity-0 group-hover:opacity-100 shadow"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  disabled={submitting || uploadingImages}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold transition disabled:opacity-50"
                >
                  {submitting ? 'Cataloging...' : 'Save Unit to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Gallery Modal for View Inspection Photos in Table */}
      {previewGalleryItem && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setPreviewGalleryItem(null)}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 flex flex-col gap-4 max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  {previewGalleryItem.product?.modelName} • {previewGalleryItem.imeiOrSerial}
                </h3>
                <span className="text-[11px] text-zinc-400">
                  {previewGalleryItem.conditionGrade} Grade • {previewGalleryItem.color} • {previewGalleryItem.batteryHealth}% Battery
                </span>
              </div>
              <button
                onClick={() => setPreviewGalleryItem(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Images Display */}
            {(() => {
              let photos: string[] = [];
              try {
                photos = previewGalleryItem.imagesJson ? JSON.parse(previewGalleryItem.imagesJson) : [];
              } catch {}

              if (photos.length === 0) {
                return (
                  <div className="p-8 text-center text-zinc-500 text-xs">
                    No physical inspection photos attached to this unit.
                  </div>
                );
              }

              return (
                <div className="flex flex-col gap-4">
                  {/* Main Large Image */}
                  <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-zinc-800">
                    <img
                      src={photos[activeGalleryIndex]}
                      alt="Inspection detail"
                      className="max-w-full max-h-full object-contain"
                    />

                    {/* Nav controls */}
                    {photos.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveGalleryIndex((prev) =>
                              prev === 0 ? photos.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition border border-zinc-700"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveGalleryIndex((prev) =>
                              prev === photos.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition border border-zinc-700"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-zinc-700 text-white text-[11px] font-semibold">
                      {activeGalleryIndex + 1} / {photos.length}
                    </div>
                  </div>

                  {/* Thumbnails row */}
                  {photos.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {photos.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveGalleryIndex(idx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                            activeGalleryIndex === idx
                              ? 'border-emerald-500 scale-105'
                              : 'border-zinc-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Thumb ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
