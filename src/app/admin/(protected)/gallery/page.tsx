import { adminDb } from "@/lib/firebase/admin";
import { GalleryManagerClient } from "./GalleryManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const snapshot = await adminDb.collection("gallery").orderBy("order", "asc").get();
  const photos = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      imageUrl: data.imageUrl || "",
      caption: data.caption || "",
      active: data.active ?? true,
      order: data.order || 0,
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-olive">Gallery Manager</h1>
        <p className="mt-2 text-sm text-ink/70">
          Upload your spa photos. Images are stored in the project&apos;s <code className="bg-mist px-1 rounded">/public/uploads/</code> folder.
        </p>
      </div>
      <GalleryManagerClient initialPhotos={photos} />
    </div>
  );
}
