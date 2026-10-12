"use client";

import { useState, useMemo } from "react";
import { adminIssueVoucher, updateVoucherStatus, deleteVoucher } from "@/lib/vouchers/actions";
import { LuxuryVoucherCertificate } from "@/components/vouchers/LuxuryVoucherCertificate";
import {
  Ticket,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Copy,
  Printer,
  Eye,
  Trash2,
  Clock,
  Sparkles,
  DollarSign,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

export interface VoucherItem {
  id: string;
  code: string;
  amount: number;
  recipientName: string;
  senderName?: string;
  phone?: string;
  email?: string;
  message?: string;
  ritualName?: string;
  status: "pending_payment" | "active" | "redeemed" | "cancelled";
  source?: string;
  createdAt?: string;
  expiryDate?: string | null;
  redeemedAt?: string | null;
}

export function VoucherListClient({ initialVouchers }: { initialVouchers: VoucherItem[] }) {
  const [vouchers, setVouchers] = useState<VoucherItem[]>(initialVouchers || []);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending_payment" | "active" | "redeemed" | "cancelled">("all");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [previewVoucher, setPreviewVoucher] = useState<VoucherItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New voucher form state
  const [newVoucher, setNewVoucher] = useState({
    amount: 50,
    recipientName: "",
    senderName: "Teuk Spa Management",
    phone: "",
    email: "",
    message: "",
    ritualName: "",
  });

  // Calculate Metrics
  const stats = useMemo(() => {
    let pendingCount = 0;
    let pendingValue = 0;
    let activeCount = 0;
    let activeValue = 0;
    let redeemedCount = 0;
    let redeemedValue = 0;

    vouchers.forEach((v) => {
      const amt = Number(v.amount) || 0;
      if (v.status === "pending_payment") {
        pendingCount++;
        pendingValue += amt;
      } else if (v.status === "active") {
        activeCount++;
        activeValue += amt;
      } else if (v.status === "redeemed") {
        redeemedCount++;
        redeemedValue += amt;
      }
    });

    return {
      pendingCount,
      pendingValue,
      activeCount,
      activeValue,
      redeemedCount,
      redeemedValue,
      totalCount: vouchers.length,
    };
  }, [vouchers]);

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      // Status filter
      if (statusFilter !== "all" && v.status !== statusFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const codeMatch = v.code?.toLowerCase().includes(query);
        const recipientMatch = v.recipientName?.toLowerCase().includes(query);
        const senderMatch = v.senderName?.toLowerCase().includes(query);
        const phoneMatch = v.phone?.toLowerCase().includes(query);
        const ritualMatch = v.ritualName?.toLowerCase().includes(query);
        if (!codeMatch && !recipientMatch && !senderMatch && !phoneMatch && !ritualMatch) {
          return false;
        }
      }

      return true;
    });
  }, [vouchers, statusFilter, searchQuery]);

  // Actions
  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucher.recipientName.trim()) return;

    setLoading(true);
    const res = await adminIssueVoucher(newVoucher.amount, newVoucher.recipientName, {
      senderName: newVoucher.senderName,
      phone: newVoucher.phone,
      email: newVoucher.email,
      message: newVoucher.message,
      ritualName: newVoucher.ritualName,
    });

    if (res.success && res.voucher) {
      setVouchers((prev) => [res.voucher, ...prev]);
      setShowIssueModal(false);
      setNewVoucher({
        amount: 50,
        recipientName: "",
        senderName: "Teuk Spa Management",
        phone: "",
        email: "",
        message: "",
        ritualName: "",
      });
    } else {
      alert(res.error || "Failed to issue voucher");
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: "active" | "redeemed" | "cancelled") => {
    setLoading(true);
    const res = await updateVoucherStatus(id, newStatus);
    if (res.success) {
      setVouchers((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                status: newStatus,
                expiryDate: res.expiryDate !== undefined ? res.expiryDate : v.expiryDate,
                redeemedAt: res.redeemedAt !== undefined ? res.redeemedAt : v.redeemedAt,
              }
            : v
        )
      );
    } else {
      alert("Failed to update status.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this voucher record?")) return;
    setLoading(true);
    const res = await deleteVoucher(id);
    if (res.success) {
      setVouchers((prev) => prev.filter((v) => v.id !== id));
      if (previewVoucher?.id === id) {
        setPreviewVoucher(null);
      }
    } else {
      alert("Failed to delete voucher.");
    }
    setLoading(false);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* ─── 1. TOP STATS CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Verification */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-amber-700 font-medium">Pending Payment</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-amber-900">
            {stats.pendingCount} <span className="text-sm font-normal text-amber-700 font-sans">(${stats.pendingValue})</span>
          </div>
          <p className="text-[11px] text-amber-600 mt-1">Awaiting ABA/Cash confirmation</p>
        </div>

        {/* Active Circulation */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-emerald-700 font-medium">Active In Circulation</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-900">
            ${stats.activeValue} <span className="text-sm font-normal text-emerald-700 font-sans">({stats.activeCount} codes)</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">Ready for guest redemption</p>
        </div>

        {/* Total Redeemed */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Total Redeemed</span>
            <DollarSign className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-800">
            ${stats.redeemedValue} <span className="text-sm font-normal text-stone-500 font-sans">({stats.redeemedCount} used)</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Fulfilled sanctuary rituals</p>
        </div>

        {/* Total Issued */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-[#4A5240] font-medium">Total Generated</span>
            <Ticket className="w-4 h-4 text-[#4A5240]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#141612]">{stats.totalCount}</div>
          <p className="text-[11px] text-stone-400 mt-1">Web requests & manual issues</p>
        </div>
      </div>

      {/* ─── 2. SEARCH, FILTER TABS & ISSUE ACTION ─── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search by code, recipient, sender, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#4A5240]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Issue Button */}
        <button
          onClick={() => setShowIssueModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A5240] hover:bg-[#343e30] text-[#FAF7F2] text-xs uppercase tracking-[0.15em] font-medium rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Voucher</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        {[
          { key: "all", label: "All Vouchers", count: stats.totalCount },
          { key: "pending_payment", label: "Pending Payment", count: stats.pendingCount },
          { key: "active", label: "Active", count: stats.activeCount },
          { key: "redeemed", label: "Redeemed", count: stats.redeemedCount },
          { key: "cancelled", label: "Cancelled", count: vouchers.filter((v) => v.status === "cancelled").length },
        ].map((tab) => {
          const isSelected = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-jost uppercase tracking-wider transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-[#141612] text-[#FAF7F2] font-medium shadow-sm"
                  : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected ? "bg-[#C9A84C] text-[#141612]" : "bg-stone-100 text-stone-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── 3. VOUCHER LIST TABLE ─── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {filteredVouchers.length === 0 ? (
          <div className="p-16 text-center text-stone-500 font-jost space-y-2">
            <Ticket className="w-8 h-8 mx-auto text-stone-300 mb-2" />
            <div className="font-serif text-xl text-stone-700">No vouchers match your criteria</div>
            <p className="text-xs text-stone-400">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredVouchers.map((v) => {
              const isPending = v.status === "pending_payment";
              const isActive = v.status === "active";
              const isRedeemed = v.status === "redeemed";
              const isCancelled = v.status === "cancelled";

              return (
                <div
                  key={v.id}
                  className="p-5 hover:bg-[#FAF7F2]/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Code, Status & Recipient Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isPending
                          ? "bg-amber-100 text-amber-700"
                          : isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : isRedeemed
                          ? "bg-stone-100 text-stone-500"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      <Ticket className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-base font-bold text-[#141612] tracking-wider">
                          {v.code}
                        </span>

                        <button
                          onClick={() => handleCopyCode(v.id, v.code)}
                          className="text-stone-400 hover:text-stone-700 transition-colors text-xs inline-flex items-center gap-1"
                          title="Copy Code"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{copiedId === v.id ? "Copied!" : ""}</span>
                        </button>

                        {/* Status Badge */}
                        {isPending && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                            Pending Payment
                          </span>
                        )}
                        {isActive && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Active (6M)
                          </span>
                        )}
                        {isRedeemed && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                            Redeemed
                          </span>
                        )}
                        {isCancelled && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                            Cancelled
                          </span>
                        )}
                      </div>

                      {/* Recipient & Value Description */}
                      <p className="text-sm text-stone-700">
                        <span className="font-serif font-bold text-base text-[#141612]">${v.amount}</span>
                        {" for "}
                        <strong className="text-stone-900">{v.recipientName}</strong>
                        {v.senderName && <span className="text-stone-500 font-light"> (from {v.senderName})</span>}
                        {v.ritualName && <span className="text-xs text-[#C9A84C] font-medium block">{v.ritualName}</span>}
                      </p>

                      {/* Details & Dates */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400 pt-0.5">
                        {v.phone && <span>WhatsApp: {v.phone}</span>}
                        {v.createdAt && <span>Requested: {format(new Date(v.createdAt), "MMM d, yyyy")}</span>}
                        {isActive && v.expiryDate && (
                          <span className="text-emerald-700 font-medium">
                            Expires: {format(new Date(v.expiryDate), "MMM d, yyyy")}
                          </span>
                        )}
                        {isRedeemed && v.redeemedAt && (
                          <span className="text-stone-500">
                            Redeemed on {format(new Date(v.redeemedAt), "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Operational Action Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                    {/* View Certificate Preview Button */}
                    <button
                      onClick={() => setPreviewVoucher(v)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-jost font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C9A84C]" />
                      <span>Certificate</span>
                    </button>

                    {/* Pending State -> Verify & Activate */}
                    {isPending && (
                      <button
                        onClick={() => handleStatusChange(v.id, "active")}
                        disabled={loading}
                        className="px-3.5 py-1.5 bg-[#4A5240] hover:bg-[#343e30] text-[#FAF7F2] rounded-lg text-xs font-jost uppercase tracking-wider font-medium transition-all shadow-sm disabled:opacity-50"
                      >
                        Verify & Activate
                      </button>
                    )}

                    {/* Active State -> Mark as Redeemed */}
                    {isActive && (
                      <button
                        onClick={() => handleStatusChange(v.id, "redeemed")}
                        disabled={loading}
                        className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-jost uppercase tracking-wider font-medium transition-all disabled:opacity-50"
                      >
                        Mark Redeemed
                      </button>
                    )}

                    {/* Active/Pending -> Cancel */}
                    {(isPending || isActive) && (
                      <button
                        onClick={() => handleStatusChange(v.id, "cancelled")}
                        disabled={loading}
                        className="p-2 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Cancel Voucher"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete permanently */}
                    <button
                      onClick={() => handleDelete(v.id)}
                      disabled={loading}
                      className="p-2 text-stone-300 hover:text-rose-500 rounded-lg transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 4. ISSUE VOUCHER MODAL ─── */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-2xl text-[#141612]">Issue New Voucher</h3>
                <p className="text-xs text-stone-500 font-jost">Create and immediately activate a sanctuary certificate.</p>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssue} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-jost uppercase tracking-wider text-stone-600 mb-1">
                    Recipient Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sothea"
                    value={newVoucher.recipientName}
                    onChange={(e) => setNewVoucher({ ...newVoucher, recipientName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#4A5240]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-jost uppercase tracking-wider text-stone-600 mb-1">
                    Value ($ USD) *
                  </label>
                  <input
                    required
                    type="number"
                    min="10"
                    value={newVoucher.amount}
                    onChange={(e) => setNewVoucher({ ...newVoucher, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#4A5240]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-jost uppercase tracking-wider text-stone-600 mb-1">
                  Sender Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Teuk Spa Management"
                  value={newVoucher.senderName}
                  onChange={(e) => setNewVoucher({ ...newVoucher, senderName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#4A5240]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-jost uppercase tracking-wider text-stone-600 mb-1">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+855 ..."
                    value={newVoucher.phone}
                    onChange={(e) => setNewVoucher({ ...newVoucher, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#4A5240]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-jost uppercase tracking-wider text-stone-600 mb-1">
                    Dedicated Ritual (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jasmine Aromatherapy"
                    value={newVoucher.ritualName}
                    onChange={(e) => setNewVoucher({ ...newVoucher, ritualName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#4A5240]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-jost uppercase tracking-wider text-stone-600 mb-1">
                  Personal Greeting / Internal Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Note for the guest..."
                  value={newVoucher.message}
                  onChange={(e) => setNewVoucher({ ...newVoucher, message: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#4A5240] resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-800 text-xs uppercase tracking-wider font-jost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#4A5240] hover:bg-[#343e30] text-[#FAF7F2] rounded-xl text-xs font-jost uppercase tracking-[0.15em] font-medium shadow-sm transition-all disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate & Activate Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── 5. CERTIFICATE PREVIEW MODAL ─── */}
      {previewVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#C9A84C]/40 relative space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                <span className="font-serif text-xl text-[#141612]">Digital Certificate Preview</span>
              </div>
              <button
                onClick={() => setPreviewVoucher(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Component */}
            <LuxuryVoucherCertificate
              code={previewVoucher.code}
              amount={previewVoucher.amount}
              recipientName={previewVoucher.recipientName}
              senderName={previewVoucher.senderName || "Teuk Spa Management"}
              message={previewVoucher.message}
              ritualName={previewVoucher.ritualName}
              expiryDate={
                previewVoucher.expiryDate
                  ? `Valid until ${format(new Date(previewVoucher.expiryDate), "MMM d, yyyy")}`
                  : "6 Months from Activation"
              }
            />

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleCopyCode(previewVoucher.id, previewVoucher.code)}
                className="inline-flex items-center gap-1.5 text-xs text-[#4A5240] hover:text-[#141612] font-jost font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId === previewVoucher.id ? "Code Copied!" : "Copy Voucher Code"}</span>
              </button>

              <div className="flex items-center gap-2">
                {previewVoucher.phone && (
                  <a
                    href={`https://wa.me/${previewVoucher.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Dear ${previewVoucher.recipientName}, your Teuk Spa Gift Certificate (${previewVoucher.code}) for $${previewVoucher.amount} is active and ready to enjoy.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-jost uppercase tracking-wider font-medium hover:bg-[#1EBE5D] transition-colors"
                  >
                    <span>Send to Guest WhatsApp</span>
                  </a>
                )}

                <button
                  onClick={() => {
                    if (typeof window !== "undefined") window.print();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141612] text-[#FAF7F2] text-xs font-jost uppercase tracking-wider font-medium hover:bg-[#C9A84C] hover:text-[#141612] transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
