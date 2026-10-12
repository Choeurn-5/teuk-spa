import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { adminDb } from "../src/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

async function main() {
  const treatments = [
    {
      name: "Aromatherapy Massage",
      shortDescription: "Full body massage with oil, gentle massage that we use thumb and palm for relaxing and relieve tension.",
      durationOptions: [{ minutes: 60, price: 25 }, { minutes: 90, price: 35 }, { minutes: 120, price: 45 }]
    },
    {
      name: "Swedish Massage",
      shortDescription: "Full body massage with oil, for the pressure from medium to strong massage.",
      durationOptions: [{ minutes: 60, price: 25 }, { minutes: 90, price: 35 }, { minutes: 120, price: 45 }]
    },
    {
      name: "Khmer Traditional Massage",
      shortDescription: "Full body massage without oil, using thumb and palm to make pressure point and combination of stretching, bending.",
      durationOptions: [{ minutes: 60, price: 20 }, { minutes: 90, price: 28 }, { minutes: 120, price: 38 }]
    },
    {
      name: "Back Head and Shoulder",
      shortDescription: "Full body massage with oil and using the hot compress to apply on the body for muscle relax.",
      durationOptions: [{ minutes: 60, price: 25 }, { minutes: 90, price: 35 }, { minutes: 120, price: 45 }]
    },
    {
      name: "Foot Reflexology",
      shortDescription: "Reflexology uses pressure applied to reflex points related to body organs to relief tension.",
      durationOptions: [{ minutes: 60, price: 18 }, { minutes: 90, price: 25 }, { minutes: 120, price: 35 }]
    },
    {
      name: "Four Hand Massage",
      shortDescription: "It is one of our Spa Signatures massages. The technique goes smoothly and synchronizes with each other, the two therapists are trained well together.",
      durationOptions: [{ minutes: 60, price: 45 }]
    },
    {
      name: "Khmer Herbal Compress",
      shortDescription: "Full body massage with oil and using the hot compress to apply on the body for muscle relax.",
      durationOptions: [{ minutes: 90, price: 45 }]
    },
    {
      name: "Hot stone massage",
      shortDescription: "A deeply relaxing therapy that combines stones with gentle massage techniques. The warmth of the stones release tension faster, improves blood.",
      durationOptions: [{ minutes: 90, price: 45 }]
    },
    {
      name: "Express Facial",
      shortDescription: "A quick and refreshing facial treatment.",
      durationOptions: [{ minutes: 60, price: 25 }]
    },
    {
      name: "Moisturizing Facial",
      shortDescription: "Deeply moisturizing facial for hydrated and glowing skin.",
      durationOptions: [{ minutes: 60, price: 25 }]
    },
    {
      name: "Fruit Scrub",
      shortDescription: "Natural fruit body scrub.",
      durationOptions: [{ minutes: 60, price: 25 }]
    },
    {
      name: "Khmer Herbal Salt Scrub",
      shortDescription: "Traditional Khmer herbal salt scrub for body exfoliation.",
      durationOptions: [{ minutes: 60, price: 45 }]
    },
    {
      name: "Khmer Herbal Wrap",
      shortDescription: "Traditional Khmer herbal body wrap.",
      durationOptions: [{ minutes: 60, price: 45 }]
    },
    {
      name: "Fruit Milk Wrap",
      shortDescription: "Nourishing fruit milk body wrap.",
      durationOptions: [{ minutes: 60, price: 45 }]
    },
    {
      name: "Express Manicure",
      shortDescription: "Quick natural nail care for hands.",
      durationOptions: [{ minutes: 30, price: 12 }]
    },
    {
      name: "Express Pedicure",
      shortDescription: "Quick natural nail care for feet.",
      durationOptions: [{ minutes: 30, price: 10 }]
    },
    {
      name: "Shampoo Hair Dry",
      shortDescription: "Professional hair washing and drying.",
      durationOptions: [{ minutes: 30, price: 10 }]
    },
    {
      name: "Gel nail polish",
      shortDescription: "Long-lasting gel polish application.",
      durationOptions: [{ minutes: 60, price: 25 }]
    },
    {
      name: "Steam & Sauna",
      shortDescription: "Relaxing steam and sauna session.",
      durationOptions: [{ minutes: 60, price: 15 }]
    },
    {
      name: "Waxing",
      shortDescription: "Professional waxing services.",
      durationOptions: [{ minutes: 30, price: 8 }, { minutes: 60, price: 15 }, { minutes: 90, price: 18 }, { minutes: 120, price: 35 }]
    }
  ];

  const packages = [
    {
      name: "Relaxing Package",
      description: "Aromatherapy 75mins, Khmer Herbal Wrap 45mins",
      totalMinutes: 120,
      price: 50,
      includes: ["Aromatherapy Massage", "Khmer Herbal Wrap"]
    },
    {
      name: "Treasure Of Khmer Package",
      description: "Khmer Herbal Hot Compress 90mins, Express Facial 60mins",
      totalMinutes: 150,
      price: 55,
      includes: ["Khmer Herbal Compress", "Express Facial"]
    },
    {
      name: "Special Package",
      description: "Khmer Herbal Hot Compress 90mins, Khmer Herbal Scrub 45mins",
      totalMinutes: 180,
      price: 68,
      includes: ["Khmer Herbal Compress", "Khmer Herbal Salt Scrub"]
    }
  ];

  console.log("Adding treatments...");
  let order = 0;
  for (const t of treatments) {
    await adminDb.collection("treatments").add({
      ...t,
      imageUrl: "",
      active: true,
      order: order++,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`- ${t.name}`);
  }

  console.log("Adding packages...");
  order = 0;
  for (const p of packages) {
    await adminDb.collection("packages").add({
      ...p,
      currency: "USD",
      imageUrl: "",
      active: true,
      order: order++,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`- ${p.name}`);
  }
  
  console.log("Done");
}

main().catch(console.error);
