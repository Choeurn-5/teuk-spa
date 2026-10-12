import { adminDb } from "@/lib/firebase/admin";
import { VoucherListClient } from "./VoucherListClient";

export const dynamic = "force-dynamic";

export default async function AdminVouchersPage() {
  const snapshot = await adminDb
    .collection("vouchers")
    .orderBy("createdAt", "desc")
    .get();

  const vouchers = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      amount: Number(data.amount) || 0,
      createdAt: data.createdAt?.toDate().toISOString(),
      expiryDate: data.expiryDate?.toDate().toISOString() || null,
      redeemedAt: data.redeemedAt?.toDate().toISOString() || null,
    };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[#141612]">Gift Certificates & Vouchers</h1>
        <p className="mt-1 text-sm text-stone-600 font-jost">
          Monitor digital certificate requests, verify ABA / cash payments, issue vouchers, and validate redemptions.
        </p>
      </div>

      <VoucherListClient initialVouchers={vouchers as any} />
    </div>
  );
}
