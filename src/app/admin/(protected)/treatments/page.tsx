import { adminDb } from "@/lib/firebase/admin";
import { TreatmentsManagerClient } from "./TreatmentsManagerClient";

export const dynamic = "force-dynamic";

async function getAdminTreatments() {
  const snapshot = await adminDb.collection("treatments").orderBy("order", "asc").get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "",
      shortDescription: data.shortDescription || "",
      active: data.active ?? true,
      order: data.order || 0,
      imageUrl: data.imageUrl || "",
      durationOptions: (data.durationOptions || []).map((opt: any) => ({
        minutes: opt.minutes || 60,
        price: opt.price || 0,
      })),
    };
  });
}

export default async function AdminTreatmentsPage() {
  const treatments = await getAdminTreatments();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-olive">Treatments Menu</h1>
        <p className="mt-2 text-sm text-ink/70">Add, edit, or remove treatments from your public menu.</p>
      </div>
      <TreatmentsManagerClient initialTreatments={treatments} />
    </div>
  );
}
