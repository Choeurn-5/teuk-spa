import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("__session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch recent bookings (ordered by createdAt desc, limit 10)
    const bookingsSnap = await adminDb
      .collection("bookings")
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const bookings = bookingsSnap.docs.map((doc) => {
      const data = doc.data();
      const rawCreatedAt = data.createdAt;
      let createdIso = new Date().toISOString();
      let createdMillis = Date.now();

      if (rawCreatedAt && typeof rawCreatedAt.toDate === "function") {
        const dateObj = rawCreatedAt.toDate();
        createdIso = dateObj.toISOString();
        createdMillis = dateObj.getTime();
      } else if (rawCreatedAt && typeof rawCreatedAt.toMillis === "function") {
        createdMillis = rawCreatedAt.toMillis();
        createdIso = new Date(createdMillis).toISOString();
      } else if (typeof rawCreatedAt === "string") {
        createdIso = rawCreatedAt;
        createdMillis = new Date(rawCreatedAt).getTime();
      }

      return {
        id: doc.id,
        reference: data.reference || `TS-${doc.id.slice(0, 4).toUpperCase()}`,
        status: data.status || "new",
        source: data.source || "web",
        serviceName: data.serviceName || "Spa Treatment",
        guestName: data.guest?.name || "Guest",
        phone: data.guest?.phone || "",
        email: data.guest?.email || null,
        hotel: data.guest?.hotel || null,
        date: data.date || "",
        time: data.time || "",
        guests: Number(data.guests || 1),
        price: Number(data.price || 0),
        durationMinutes: Number(data.durationMinutes || 60),
        createdAt: createdIso,
        createdMillis,
      };
    });

    // 2. Count active new bookings that require attention
    const unreviewedSnap = await adminDb
      .collection("bookings")
      .where("status", "==", "new")
      .get();

    return NextResponse.json(
      {
        success: true,
        bookings,
        unreviewedCount: unreviewedSnap.size,
        serverTime: Date.now(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("Failed to fetch latest bookings for admin alerts:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
