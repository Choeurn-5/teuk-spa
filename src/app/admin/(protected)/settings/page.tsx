import { adminDb } from "@/lib/firebase/admin";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const doc = await adminDb.collection("siteSettings").doc("main").get();
  const raw = doc.exists ? doc.data()! : {};

  // Explicitly serialize to a plain object — strip all Firestore Timestamps
  const settings = {
    businessName: raw.businessName || "",
    phone: raw.phone || "",
    email: raw.email || "",
    address: raw.address || "",
    hoursDisplay: raw.hoursDisplay || "",
    mapUrl: raw.mapUrl || "",
    announcement: raw.announcement || "",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-olive">Store Settings</h1>
        <p className="mt-2 text-sm text-ink/70">Update your public contact info, hours, and homepage text.</p>
      </div>

      <div className="bg-warm shadow-sm rounded-2xl border border-mist p-6 md:p-8">
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
