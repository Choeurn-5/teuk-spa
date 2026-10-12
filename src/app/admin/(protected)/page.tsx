export const dynamic = "force-dynamic";

import { adminDb } from "@/lib/firebase/admin";
import Link from "next/link";
import { ArrowRight, Ticket, CalendarDays } from "lucide-react";

export default async function AdminDashboard() {
  // Fetch a quick summary (e.g., today's bookings, pending vouchers)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Note: These are rough queries just for the dashboard overview.
  // In production, you'd want proper indexes for these exact fields.
  
  // Pending Vouchers
  const vouchersSnap = await adminDb
    .collection("vouchers")
    .where("status", "==", "pending_payment")
    .get();
  
  // New Bookings (requests)
  const bookingsSnap = await adminDb
    .collection("bookings")
    .where("status", "==", "new")
    .get();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-olive">Dashboard</h1>
        <p className="mt-2 text-sm text-ink/70">Welcome back. Here is what is happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bookings Card */}
        <div className="bg-warm rounded-2xl shadow-sm border border-mist p-6 flex flex-col">
          <div className="flex items-center mb-4 text-olive">
            <CalendarDays className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-medium">Booking Requests</h2>
          </div>
          <div className="flex-1">
            <p className="text-5xl font-light text-ink mb-2">
              {bookingsSnap.size}
            </p>
            <p className="text-sm text-ink/60 mb-6">Unconfirmed bookings waiting for review</p>
          </div>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center text-sm font-medium text-olive hover:text-gold transition-colors"
          >
            Review bookings <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* Vouchers Card */}
        <div className="bg-warm rounded-2xl shadow-sm border border-mist p-6 flex flex-col">
          <div className="flex items-center mb-4 text-olive">
            <Ticket className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-medium">Voucher Requests</h2>
          </div>
          <div className="flex-1">
            <p className="text-5xl font-light text-ink mb-2">
              {vouchersSnap.size}
            </p>
            <p className="text-sm text-ink/60 mb-6">Pending payments to be processed</p>
          </div>
          <Link
            href="/admin/vouchers"
            className="inline-flex items-center text-sm font-medium text-olive hover:text-gold transition-colors"
          >
            Manage vouchers <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-mist p-6">
        <h3 className="text-lg font-medium text-olive mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/admin/treatments" className="p-4 rounded-xl border border-mist hover:border-olive hover:bg-mist/50 transition-all text-center">
            <div className="text-sm font-medium text-ink">Edit Treatments</div>
          </Link>
          <Link href="/admin/settings" className="p-4 rounded-xl border border-mist hover:border-olive hover:bg-mist/50 transition-all text-center">
            <div className="text-sm font-medium text-ink">Store Settings</div>
          </Link>
          <Link href="/admin/gallery" className="p-4 rounded-xl border border-mist hover:border-olive hover:bg-mist/50 transition-all text-center">
            <div className="text-sm font-medium text-ink">Update Gallery</div>
          </Link>
          <Link href="/" target="_blank" className="p-4 rounded-xl border border-mist hover:border-olive hover:bg-mist/50 transition-all text-center">
            <div className="text-sm font-medium text-olive">View Live Site ↗</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
