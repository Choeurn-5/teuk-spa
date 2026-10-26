"use client";

import { useState, useRef } from "react";
import { updateTreatment } from "@/lib/content/actions";
import { addTreatment, deleteTreatment } from "@/lib/admin/actions";
import { Trash2, Edit2, X, Check, Plus, UploadCloud, Loader2, Tag } from "lucide-react";
import Image from "next/image";
import { calculateDurationPrice } from "@/lib/pricing";

import { ImagePicker } from "@/components/admin/ImagePicker";

export function TreatmentsManagerClient({ initialTreatments }: { initialTreatments: any[] }) {
  const [treatments, setTreatments] = useState(initialTreatments);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const [newTreatment, setNewTreatment] = useState({
    name: "",
    khmerName: "",
    category: "Body Therapy",
    shortDescription: "",
    durationOptionsText: "60:25, 90:35",
    discountPercent: "",
    imageUrl: "",
  });
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const newFileRef = useRef<HTMLInputElement>(null);

  const [editData, setEditData] = useState<any>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isValidExt = ["jpg", "jpeg", "png", "webp"].includes(ext || "");
    if (!allowed.includes(file.type) && !isValidExt) {
      alert("Invalid file format. Please upload a JPEG, PNG, or WebP image.");
      return null;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`Image is too large. Maximum allowed size is 5MB.`);
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        alert(data.error || `Upload failed.`);
        return null;
      }
      return data.url;
    } catch (err: any) {
      alert("Upload error.");
      return null;
    }
  };

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setEditData({
      name: t.name,
      khmerName: t.khmerName || "",
      category: t.category || "Body Therapy",
      shortDescription: t.shortDescription,
      active: t.active,
      discountPercent: t.discountPercent !== undefined && t.discountPercent !== null ? t.discountPercent : "",
      durationOptionsText:
        t.durationOptions
          ?.map((o: any) => (o.discountPrice ? `${o.minutes}:${o.price}:${o.discountPrice}` : `${o.minutes}:${o.price}`))
          .join(", ") || "60:25",
      imageUrl: t.imageUrl || "",
    });
    setEditFile(null);
    setEditPreview(null);
  };

  const handleSave = async (id: string) => {
    setLoading(true);
    let finalData = { ...editData };

    if (editFile) {
      setUploadingId(id);
      const url = await uploadImage(editFile);
      setUploadingId(null);
      if (!url) {
        setLoading(false);
        return;
      }
      finalData.imageUrl = url;
    }

    const parsedOptions = finalData.durationOptionsText.split(",").map((s: string) => {
      const parts = s.split(":").map((n: string) => parseInt(n.trim(), 10));
      const minutes = isNaN(parts[0]) ? 60 : parts[0];
      const price = isNaN(parts[1]) ? 0 : parts[1];
      const discountPrice = parts.length >= 3 && !isNaN(parts[2]) && parts[2] > 0 ? parts[2] : null;
      return { minutes, price, discountPrice };
    });

    const parsedDiscountPercent =
      finalData.discountPercent !== "" &&
      finalData.discountPercent !== null &&
      !isNaN(Number(finalData.discountPercent)) &&
      Number(finalData.discountPercent) > 0
        ? Number(finalData.discountPercent)
        : null;

    const res = await updateTreatment(id, {
      name: finalData.name,
      khmerName: finalData.khmerName || "",
      category: finalData.category || "Body Therapy",
      shortDescription: finalData.shortDescription,
      active: finalData.active,
      imageUrl: finalData.imageUrl,
      durationOptions: parsedOptions,
      discountPercent: parsedDiscountPercent,
    });
    if (res.success) {
      setTreatments(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, ...finalData, durationOptions: parsedOptions, discountPercent: parsedDiscountPercent }
            : t
        )
      );
      setEditingId(null);
      setEditFile(null);
      setEditPreview(null);
    }
    setLoading(false);
  };

  const handleQuickImageUpload = async (id: string, file: File) => {
    setUploadingId(id);
    const url = await uploadImage(file);
    if (url) {
      const res = await updateTreatment(id, { imageUrl: url });
      if (res.success) {
        setTreatments(prev => prev.map(t => (t.id === id ? { ...t, imageUrl: url } : t)));
      } else {
        alert("Failed to update treatment image.");
      }
    }
    setUploadingId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    const res = await deleteTreatment(id);
    if (res.success) {
      setTreatments(prev => prev.filter(t => t.id !== id));
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";
    if (newFile) {
      setUploadingId("new");
      const url = await uploadImage(newFile);
      setUploadingId(null);
      if (!url) {
        setLoading(false);
        return;
      }
      imageUrl = url;
    }

    const parsedOptions = newTreatment.durationOptionsText.split(",").map((s: string) => {
      const parts = s.split(":").map((n: string) => parseInt(n.trim(), 10));
      const minutes = isNaN(parts[0]) ? 60 : parts[0];
      const price = isNaN(parts[1]) ? 0 : parts[1];
      const discountPrice = parts.length >= 3 && !isNaN(parts[2]) && parts[2] > 0 ? parts[2] : null;
      return { minutes, price, discountPrice };
    });

    const parsedDiscountPercent =
      newTreatment.discountPercent !== "" &&
      newTreatment.discountPercent !== null &&
      !isNaN(Number(newTreatment.discountPercent)) &&
      Number(newTreatment.discountPercent) > 0
        ? Number(newTreatment.discountPercent)
        : null;

    const res = await addTreatment({
      ...newTreatment,
      durationOptions: parsedOptions,
      discountPercent: parsedDiscountPercent,
      imageUrl,
    });

    if (res.success) {
      setTreatments(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          ...newTreatment,
          imageUrl,
          durationOptions: parsedOptions,
          discountPercent: parsedDiscountPercent,
          active: true,
          order: prev.length,
        },
      ]);
      setNewTreatment({
        name: "",
        khmerName: "",
        category: "Body Therapy",
        shortDescription: "",
        durationOptionsText: "60:25, 90:35",
        discountPercent: "",
        imageUrl: "",
      });
      setNewFile(null);
      setNewPreview(null);
      setShowAddForm(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-olive text-cream text-sm font-medium rounded-xl hover:bg-gold transition-colors"
        >
          {showAddForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showAddForm ? "Cancel" : "Add Treatment"}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white border-2 border-olive/30 rounded-2xl p-6 space-y-4">
          <h3 className="font-serif text-xl text-olive">New Treatment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1">Treatment Name (English) *</label>
              <input required type="text" value={newTreatment.name} onChange={e => setNewTreatment({...newTreatment, name: e.target.value})} className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" placeholder="e.g. Aromatherapy Massage" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1">Khmer Name (ឈ្មោះខ្មែរ)</label>
              <input type="text" value={newTreatment.khmerName} onChange={e => setNewTreatment({...newTreatment, khmerName: e.target.value})} className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" placeholder="e.g. ម៉ាស្សាប្រេងធម្មតា" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1">Category *</label>
              <select value={newTreatment.category} onChange={e => setNewTreatment({...newTreatment, category: e.target.value})} className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive bg-white">
                <option value="Body Therapy">Body Therapy (ម៉ាស្សាខ្លួន)</option>
                <option value="Facial Treatment">Facial Treatment (ម៉ាស្សាមុខ)</option>
                <option value="Body Scrub">Body Scrub (ជម្រុះកោសិកាខ្លួន)</option>
                <option value="Body Wrap">Body Wrap (អប់ស្បែក)</option>
                <option value="Natural Nail Care & Salon">Natural Nail Care & Salon (ក្រចក & សក់)</option>
                <option value="Wellness & Hydrotherapy">Wellness & Hydrotherapy (ស្ទីម & សូណា)</option>
                <option value="Wellness & Beauty">Wellness & Beauty (បករោម)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1">Durations & Prices (mins:price or mins:price:discount) *</label>
              <input required type="text" value={newTreatment.durationOptionsText} onChange={e => setNewTreatment({...newTreatment, durationOptionsText: e.target.value})} className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" placeholder="e.g. 60:25, 90:35 (or 60:25:20 for discount)" />
              <p className="text-[11px] text-ink/50 mt-1">Format: mins:price or mins:price:discountPrice. Omit discount for regular price.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1">Overall Discount % (Optional)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={newTreatment.discountPercent}
                  onChange={e => setNewTreatment({...newTreatment, discountPercent: e.target.value})}
                  className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive"
                  placeholder="e.g. 20 (applies 20% off all durations)"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink/40">% OFF</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ink/80 mb-1">Short Description *</label>
              <textarea required rows={2} value={newTreatment.shortDescription} onChange={e => setNewTreatment({...newTreatment, shortDescription: e.target.value})} className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" placeholder="A short, enticing description for the public menu..." />
            </div>
            <div className="md:col-span-2">
              <ImagePicker
                previewUrl={newPreview}
                onFileSelect={(file, url) => {
                  setNewFile(file);
                  setNewPreview(url);
                }}
                inputRef={newFileRef}
              />
              {uploadingId === "new" && (
                <p className="text-xs text-olive mt-1 flex items-center">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading image...
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-olive text-cream rounded-xl text-sm font-medium hover:bg-gold transition-colors disabled:opacity-50">
              {loading ? "Saving..." : "Add Treatment"}
            </button>
          </div>
        </form>
      )}

      {/* Treatments List */}
      <div className="bg-warm rounded-2xl border border-mist shadow-sm overflow-hidden">
        <ul className="divide-y divide-mist">
          {treatments.map(t => (
            <li key={t.id} className="p-6">
              {editingId === t.id ? (
                // EDIT MODE
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-ink/60 mb-1 uppercase tracking-widest">Name (English)</label>
                      <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink/60 mb-1 uppercase tracking-widest">Khmer Name (ឈ្មោះខ្មែរ)</label>
                      <input type="text" value={editData.khmerName || ""} onChange={e => setEditData({...editData, khmerName: e.target.value})} className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive bg-white" placeholder="e.g. ម៉ាស្សាប្រេងធម្មតា" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink/60 mb-1 uppercase tracking-widest">Category</label>
                      <select value={editData.category || "Body Therapy"} onChange={e => setEditData({...editData, category: e.target.value})} className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive bg-white">
                        <option value="Body Therapy">Body Therapy (ម៉ាស្សាខ្លួន)</option>
                        <option value="Facial Treatment">Facial Treatment (ម៉ាស្សាមុខ)</option>
                        <option value="Body Scrub">Body Scrub (ជម្រុះកោសិកាខ្លួន)</option>
                        <option value="Body Wrap">Body Wrap (អប់ស្បែក)</option>
                        <option value="Natural Nail Care & Salon">Natural Nail Care & Salon (ក្រចក & សក់)</option>
                        <option value="Wellness & Hydrotherapy">Wellness & Hydrotherapy (ស្ទីម & សូណា)</option>
                        <option value="Wellness & Beauty">Wellness & Beauty (បករោម)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink/60 mb-1 uppercase tracking-widest">Durations & Prices (mins:price or mins:price:discount)</label>
                      <input type="text" value={editData.durationOptionsText} onChange={e => setEditData({...editData, durationOptionsText: e.target.value})} className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive bg-white" placeholder="60:25, 90:35 (or 60:25:20)" />
                      <p className="text-[11px] text-ink/50 mt-1">Format: mins:price or mins:price:discountPrice. Omit discount for regular price.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink/60 mb-1 uppercase tracking-widest">Overall Discount % (Optional)</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={editData.discountPercent ?? ""}
                          onChange={e => setEditData({...editData, discountPercent: e.target.value})}
                          className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive bg-white"
                          placeholder="e.g. 20 (applies 20% off all options)"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink/40">% OFF</span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-ink/60 mb-1 uppercase tracking-widest">Short Description</label>
                      <textarea rows={2} value={editData.shortDescription} onChange={e => setEditData({...editData, shortDescription: e.target.value})} className="w-full px-3 py-2 border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive bg-white" />
                    </div>
                    <div className="md:col-span-2">
                      <ImagePicker
                        previewUrl={editPreview || editData.imageUrl || null}
                        onFileSelect={(file, url) => {
                          setEditFile(file);
                          setEditPreview(url);
                        }}
                        inputRef={editFileRef}
                        label="Treatment Image (click to replace)"
                      />
                      {uploadingId === t.id && (
                        <p className="text-xs text-olive mt-1 flex items-center">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading image...
                        </p>
                      )}
                    </div>
                    <div className="flex items-center md:col-span-2">
                      <input type="checkbox" id={`active-${t.id}`} checked={editData.active} onChange={e => setEditData({...editData, active: e.target.checked})} className="w-4 h-4 text-olive rounded" />
                      <label htmlFor={`active-${t.id}`} className="ml-2 text-sm text-ink/80">Visible to public</label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-ink/60 hover:text-ink rounded-xl border border-mist hover:bg-mist transition-colors">Cancel</button>
                    <button onClick={() => handleSave(t.id)} disabled={loading} className="px-4 py-2 text-sm bg-olive text-cream rounded-xl hover:bg-gold transition-colors disabled:opacity-50 flex items-center">
                      {loading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Saving...</> : <><Check className="w-4 h-4 mr-1" /> Save</>}
                    </button>
                  </div>
                </div>
              ) : (
                // VIEW MODE
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-start gap-5 flex-1 w-full">
                    {/* Thumbnail & Quick Image Upload */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div
                        onClick={() => {
                          const input = document.getElementById(`quick-upload-${t.id}`) as HTMLInputElement;
                          input?.click();
                        }}
                        className="relative w-28 h-28 rounded-2xl overflow-hidden bg-mist/60 border border-mist hover:border-olive cursor-pointer group transition-all shadow-sm"
                        title="Click to upload or replace photo"
                      >
                        {t.imageUrl ? (
                          <Image
                            src={t.imageUrl}
                            alt={t.name}
                            fill
                            unoptimized={Boolean(t.imageUrl.startsWith("data:"))}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full p-2 text-center bg-mist/40">
                            <UploadCloud className="w-6 h-6 text-olive/60 mb-1" />
                            <span className="text-[11px] font-medium text-ink/60 leading-tight">Add Photo</span>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                          {uploadingId === t.id ? (
                            <Loader2 className="w-6 h-6 text-cream animate-spin" />
                          ) : (
                            <>
                              <UploadCloud className="w-5 h-5 text-cream mb-1" />
                              <span className="text-[10px] font-medium text-cream tracking-wide uppercase">
                                {t.imageUrl ? "Replace" : "Upload"}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Loading spinner */}
                        {uploadingId === t.id && (
                          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-cream animate-spin" />
                          </div>
                        )}
                      </div>

                      <input
                        id={`quick-upload-${t.id}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleQuickImageUpload(t.id, file);
                          }
                          e.target.value = "";
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(`quick-upload-${t.id}`) as HTMLInputElement;
                          input?.click();
                        }}
                        disabled={uploadingId === t.id}
                        className="text-xs font-medium text-olive hover:text-gold flex items-center transition-colors disabled:opacity-50"
                      >
                        <UploadCloud className="w-3.5 h-3.5 mr-1" />
                        {uploadingId === t.id ? "Uploading..." : (t.imageUrl ? "Change photo" : "Upload photo")}
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                        <h3 className="font-serif text-xl text-olive">{t.name}</h3>
                        {t.khmerName && (
                          <span className="text-sm font-medium text-gold font-sans">
                            ({t.khmerName})
                          </span>
                        )}
                        {t.category && (
                          <span className="text-[11px] px-2.5 py-0.5 bg-olive/10 text-olive rounded-full font-medium">
                            {t.category}
                          </span>
                        )}
                        {!t.active && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded font-medium">Hidden</span>}
                      </div>
                      <p className="text-sm text-ink/60 font-light mb-2 max-w-xl">{t.shortDescription}</p>
                      <div className="text-xs font-medium flex flex-wrap items-center gap-2">
                        {t.durationOptions?.map((opt: any, i: number) => {
                          const priceInfo = calculateDurationPrice(opt, t.discountPercent);
                          return (
                            <span
                              key={i}
                              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                                priceInfo.hasDiscount
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-gold/10 text-gold"
                              }`}
                            >
                              <span>{opt.minutes}min ·</span>
                              {priceInfo.hasDiscount ? (
                                <>
                                  <span className="line-through text-ink/40 font-normal">
                                    ${priceInfo.regularPrice}
                                  </span>
                                  <span className="font-bold text-emerald-700">
                                    ${priceInfo.finalPrice}
                                  </span>
                                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                                    -{priceInfo.discountPercent}%
                                  </span>
                                </>
                              ) : (
                                <span>${priceInfo.regularPrice}</span>
                              )}
                            </span>
                          );
                        })}
                        {t.discountPercent && (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {t.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 sm:self-center">
                    <button
                      onClick={() => startEdit(t)}
                      className="px-3 py-1.5 text-xs text-ink/70 hover:text-olive rounded-xl border border-mist hover:bg-mist transition-colors flex items-center gap-1.5"
                      title="Edit Treatment Details"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      disabled={loading}
                      className="p-2 text-ink/40 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
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
