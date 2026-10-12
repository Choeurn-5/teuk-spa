import { adminDb } from "@/lib/firebase/admin";
import { PackagesManagerClient } from "./PackagesManagerClient";

export const dynamic = "force-dynamic";

async function getAdminPackages() {
  const snapshot = await adminDb.collection("packages").orderBy("order", "asc").get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "",
      description: data.description || "",
      totalMinutes: data.totalMinutes || 60,
      price: data.price || 0,
      currency: data.currency || "USD",
      active: data.active ?? true,
      order: data.order || 0,
      includes: data.includes || [],
      imageUrl: data.imageUrl || "",
    };
  });
}

export default async function AdminPackagesPage() {
  const packages = await getAdminPackages();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-olive">Spa Packages</h1>
        <p className="mt-2 text-sm text-ink/70">Create and manage multi-treatment spa packages with custom pricing.</p>
      </div>
      <PackagesManagerClient initialPackages={packages} />
    </div>
  );
}
