import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function syncMenu() {
  const { adminDb } = await import('../src/lib/firebase/admin');
  const { FieldValue } = await import('firebase-admin/firestore');

  console.log("=== SYNCING TEUK SPA MENU FROM REFERENCE BOOKLET ===");

  // 1. Definite treatments list directly from Reference Photos 1, 2, 3, 4
  const referenceTreatments = [
    {
      name: "Aromatherapy Massage",
      khmerName: "ម៉ាស្សាប្រេងធម្មតា",
      category: "Body Therapy",
      shortDescription: "Full body massage with oil, gentle massage using thumb and palm for relaxing and relieving tension.",
      durationOptions: [
        { minutes: 60, price: 25 },
        { minutes: 90, price: 35 },
        { minutes: 120, price: 45 },
      ],
    },
    {
      name: "Swedish Massage",
      khmerName: "ម៉ាស្សាប្រេងធ្ងន់",
      category: "Body Therapy",
      shortDescription: "Full body massage with oil, for pressure ranging from medium to strong.",
      durationOptions: [
        { minutes: 60, price: 25 },
        { minutes: 90, price: 35 },
        { minutes: 120, price: 45 },
      ],
    },
    {
      name: "Khmer Traditional Massage",
      khmerName: "ម៉ាស្សាខ្មែរ",
      category: "Body Therapy",
      shortDescription: "Full body massage without oil, using thumb and palm acupressure combined with stretching and bending.",
      durationOptions: [
        { minutes: 60, price: 20 },
        { minutes: 90, price: 28 },
        { minutes: 120, price: 38 },
      ],
    },
    {
      name: "Back Head and Shoulder",
      khmerName: "ម៉ាស្សាពាក់កណ្ដាលខ្លួន",
      category: "Body Therapy",
      shortDescription: "Focused massage with oil and warm herbal compress applied on target areas for deep muscle relaxation.",
      durationOptions: [
        { minutes: 60, price: 25 },
        { minutes: 90, price: 35 },
        { minutes: 120, price: 45 },
      ],
    },
    {
      name: "Foot Reflexology",
      khmerName: "ម៉ាស្សាបាតជើង",
      category: "Body Therapy",
      shortDescription: "Therapeutic massage targeting reflex points on feet and calves linked to bodily organs to release fatigue.",
      durationOptions: [
        { minutes: 60, price: 18 },
        { minutes: 90, price: 25 },
        { minutes: 120, price: 35 },
      ],
    },
    {
      name: "Four Hand Massage",
      khmerName: "ម៉ាស្សាប្រេងជាមួយបុគ្គលិកពីរនាក់",
      category: "Body Therapy",
      shortDescription: "Signature spa ritual where two trained therapists synchronize rhythmic movements with essential oils.",
      durationOptions: [
        { minutes: 60, price: 45 },
      ],
    },
    {
      name: "Khmer Herbal Compress",
      khmerName: "ម៉ាស្សាប្រេងជាមួយគ្រឿងពន្លៃស្អំក្តៅ",
      category: "Body Therapy",
      shortDescription: "Full body massage with botanical oil and warm steamed herbal parcels (Plei) to melt muscle soreness.",
      durationOptions: [
        { minutes: 90, price: 45 },
      ],
    },
    {
      name: "Hot Stone Massage",
      khmerName: "ម៉ាស្សាប្រេងជាមួយថ្មក្តៅ",
      category: "Body Therapy",
      shortDescription: "Deeply soothing therapy combining warm basalt stones with massage to release tension and boost circulation.",
      durationOptions: [
        { minutes: 90, price: 45 },
      ],
    },
    {
      name: "Express Facial",
      khmerName: "គ្រឿងធម្មជាតិ",
      category: "Facial Treatment",
      shortDescription: "Refreshing and rejuvenating facial using pure natural ingredients to cleanse, exfoliate, and hydrate.",
      durationOptions: [
        { minutes: 60, price: 25 },
      ],
    },
    {
      name: "Moisturizing Facial",
      khmerName: "ផលិតផលកូរ៉េ",
      category: "Facial Treatment",
      shortDescription: "Intensely hydrating facial treatment featuring premium Korean skincare for a plump, radiant, dewy finish.",
      durationOptions: [
        { minutes: 60, price: 25 },
      ],
    },
    {
      name: "Fruit Scrub",
      khmerName: "គ្រឿងផ្សំផ្លែឈើ",
      category: "Body Scrub",
      shortDescription: "Natural botanical fruit scrub that gently removes dead skin cells, leaving the body silky smooth and radiant.",
      durationOptions: [
        { minutes: 60, price: 25 },
      ],
    },
    {
      name: "Khmer Herbal Salt Scrub",
      khmerName: "គ្រឿងខ្មែរស្លាប់ស្បែក",
      category: "Body Scrub",
      shortDescription: "Traditional Khmer herbal mineral salt scrub for invigorating exfoliation, purification, and skin toning.",
      durationOptions: [
        { minutes: 60, price: 45 },
      ],
    },
    {
      name: "Khmer Herbal Wrap",
      khmerName: "គ្រឿងខ្មែរអប់ស្បែក",
      category: "Body Wrap",
      shortDescription: "Cocooning traditional Khmer herbal body wrap to detoxify, soothe tired muscles, and revitalize the skin.",
      durationOptions: [
        { minutes: 60, price: 45 },
      ],
    },
    {
      name: "Fruit Milk Wrap",
      khmerName: "គ្រឿងផ្សំផ្លែឈើ",
      category: "Body Wrap",
      shortDescription: "Nutrient-rich fresh fruit and milk body wrap designed to intensely hydrate, soften, and nourish the body.",
      durationOptions: [
        { minutes: 60, price: 45 },
      ],
    },
    {
      name: "Express Manicure",
      khmerName: "កាត់ក្រចកដៃ និងលាបពណ៌",
      category: "Natural Nail Care & Salon",
      shortDescription: "Quick natural nail care for hands including shaping, cuticle care, light massage, and regular polish.",
      durationOptions: [
        { minutes: 30, price: 12 },
      ],
    },
    {
      name: "Express Pedicure",
      khmerName: "កាត់ក្រចកជើង និង លាបពណ៌",
      category: "Natural Nail Care & Salon",
      shortDescription: "Refreshing foot soak, nail shaping, cuticle cleanup, light foot care, and regular polish.",
      durationOptions: [
        { minutes: 30, price: 10 },
      ],
    },
    {
      name: "Shampoo & Blow Dry",
      khmerName: "កក់សក់ និង ផ្លុំសក់",
      category: "Natural Nail Care & Salon",
      shortDescription: "Relaxing hair wash with gentle scalp massage followed by professional blow dry and styling.",
      durationOptions: [
        { minutes: 30, price: 10 },
      ],
    },
    {
      name: "Gel Nail Polish",
      khmerName: "ធ្វើក្រចក និងលាបជែល",
      category: "Natural Nail Care & Salon",
      shortDescription: "Long-lasting chip-resistant gel polish application with precision nail preparation and UV/LED curing.",
      durationOptions: [
        { minutes: 60, price: 25 },
      ],
    },
    {
      name: "Steam & Sauna",
      khmerName: "ឆ្លុះ និង ត្រាំទឹក",
      category: "Wellness & Hydrotherapy",
      shortDescription: "Purifying herbal steam bath and sauna session to open pores, sweat out toxins, and relax the nervous system.",
      durationOptions: [
        { minutes: 60, price: 15 },
      ],
    },
    {
      name: "Waxing",
      khmerName: "បករោម",
      category: "Wellness & Beauty",
      shortDescription: "Gentle professional waxing services for clean, smooth, hair-free skin across selected areas.",
      durationOptions: [
        { minutes: 30, price: 8 },
        { minutes: 60, price: 15 },
        { minutes: 90, price: 18 },
        { minutes: 120, price: 35 },
      ],
    },
  ];

  // 2. Definite Packages list directly from Reference Photo 4 (Bottom)
  const referencePackages = [
    {
      name: "Relaxing Package",
      khmerName: "បំបាត់ភាពតានតឹង",
      description: "Aromatherapy 75mins, Khmer Herbal Wrap 45mins",
      totalMinutes: 120,
      price: 50,
      includes: ["75 min Aromatherapy Massage (ម៉ាស្សាប្រេង)", "45 min Khmer Herbal Wrap (អប់ស្បែក)"],
    },
    {
      name: "Treasure Of Khmer Package",
      khmerName: "តានតឹងសាច់ដុំ",
      description: "Khmer Herbal Hot Compress 90mins, Express Facial 60mins",
      totalMinutes: 150,
      price: 55,
      includes: ["90 min Khmer Herbal Hot Compress (គ្រឿងខ្មែរ)", "60 min Express Facial (គ្រឿងធម្មជាតិ)"],
    },
    {
      name: "Special Package",
      khmerName: "កញ្ចប់ពិសេស",
      description: "Khmer Herbal Hot Compress 90mins, Khmer Herbal Scrub 45mins",
      totalMinutes: 180,
      price: 68,
      includes: ["90 min Khmer Herbal Hot Compress (គ្រឿងខ្មែរ)", "45 min Khmer Herbal Salt Scrub (ស្ក្រាប់ខ្លួនពន្លៃខ្មែរ)"],
    },
  ];

  // 3. Process existing treatments
  const tSnap = await adminDb.collection("treatments").get();
  console.log(`Found ${tSnap.size} treatments currently in DB.`);

  // Stale/old mock treatments to remove:
  // - "Natural Facial Treatment" (was a mock item)
  // - "Herbal Hot Compress" (old mock duplicate of 30m/60m)
  // - Duplicate "Aromatherapy Massage" with price 30/40
  const staleTreatmentNames = ["Natural Facial Treatment", "Herbal Hot Compress"];
  for (const doc of tSnap.docs) {
    const data = doc.data();
    const name = data.name || "";
    const isOldMock = staleTreatmentNames.includes(name);
    const isOldDuplicateAroma = name === "Aromatherapy Massage" && Array.isArray(data.durationOptions) && data.durationOptions.some((o: any) => o.price === 30);
    
    if (isOldMock || isOldDuplicateAroma) {
      console.log(`🗑️ Deleting stale/duplicate treatment: "${name}" (${doc.id})`);
      await doc.ref.delete();
    }
  }

  // Now upsert each reference treatment
  let order = 0;
  for (const rt of referenceTreatments) {
    // Check if one with matching name already exists
    const existing = tSnap.docs.find(d => {
      const data = d.data();
      const n = (data.name || "").toLowerCase().trim();
      return n === rt.name.toLowerCase().trim() || (rt.name.toLowerCase().includes("hot stone") && n.includes("hot stone"));
    });

    if (existing && !staleTreatmentNames.includes(existing.data().name)) {
      console.log(`✏️ Updating treatment: "${rt.name}" (${existing.id})`);
      await existing.ref.update({
        name: rt.name,
        khmerName: rt.khmerName,
        category: rt.category,
        shortDescription: rt.shortDescription,
        durationOptions: rt.durationOptions,
        active: true,
        order: order++,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      console.log(`➕ Creating treatment: "${rt.name}"`);
      await adminDb.collection("treatments").add({
        name: rt.name,
        khmerName: rt.khmerName,
        category: rt.category,
        shortDescription: rt.shortDescription,
        durationOptions: rt.durationOptions,
        imageUrl: "",
        active: true,
        order: order++,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }

  // 4. Process existing packages
  const pSnap = await adminDb.collection("packages").get();
  console.log(`Found ${pSnap.size} packages currently in DB.`);

  // Stale mock packages to remove: "Quick Refresh", "Face & Relax", "Couples Retreat"
  const stalePackageNames = ["Quick Refresh", "Face & Relax", "Couples Retreat"];
  for (const doc of pSnap.docs) {
    const data = doc.data();
    const name = data.name || "";
    if (stalePackageNames.includes(name)) {
      console.log(`🗑️ Deleting stale mock package: "${name}" (${doc.id})`);
      await doc.ref.delete();
    }
  }

  // Now upsert the 3 authentic reference packages
  let pkgOrder = 0;
  for (const rp of referencePackages) {
    const existing = pSnap.docs.find(d => (d.data().name || "").toLowerCase().trim() === rp.name.toLowerCase().trim());

    if (existing) {
      console.log(`✏️ Updating package: "${rp.name}" (${existing.id})`);
      await existing.ref.update({
        name: rp.name,
        khmerName: rp.khmerName,
        description: rp.description,
        totalMinutes: rp.totalMinutes,
        price: rp.price,
        currency: "USD",
        includes: rp.includes,
        active: true,
        order: pkgOrder++,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      console.log(`➕ Creating package: "${rp.name}"`);
      await adminDb.collection("packages").add({
        name: rp.name,
        khmerName: rp.khmerName,
        description: rp.description,
        totalMinutes: rp.totalMinutes,
        price: rp.price,
        currency: "USD",
        includes: rp.includes,
        imageUrl: "",
        active: true,
        order: pkgOrder++,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }

  // 5. Update siteSettings with exact opening hours from Photo 5
  console.log("Updating siteSettings opening hours & address from Photo 5...");
  await adminDb.collection("siteSettings").doc("main").set({
    hoursDisplay: "Daily: 9:00 AM – 12:00 AM (Last booking: 11:00 PM)",
    address: "Pakambor St, Mondul 1, Svaydangkum, Siem Reap, Cambodia",
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log("=== SUCCESS: MENU SYNCHRONIZED PERFECTLY ===");
  process.exit(0);
}

syncMenu().catch(err => {
  console.error("Sync error:", err);
  process.exit(1);
});
