"use client";

import { useState, useRef } from "react";
import { addPackage, updatePackage, deletePackage } from "./actions";
import { Trash2, Edit2, Check, X, Plus, UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";

// Helpers for the "includes" list
const updateInclude = (list: string[], i: number, val: string) => list.map((item, idx) => idx === i ? val : item);
const addInclude = (list: string[]) => [...list, ""];
const removeInclude = (list: string[], i: number) => list.filter((_, idx) => idx !== i);

function IncludesList({ items, onChange }: { items: string[], onChange: (items: string[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={e => onChange(updateInclude(items, i, e.target.value))}
            placeholder="e.g. 60 min Aromatherapy"
            className="flex-1 px-3 py-2 border border-mist rounded-lg focus:outline-none focus:ring-1 focus:ring-olive text-sm bg-white"
          />
          <button
            type="button"
            onClick={() => onChange(removeInclude(items, i))}
            className="p-2 text-ink/40 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange(addInclude(items))}
        className="text-sm text-olive hover:text-gold flex items-center"
      >
        <Plus className="w-4 h-4 mr-1" /> Add Item
      </button>
    </div>
  );
}

// Reusable Image Picker Component (placed outside to avoid remounting on state changes)
function ImagePicker({
  previewUrl,
  onFileSelect,
  inputRef,
  label = "Package Image",
}: {
  previewUrl?: string | null;
  onFileSelect: (file: File, localUrl: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  label?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink/80 mb-2">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-full h-40 rounded-xl border-2 border-dashed border-mist hover:border-olive cursor-pointer overflow-hidden bg-mist/30 flex items-center justify-center transition-colors group"
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            unoptimized={previewUrl.startsWith("blob:")}
            className="object-cover"
          />
        ) : (
          <div className="text-center">
            <UploadCloud className="w-8 h-8 text-sage mx-auto mb-1" />
            <p className="text-xs text-ink/50">Click to upload (JPEG, PNG, WebP · max 5MB)</p>
          </div>
        )}
        <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-medium bg-ink/60 px-3 py-1 rounded-full">
            {previewUrl ? "Change Image" : "Upload Image"}
          </span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            onFileSelect(file, URL.createObjectURL(file));
          }
        }}
      />
    </div>
  );
}

export function PackagesManagerClient({ initialPackages }: { initialPackages: any[] }) {
  const [packages, setPackages] = useState(initialPackages);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [editPkgFile, setEditPkgFile] = useState<File | null>(null);
  const [editPkgPreview, setEditPkgPreview] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const emptyNew = { name: "", description: "", totalMinutes: 90, price: 50, includes: [""], imageUrl: "" };
  const [newPkg, setNewPkg] = useState(emptyNew);
  const [newPkgPreview, setNewPkgPreview] = useState<string | null>(null);
  const [newPkgFile, setNewPkgFile] = useState<File | null>(null);
  const newFileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  // --- Image Upload Helper with Robust Validation & Error Handling ---
  const uploadImage = async (file: File): Promise<string | null> => {
    // 1. Client-side format validation
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isValidExt = ["jpg", "jpeg", "png", "webp"].includes(ext || "");
    if (!allowed.includes(file.type) && !isValidExt) {
      alert("Invalid file format. Please upload a JPEG, PNG, or WebP image.");
      return null;
    }

    // 2. Client-side size validation (5MB max)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      alert(`Image is too large (${sizeMB}MB). Maximum allowed size is 5MB. Please choose a smaller image.`);
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      if (!res.ok || !data.url) {
        alert(data.error || `Upload failed (Status: ${res.status}).`);
        return null;
      }

      return data.url;
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Upload error: " + (err.message || "Failed to reach server. Please try again."));
      return null;
    }
  };

  const startEdit = (pkg: any) => {
    setEditingId(pkg.id);
    setEditData({ ...pkg, includes: pkg.includes?.length ? pkg.includes : [""] });
    setEditPkgFile(null);
    setEditPkgPreview(null);
  };

  const handleSave = async (id: string) => {
    setLoading(true);
    let finalData = { ...editData };

    // Upload new image if staged
    if (editPkgFile) {
      setUploadingId(id);
      const url = await uploadImage(editPkgFile);
      setUploadingId(null);
      if (!url) {
        setLoading(false);
        return;
      }
      finalData.imageUrl = url;
    }

    const res = await updatePackage(id, finalData);
    if (res.success) {
      setPackages(prev => prev.map(p => p.id === id ? { ...p, ...finalData } : p));
      setEditingId(null);
      setEditPkgFile(null);
      setEditPkgPreview(null);
    } else {
      alert(res.error || "Failed to save package updates.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    const res = await deletePackage(id);
    if (res.success) {
      setPackages(prev => prev.filter(p => p.id !== id));
    } else {
      alert(res.error || "Failed to delete package.");
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";
    if (newPkgFile) {
      setUploadingId("new");
      const url = await uploadImage(newPkgFile);
      setUploadingId(null);
      if (!url) {
        setLoading(false);
        return; // Don't wipe the form so the user can fix the image
      }
      imageUrl = url;
    }

    const res = await addPackage({
      ...newPkg,
      totalMinutes: Number(newPkg.totalMinutes),
      price: Number(newPkg.price),
      imageUrl,
    });

    if (res.success) {
      setPackages(prev => [
        ...prev,
        { id: Date.now().toString(), ...newPkg, imageUrl, active: true, order: prev.length },
      ]);
      setNewPkg(emptyNew);
      setNewPkgPreview(null);
      setNewPkgFile(null);
      setShowAddForm(false);
    } else {
      alert(res.error || "Failed to add package.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-olive text-cream text-sm font-medium rounded-xl hover:bg-gold transition-colors"
        >
          {showAddForm ? <><X className="w-4 h-4 mr-2" />Cancel</> : <><Plus className="w-4 h-4 mr-2" />Add Package</>}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white border-2 border-olive/30 rounded-2xl p-6 space-y-4">
          <h3 className="font-serif text-xl text-olive">New Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1">Package Name *</label>
              <input
                required
                type="text"
                value={newPkg.name}
                onChange={e => setNewPkg({ ...newPkg, name: e.target.value })}
                className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive"
                placeholder="e.g. Teuk Signature Package"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-ink/80 mb-1">Minutes *</label>
                <input
                  required
                  type="number"
                  value={newPkg.totalMinutes}
                  onChange={e => setNewPkg({ ...newPkg, totalMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-ink/80 mb-1">Price (USD) *</label>
                <input
                  required
                  type="number"
                  value={newPkg.price}
                  onChange={e => setNewPkg({ ...newPkg, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ink/80 mb-1">Description *</label>
              <textarea
                required
                rows={2}
                value={newPkg.description}
                onChange={e => setNewPkg({ ...newPkg, description: e.target.value })}
                className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive"
              />
            </div>
            <div className="md:col-span-2">
              <ImagePicker
                previewUrl={newPkgPreview}
                onFileSelect={(file, url) => {
                  setNewPkgFile(file);
                  setNewPkgPreview(url);
                }}
                inputRef={newFileRef}
              />
              {uploadingId === "new" && (
                <p className="text-xs text-olive mt-1 flex items-center">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading image...
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ink/80 mb-2">What&apos;s Included</label>
              <IncludesList items={newPkg.includes} onChange={items => setNewPkg({ ...newPkg, includes: items })} />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-olive text-cream rounded-xl text-sm font-medium hover:bg-gold transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Add Package"}
            </button>
          </div>
        </form>
      )}

      {/* Package List */}
      <div className="bg-warm rounded-2xl border border-mist shadow-sm overflow-hidden">
        {packages.length === 0 && (
          <div className="p-12 text-center text-ink/60 font-light">No packages yet. Add your first one above!</div>
        )}
        <ul className="divide-y divide-mist">
          {packages.map(pkg => (
            <li key={pkg.id} className="p-6">
              {editingId === pkg.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-ink/60 uppercase tracking-widest mb-1">Name</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive bg-white"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-ink/60 uppercase tracking-widest mb-1">Minutes</label>
                        <input
                          type="number"
                          value={editData.totalMinutes}
                          onChange={e => setEditData({ ...editData, totalMinutes: e.target.value })}
                          className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive bg-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-ink/60 uppercase tracking-widest mb-1">Price ($)</label>
                        <input
                          type="number"
                          value={editData.price}
                          onChange={e => setEditData({ ...editData, price: e.target.value })}
                          className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`active-${pkg.id}`}
                        checked={editData.active}
                        onChange={e => setEditData({ ...editData, active: e.target.checked })}
                        className="w-4 h-4 text-olive rounded"
                      />
                      <label htmlFor={`active-${pkg.id}`} className="ml-2 text-sm text-ink/80">Visible to public</label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-ink/60 uppercase tracking-widest mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={editData.description}
                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <ImagePicker
                        previewUrl={editPkgPreview || editData.imageUrl || null}
                        onFileSelect={(file, url) => {
                          setEditPkgFile(file);
                          setEditPkgPreview(url);
                        }}
                        inputRef={editFileRef}
                        label="Package Image (click to replace)"
                      />
                      {uploadingId === pkg.id && (
                        <p className="text-xs text-olive mt-1 flex items-center">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading image...
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-ink/60 uppercase tracking-widest mb-2">Includes</label>
                      <IncludesList
                        items={editData.includes || [""]}
                        onChange={items => setEditData({ ...editData, includes: items })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 text-sm text-ink/60 rounded-xl border border-mist hover:bg-mist transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(pkg.id)}
                      disabled={loading}
                      className="px-4 py-2 text-sm bg-olive text-cream rounded-xl hover:bg-gold transition-colors disabled:opacity-50 flex items-center"
                    >
                      {loading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Saving...</> : <><Check className="w-4 h-4 mr-1" />Save</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-5 flex-1">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-mist shrink-0 border border-mist/50">
                      <Image
                        src={pkg.imageUrl || "/images/defaults/spa_package.jpg"}
                        alt={pkg.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5 mb-1">
                        <h3 className="font-serif text-xl text-olive">{pkg.name}</h3>
                        {pkg.khmerName && (
                          <span className="text-sm font-medium text-gold font-sans">
                            ({pkg.khmerName})
                          </span>
                        )}
                        {!pkg.active && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded font-medium">Hidden</span>
                        )}
                      </div>
                      <p className="text-xs text-gold uppercase tracking-widest font-medium mb-1">
                        {pkg.totalMinutes} MIN · ${pkg.price}
                      </p>
                      <p className="text-sm text-ink/70 font-light line-clamp-2">{pkg.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(pkg)}
                      className="p-2 text-ink/40 hover:text-olive rounded-xl hover:bg-mist transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      disabled={loading}
                      className="p-2 text-ink/40 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
