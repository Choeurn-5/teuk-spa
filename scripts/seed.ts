import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Initialize Firebase Admin
if (getApps().length === 0) {
  const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountStr) {
    console.error("Missing FIREBASE_SERVICE_ACCOUNT in .env.local");
    process.exit(1);
  }

  // If testing with emulators locally
  if (process.env.NODE_ENV === "development" || process.env.USE_EMULATOR === "true") {
    process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
  }

  initializeApp({
    credential: cert(JSON.parse(serviceAccountStr)),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "teukmassageandspa",
  });
}

const db = getFirestore();

async function seed() {
  console.log("Starting Teuk Spa database seed...");

  // 1. Site Settings
  const siteSettingsRef = db.collection("siteSettings").doc("main");
  const siteSettingsDoc = await siteSettingsRef.get();
  if (!siteSettingsDoc.exists) {
    console.log("Seeding siteSettings/main...");
    await siteSettingsRef.set({
      businessName: "Teuk Massage & Spa",
      phone: "017 70 83 54 59",
      email: "teukspa@gmail.com",
      address: "Pakambor St, Monul I, Sangkat Svaydangkum, Siem Reap",
      mapUrl: "PLACEHOLDER_GOOGLE_MAPS_LINK",
      hoursDisplay: "Monday – Sunday, 10:00 AM – 10:00 PM",
      social: {
        facebook: "PLACEHOLDER",
        instagram: "PLACEHOLDER",
        tiktok: "PLACEHOLDER",
        telegram: "PLACEHOLDER"
      },
      announcement: {
        enabled: false,
        text: "Welcome to Teuk Massage & Spa"
      },
      seo: {
        title: "Teuk Massage & Spa | Siem Reap",
        description: "Relax. Restore. Renew. Natural, traditional treatments in Siem Reap.",
        shareImageUrl: ""
      },
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "system_seed"
    });
  }

  // 2. Booking Rules (Public & Internal)
  const publicRulesRef = db.collection("bookingRules").doc("public");
  if (!(await publicRulesRef.get()).exists) {
    console.log("Seeding bookingRules/public...");
    await publicRulesRef.set({
      timezone: "Asia/Phnom_Penh",
      weeklyHours: {
        mon: { open: "10:00", close: "22:00", closed: false },
        tue: { open: "10:00", close: "22:00", closed: false },
        wed: { open: "10:00", close: "22:00", closed: false },
        thu: { open: "10:00", close: "22:00", closed: false },
        fri: { open: "10:00", close: "22:00", closed: false },
        sat: { open: "10:00", close: "22:00", closed: false },
        sun: { open: "10:00", close: "22:00", closed: false }
      },
      rooms: [
        { id: "room1", name: "Room 1 (Single)", type: "single", active: true },
        { id: "room2", name: "Room 2 (Single)", type: "single", active: true },
        { id: "room3", name: "Room 3 (Couple)", type: "couple", active: true }
      ],
      therapistsOnDuty: 3,
      slotIntervalMinutes: 30,
      bufferMinutes: 15,
      minNoticeMinutes: 120,
      maxDaysAhead: 60,
      maxOnlineGuests: 4,
      cancellationCutoffMinutes: 120,
      lateHoldMinutes: 15,
      policyText: "Booking requests are confirmed by our team, usually within 30 minutes. Please book at least 2 hours ahead. You can cancel or change your booking free of charge up to 2 hours before your appointment. If you are running late, we will hold your room for 15 minutes. Repeated no-shows may affect future bookings. No deposit is needed. You pay at the spa."
    });
  }

  const internalRulesRef = db.collection("bookingRules").doc("internal");
  if (!(await internalRulesRef.get()).exists) {
    console.log("Seeding bookingRules/internal...");
    await internalRulesRef.set({
      alertFirstReminderMinutes: 15,
      alertEscalateMinutes: 30,
      alertUrgentBeforeStartMinutes: 60,
      maxOpenRequestsPerPhone: 2,
      noShowWarnThreshold: 2,
      reconfirmGroupSize: 3
    });
  }

  // 3. Treatments
  const treatmentsRef = db.collection("treatments");
  const existingTreatments = await treatmentsRef.limit(1).get();
  if (existingTreatments.empty) {
    console.log("Seeding treatments...");
    const treatments = [
      {
        slug: "aromatherapy",
        name: "Aromatherapy Massage",
        shortDescription: "Gentle pressure with natural essential oils to restore balance and calm the mind.",
        description: "Aromatherapy utilizes light to medium pressure combined with pure, natural essential oils. The soothing strokes enhance circulation, relieve stress, and leave you feeling completely renewed.",
        benefits: ["Relieves stress and anxiety", "Improves circulation", "Promotes deep relaxation"],
        durationOptions: [{ minutes: 60, price: 30 }, { minutes: 90, price: 40 }],
        currency: "USD",
        category: "massage",
        imageUrl: "", // PLACEHOLDER
        order: 1,
        active: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      },
      {
        slug: "herbal-compress",
        name: "Herbal Hot Compress",
        shortDescription: "Traditional warm herbal bundles pressed along the body to relieve deep muscle tension.",
        description: "A blend of traditional Cambodian healing herbs is wrapped in cotton and steamed. The warm compress is firmly pressed along the body's energy lines, relieving deep aches and promoting circulation.",
        benefits: ["Relieves muscle stiffness", "Stimulates circulation", "Soothes joint pain"],
        durationOptions: [{ minutes: 30, price: 20 }, { minutes: 60, price: 35 }],
        currency: "USD",
        category: "herbal",
        imageUrl: "", // PLACEHOLDER
        order: 2,
        active: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      },
      {
        slug: "facial-treatment",
        name: "Natural Facial Treatment",
        shortDescription: "A rejuvenating facial using natural ingredients to cleanse, exfoliate, and hydrate.",
        description: "Restore your skin's natural glow. We use local organic ingredients like honey, cucumber, and natural clays to gently cleanse, exfoliate, and deeply moisturize your face.",
        benefits: ["Hydrates and brightens skin", "Clears impurities", "Deeply relaxing"],
        durationOptions: [{ minutes: 40, price: 25 }, { minutes: 60, price: 35 }],
        currency: "USD",
        category: "facial",
        imageUrl: "", // PLACEHOLDER
        order: 3,
        active: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      }
    ];

    for (const t of treatments) {
      await treatmentsRef.add(t);
    }
  }

  // 4. Packages
  const packagesRef = db.collection("packages");
  const existingPackages = await packagesRef.limit(1).get();
  if (existingPackages.empty) {
    console.log("Seeding packages...");
    await packagesRef.add({
      slug: "signature-package",
      name: "Signature Spa Package",
      description: "Our ultimate journey of relaxation. Combines three of our most beloved treatments into one seamless, restorative experience.",
      items: [
        { name: "Aromatherapy Massage", minutes: 60 },
        { name: "Herbal Hot Compress", minutes: 30 },
        { name: "Facial Treatment", minutes: 40 }
      ],
      totalMinutes: 130,
      price: 65, // PLACEHOLDER
      currency: "USD",
      popular: true,
      imageUrl: "", // PLACEHOLDER
      order: 1,
      active: true
    });
  }

  // 5. Voucher Settings
  const voucherSettingsRef = db.collection("voucherSettings").doc("main");
  if (!(await voucherSettingsRef.get()).exists) {
    console.log("Seeding voucherSettings/main...");
    await voucherSettingsRef.set({
      enabled: true,
      validityMonths: 6,
      products: [
        { id: "v-sig", label: "Signature Package", type: "package", packageId: "signature-package", active: true, order: 1 },
        { id: "v-25", label: "$25 Voucher", type: "amount", value: 25, currency: "USD", active: true, order: 2 },
        { id: "v-50", label: "$50 Voucher", type: "amount", value: 50, currency: "USD", active: true, order: 3 },
        { id: "v-100", label: "$100 Voucher", type: "amount", value: 100, currency: "USD", active: true, order: 4 }
      ],
      allowPartialRedemption: true,
      allowCustomAmount: false,
      termsText: "Vouchers have no cash value and are not refundable. Advance booking is required. Vouchers are transferable to another person. Unless otherwise permitted, only one voucher may be used per booking. Lost vouchers can be reissued with proof of purchase.",
      printedPrefix: "P-",
      nextSerial: 1
    });
  }

  console.log("Seed completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
