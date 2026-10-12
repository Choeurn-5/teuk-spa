import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { adminDb } from "../src/lib/firebase/admin";

async function main() {
  const urls = [
    "/images/gallery/photo_2026-10-07_11-58-36.jpg",
    "/images/gallery/photo_2026-10-07_11-58-38.jpg",
    "/images/gallery/photo_2026-10-07_11-58-40.jpg",
    "/images/gallery/photo_2026-10-07_11-58-43.jpg"
  ];
  
  const snap = await adminDb.collection("gallery").get();
  for (const doc of snap.docs) {
    if (urls.includes(doc.data().imageUrl)) {
      await doc.ref.delete();
      console.log("Deleted", doc.data().imageUrl);
    }
  }
  console.log("Done");
}

main().catch(console.error);
