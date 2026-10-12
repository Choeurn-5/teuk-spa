"use client";

import { useState, useRef } from "react";
import { addGalleryPhoto, deleteGalleryPhoto } from "@/lib/admin/actions";
import { UploadCloud, Trash2, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

export function GalleryManagerClient({ initialPhotos }: { initialPhotos: any[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      // 1. Upload file to /api/upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const { url, error } = await uploadRes.json();

      if (!url) {
        alert(error || "Upload failed.");
        setUploading(false);
        return;
      }

      // 2. Save the URL + caption to Firestore
      const res = await addGalleryPhoto(url, caption);
      if (res.success) {
        const newPhoto = { id: Date.now().toString(), imageUrl: url, caption, active: true, order: photos.length };
        setPhotos(prev => [...prev, newPhoto]);
        setPreviewUrl(null);
        setSelectedFile(null);
        setCaption("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      alert("Something went wrong during upload.");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo from the gallery?")) return;
    const res = await deleteGalleryPhoto(id);
    if (res.success) {
      setPhotos(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div className="bg-warm border border-mist rounded-2xl p-6">
        <h3 className="font-medium text-olive mb-4">Upload New Photo</h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full md:w-48 h-48 border-2 border-dashed border-mist rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-olive hover:bg-mist/30 transition-all shrink-0 overflow-hidden relative"
          >
            {previewUrl ? (
              <Image src={previewUrl} alt="Preview" fill className="object-cover" />
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-sage mb-2" />
                <p className="text-sm text-ink/60 text-center px-2">Click to select image</p>
                <p className="text-xs text-ink/40 mt-1">JPEG, PNG, WebP • Max 5MB</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Caption + Upload */}
          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1">Caption (optional)</label>
              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="e.g. Our signature hot stone massage room"
                className="w-full px-4 py-2 bg-white border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive"
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex items-center px-6 py-2.5 bg-olive text-cream rounded-xl text-sm font-medium hover:bg-gold transition-colors disabled:opacity-50"
            >
              {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : <><UploadCloud className="w-4 h-4 mr-2" /> Upload Photo</>}
            </button>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-mist rounded-2xl">
          <ImageIcon className="w-12 h-12 text-mist mx-auto mb-3" />
          <p className="text-ink/60 font-light">No photos yet. Upload your first one above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="aspect-square rounded-xl relative overflow-hidden group bg-mist border border-mist/50">
              {photo.imageUrl && (
                <Image src={photo.imageUrl} alt={photo.caption || "Gallery"} fill className="object-cover" />
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
                {photo.caption && <p className="text-white text-xs text-center line-clamp-2">{photo.caption}</p>}
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="flex items-center px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
