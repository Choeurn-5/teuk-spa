import { adminDb } from "@/lib/firebase/admin";
import { BookingListClient } from "./BookingListClient";

// Disable caching for the admin booking list
export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  // Fetch recent bookings (up to 200 for management and pagination)
  const snapshot = await adminDb
    .collection("bookings")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  const bookings = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamps to strings so we can pass them to a Client Component
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-olive">Manage Bookings</h1>
        <p className="mt-2 text-sm text-ink/70">Review requests, confirm appointments, and manage your calendar.</p>
      </div>

      <BookingListClient initialBookings={bookings} />
    </div>
  );
}
