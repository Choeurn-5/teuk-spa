import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { adminDb } from "../src/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

async function main() {
  const images = [
    { url: "/images/gallery/photo_2026-10-07_11-58-36.jpg", caption: "Teuk Spa Exterior" },
    { url: "/images/gallery/photo_2026-10-07_11-58-38.jpg", caption: "Relaxation Lounge" },
    { url: "/images/gallery/photo_2026-10-07_11-58-40.jpg", caption: "Treatment Room" },
    { url: "/images/gallery/photo_2026-10-07_11-58-43.jpg", caption: "Spa Details" }
  ];

  let order = 0;
  for (const img of images) {
    await adminDb.collection("gallery").add({
      imageUrl: img.url,
      caption: img.caption,
      active: true,
      order: order++,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log("Added", img.url);
  }
  
  console.log("Done");
}

main().catch(console.error);
