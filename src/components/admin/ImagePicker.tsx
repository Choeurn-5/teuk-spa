import Image from "next/image";
import { UploadCloud } from "lucide-react";

export function ImagePicker({
  previewUrl,
  onFileSelect,
  inputRef,
  label = "Upload Image",
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
