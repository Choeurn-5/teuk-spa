import { adminDb } from "../firebase/admin";
import { unstable_cache } from "next/cache";

// Helper: strip all Firestore Timestamps from a document so it can safely
// be passed from any Server Component to a Client Component.
function serialize(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data.toDate === "function") return data.toDate().toISOString();
  if (Array.isArray(data)) return data.map(serialize);
  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, serialize(v)])
    );
  }
  return data;
}

// Site Settings
export const getSiteSettings = unstable_cache(
  async () => {
    const doc = await adminDb.collection("siteSettings").doc("main").get();
    return doc.exists ? serialize(doc.data()) : null;
  },
  ["siteSettings"],
  { tags: ["siteSettings"] }
);

// Page Content (Home, About, Contact)
export const getPageContent = unstable_cache(
  async (pageId: string) => {
    const doc = await adminDb.collection("pages").doc(pageId).get();
    return doc.exists ? serialize(doc.data()) : null;
  },
  ["pages"],
  { tags: ["pages"] }
);

// Active Treatments
export const getTreatments = unstable_cache(
  async () => {
    const snapshot = await adminDb.collection("treatments").where("active", "==", true).get();
    const data = snapshot.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
    return data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },
  ["treatments"],
  { tags: ["treatments"] }
);

// Active Packages
export const getPackages = unstable_cache(
  async () => {
    const snapshot = await adminDb.collection("packages").where("active", "==", true).get();
    const data = snapshot.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
    return data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },
  ["packages"],
  { tags: ["packages"] }
);

// Gallery Photos
export const getGallery = unstable_cache(
  async () => {
    const snapshot = await adminDb.collection("gallery").where("active", "==", true).get();
    const data = snapshot.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
    return data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },
  ["gallery"],
  { tags: ["gallery"] }
);

// Visible Reviews
export const getReviews = unstable_cache(
  async () => {
    const snapshot = await adminDb.collection("reviews").where("visible", "==", true).get();
    const data = snapshot.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
    return data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },
  ["reviews"],
  { tags: ["reviews"] }
);

// Visible FAQs
export const getFaqs = unstable_cache(
  async () => {
    const snapshot = await adminDb.collection("faqs").where("visible", "==", true).get();
    const data = snapshot.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
    return data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },
  ["faqs"],
  { tags: ["faqs"] }
);
