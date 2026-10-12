"use client";

import { useState, useRef } from "react";
import { updateSiteSettings } from "@/lib/content/actions";
import { Check, Loader2 } from "lucide-react";
import { ImagePicker } from "@/components/admin/ImagePicker";

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [formData, setFormData] = useState({
    businessName: initialSettings.businessName || "",
    phone: initialSettings.phone || "",
    email: initialSettings.email || "",
    address: initialSettings.address || "",
    hoursDisplay: initialSettings.hoursDisplay || "",
    mapUrl: initialSettings.mapUrl || "",
    announcement: initialSettings.announcement || "",
    heroImage1: initialSettings.heroImage1 || "/images/defaults/spa_hero.jpg",
    heroImage2: initialSettings.heroImage2 || "/images/defaults/aromatherapy.jpg",
    heroImage3: initialSettings.heroImage3 || "/images/defaults/herbal_compress.jpg",
    heroImage4: initialSettings.heroImage4 || "/images/defaults/spa_package.jpg",
    aboutImage: initialSettings.aboutImage || "/images/defaults/spa_herbs.jpg",
    ctaImage: initialSettings.ctaImage || "/images/defaults/spa_package.jpg",
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Refs for file inputs
  const refs = {
    heroImage1: useRef<HTMLInputElement>(null),
    heroImage2: useRef<HTMLInputElement>(null),
    heroImage3: useRef<HTMLInputElement>(null),
    heroImage4: useRef<HTMLInputElement>(null),
    aboutImage: useRef<HTMLInputElement>(null),
    ctaImage: useRef<HTMLInputElement>(null),
  };

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
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
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

  const handleFileSelect = async (field: string, file: File) => {
    setUploadingField(field);
    const url = await uploadImage(file);
    setUploadingField(null);
    if (url) {
      setFormData((prev) => ({ ...prev, [field]: url }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateSiteSettings(formData);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("Failed to save settings.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-10">
      
      {/* Contact & Hours Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif text-olive border-b border-mist pb-2">Contact & Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1">Phone Number / WhatsApp</label>
            <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 bg-white border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1">Email Address</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-white border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">Physical Address</label>
          <textarea rows={2} required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 bg-white border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">Opening Hours (Display Text)</label>
          <textarea rows={3} required value={formData.hoursDisplay} onChange={e => setFormData({...formData, hoursDisplay: e.target.value})} className="w-full px-4 py-2 bg-white border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" />
          <p className="text-xs text-ink/50 mt-1">Example: Monday – Sunday\n10:00 AM – 10:00 PM</p>
        </div>
      </div>

      {/* Overview Section Images */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif text-olive border-b border-mist pb-2">Overview Images</h2>
        <p className="text-sm text-ink/70">Update the images shown on the home page and other overview sections.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImagePicker 
              label="Home Slider 1 (Hero)" 
              previewUrl={formData.heroImage1} 
              inputRef={refs.heroImage1} 
              onFileSelect={(file) => handleFileSelect("heroImage1", file)} 
            />
            {uploadingField === "heroImage1" && <p className="text-xs text-olive mt-1 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...</p>}
          </div>
          <div>
            <ImagePicker 
              label="Home Slider 2" 
              previewUrl={formData.heroImage2} 
              inputRef={refs.heroImage2} 
              onFileSelect={(file) => handleFileSelect("heroImage2", file)} 
            />
            {uploadingField === "heroImage2" && <p className="text-xs text-olive mt-1 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...</p>}
          </div>
          <div>
            <ImagePicker 
              label="Home Slider 3" 
              previewUrl={formData.heroImage3} 
              inputRef={refs.heroImage3} 
              onFileSelect={(file) => handleFileSelect("heroImage3", file)} 
            />
            {uploadingField === "heroImage3" && <p className="text-xs text-olive mt-1 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...</p>}
          </div>
          <div>
            <ImagePicker 
              label="Home Slider 4" 
              previewUrl={formData.heroImage4} 
              inputRef={refs.heroImage4} 
              onFileSelect={(file) => handleFileSelect("heroImage4", file)} 
            />
            {uploadingField === "heroImage4" && <p className="text-xs text-olive mt-1 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...</p>}
          </div>
          <div>
            <ImagePicker 
              label="Our Philosophy / About Image" 
              previewUrl={formData.aboutImage} 
              inputRef={refs.aboutImage} 
              onFileSelect={(file) => handleFileSelect("aboutImage", file)} 
            />
            {uploadingField === "aboutImage" && <p className="text-xs text-olive mt-1 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...</p>}
          </div>
          <div>
            <ImagePicker 
              label="Book Now Banner Image" 
              previewUrl={formData.ctaImage} 
              inputRef={refs.ctaImage} 
              onFileSelect={(file) => handleFileSelect("ctaImage", file)} 
            />
            {uploadingField === "ctaImage" && <p className="text-xs text-olive mt-1 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...</p>}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-mist/50 flex items-center justify-end">
        {saved && <span className="text-sm text-green-600 mr-4 flex items-center"><Check className="w-4 h-4 mr-1" /> Saved Successfully</span>}
        <button type="submit" disabled={loading || uploadingField !== null} className="px-6 py-2.5 bg-olive text-cream rounded-xl text-sm font-medium hover:bg-gold transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
