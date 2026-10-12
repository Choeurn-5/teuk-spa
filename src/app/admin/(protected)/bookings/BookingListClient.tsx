"use client";

import { useState, useMemo } from "react";
import { updateBookingStatus } from "@/lib/booking/actions";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MessageCircle,
  Calendar,
  Send,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  DollarSign,
  User,
  X,
} from "lucide-react";
import { format } from "date-fns";

export function BookingListClient({ initialBookings }: { initialBookings: any[] }) {
  const [bookings, setBookings] = useState<any[]>(initialBookings || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState<"all" | "new" | "confirmed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "telegram" | "web">("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Status Counts for Badges
  const counts = useMemo(() => {
    let newCount = 0;
    let confirmedCount = 0;
    let cancelledCount = 0;
    let telegramCount = 0;
    let totalRevenue = 0;

    bookings.forEach((b) => {
      if (b.status === "new") newCount++;
      else if (b.status === "confirmed") confirmedCount++;
      else if (b.status === "cancelled" || b.status === "declined") cancelledCount++;

      if (b.source === "telegram") telegramCount++;
      if (b.status !== "cancelled" && b.status !== "declined") {
        totalRevenue += (b.price || 0) * (b.guests || 1);
      }
    });

    return {
      all: bookings.length,
      new: newCount,
      confirmed: confirmedCount,
      cancelled: cancelledCount,
      telegram: telegramCount,
      totalRevenue,
    };
  }, [bookings]);

  // Filtering Logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Tab filter
      if (activeTab === "new" && b.status !== "new") return false;
      if (activeTab === "confirmed" && b.status !== "confirmed") return false;
      if (activeTab === "cancelled" && b.status !== "cancelled" && b.status !== "declined")
        return false;

      // Source filter
      if (sourceFilter === "telegram" && b.source !== "telegram") return false;
      if (sourceFilter === "web" && b.source !== "web" && b.source) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const ref = (b.reference || "").toLowerCase();
        const name = (b.guest?.name || "").toLowerCase();
        const phone = (b.guest?.phone || "").toLowerCase();
        const service = (b.serviceName || "").toLowerCase();
        const hotel = (b.guest?.hotel || "").toLowerCase();
        const username = (b.telegramUser?.username || "").toLowerCase();

        return (
          ref.includes(q) ||
          name.includes(q) ||
          phone.includes(q) ||
          service.includes(q) ||
          hotel.includes(q) ||
          username.includes(q)
        );
      }

      return true;
    });
  }, [bookings, activeTab, sourceFilter, searchQuery]);

  // Pagination Calculations
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedBookings = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredBookings.slice(startIndex, startIndex + pageSize);
  }, [filteredBookings, safeCurrentPage, pageSize]);

  // Status Change Handler with Optimistic UI Update
  const handleStatusChange = async (id: string, status: string) => {
    setLoadingId(id);
    // Optimistic update
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b))
    );

    try {
      await updateBookingStatus(id, status);
    } catch (err) {
      console.error("Failed to update booking status:", err);
      // Revert if error
      setBookings(initialBookings);
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="px-3 py-1 bg-amber-500/15 text-amber-800 border border-amber-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            New Request
          </span>
        );
      case "confirmed":
        return (
          <span className="px-3 py-1 bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Confirmed
          </span>
        );
      case "declined":
        return (
          <span className="px-3 py-1 bg-rose-500/15 text-rose-800 border border-rose-500/30 text-xs font-semibold rounded-full">
            Declined
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 bg-gray-500/15 text-gray-700 border border-gray-400/30 text-xs font-semibold rounded-full">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-mist text-ink text-xs font-medium rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── 1. TOP METRIC TILES ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* All Bookings */}
        <div
          onClick={() => {
            setActiveTab("all");
            setCurrentPage(1);
          }}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-white border-olive shadow-sm ring-2 ring-olive/10"
              : "bg-warm border-mist hover:bg-white"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-ink/60 mb-2 font-medium uppercase tracking-wider">
            <span>Total Bookings</span>
            <Calendar className="w-4 h-4 text-olive/60" />
          </div>
          <div className="text-3xl font-serif text-olive font-bold">{counts.all}</div>
        </div>

        {/* Pending Requests */}
        <div
          onClick={() => {
            setActiveTab("new");
            setCurrentPage(1);
          }}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === "new"
              ? "bg-amber-50/50 border-amber-600 shadow-sm ring-2 ring-amber-600/10"
              : "bg-warm border-mist hover:bg-white"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-800 mb-2 font-medium uppercase tracking-wider">
            <span>Pending Action</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-serif text-amber-700 font-bold">{counts.new}</div>
        </div>

        {/* Confirmed Rituals */}
        <div
          onClick={() => {
            setActiveTab("confirmed");
            setCurrentPage(1);
          }}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === "confirmed"
              ? "bg-emerald-50/50 border-emerald-600 shadow-sm ring-2 ring-emerald-600/10"
              : "bg-warm border-mist hover:bg-white"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-800 mb-2 font-medium uppercase tracking-wider">
            <span>Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-serif text-emerald-700 font-bold">{counts.confirmed}</div>
        </div>

        {/* Estimated Revenue */}
        <div className="p-5 rounded-3xl bg-warm border border-mist">
          <div className="flex items-center justify-between text-xs text-ink/60 mb-2 font-medium uppercase tracking-wider">
            <span>Est. Pipeline</span>
            <DollarSign className="w-4 h-4 text-gold" />
          </div>
          <div className="text-3xl font-serif text-olive font-bold">${counts.totalRevenue}</div>
        </div>
      </div>

      {/* ─── 2. STATUS TABS, SEARCH & FILTERS BAR ─── */}
      <div className="bg-warm rounded-3xl border border-mist p-4 space-y-4 shadow-sm">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-mist pb-4">
          <button
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "all"
                ? "bg-olive text-cream shadow-sm"
                : "bg-white border border-mist text-ink/70 hover:bg-mist/50"
            }`}
          >
            <span>All Bookings</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === "all" ? "bg-white/20 text-cream" : "bg-mist text-ink/70"
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("new");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "new"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white border border-mist text-amber-800 hover:bg-amber-50"
            }`}
          >
            <span>New Requests</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "new" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
              }`}
            >
              {counts.new}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("confirmed");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "confirmed"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white border border-mist text-emerald-800 hover:bg-emerald-50"
            }`}
          >
            <span>Confirmed</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === "confirmed"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {counts.confirmed}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("cancelled");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "cancelled"
                ? "bg-gray-700 text-white shadow-sm"
                : "bg-white border border-mist text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span>Cancelled / Declined</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === "cancelled" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {counts.cancelled}
            </span>
          </button>
        </div>

        {/* Search Bar & Source Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by guest name, ref (TS-XXXX), phone, hotel..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-mist rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-olive/20 text-ink placeholder:text-ink/40"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Source Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-ink/50" />
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 bg-white border border-mist rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-olive/20"
            >
              <option value="all">All Channels</option>
              <option value="telegram">Telegram Mini App ({counts.telegram})</option>
              <option value="web">Website Bookings ({counts.all - counts.telegram})</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── 3. BOOKINGS LIST ─── */}
      <div className="bg-warm rounded-3xl border border-mist shadow-sm overflow-hidden">
        {paginatedBookings.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 rounded-full bg-mist/60 flex items-center justify-center mx-auto mb-3 text-ink/40">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-olive mb-1">No reservations found</h3>
            <p className="text-sm text-ink/60 max-w-sm mx-auto">
              {searchQuery || activeTab !== "all" || sourceFilter !== "all"
                ? "Try clearing your filters or search keywords."
                : "No bookings have been made yet."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-mist">
            {paginatedBookings.map((b) => {
              const isTelegram = b.source === "telegram" || !!b.telegramUser;
              const isNew = b.status === "new";
              const isConfirmed = b.status === "confirmed";

              return (
                <li
                  key={b.id}
                  className={`p-6 md:p-8 hover:bg-white transition-colors relative ${
                    isNew ? "border-l-4 border-l-amber-500" : isConfirmed ? "border-l-4 border-l-emerald-600" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Info Column */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-sm text-ink/70 font-semibold bg-mist px-2.5 py-1 rounded-lg">
                          {b.reference}
                        </span>
                        {getStatusBadge(b.status)}

                        {isTelegram && (
                          <span className="px-2.5 py-1 bg-[#29B6F6]/15 text-[#0288D1] border border-[#29B6F6]/30 text-xs font-semibold rounded-full inline-flex items-center gap-1.5">
                            <Send className="w-3 h-3 text-[#29B6F6]" /> Telegram
                            {b.telegramUser?.username ? ` @${b.telegramUser.username}` : ""}
                          </span>
                        )}

                        <span className="text-xs text-ink/50 ml-auto font-light">
                          Created {format(new Date(b.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-3 mb-2">
                        <h3 className="font-serif text-2xl text-olive font-medium">{b.guest?.name}</h3>
                        {b.guest?.hotel && (
                          <span className="text-xs text-ink/60 bg-mist/50 px-2 py-0.5 rounded">
                            🏨 {b.guest.hotel}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-ink/70 mb-4 font-light">
                        <span className="flex items-center text-ink font-medium">
                          <Calendar className="w-4 h-4 mr-1.5 text-gold" />
                          {format(new Date(b.date), "EEEE, MMM d, yyyy")}
                        </span>
                        <span className="flex items-center text-ink font-medium">
                          <Clock className="w-4 h-4 mr-1.5 text-gold" />
                          {b.time}
                        </span>
                        <span className="flex items-center text-olive font-semibold px-2.5 py-0.5 bg-mist/70 rounded-full text-xs">
                          {b.durationMinutes} min
                        </span>
                        <span>
                          {b.guests} {b.guests > 1 ? "Guests" : "Guest"}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-sm text-ink/80 bg-mist/30 p-4 rounded-2xl border border-mist/60">
                        <div className="flex justify-between items-center">
                          <p>
                            <strong>Ritual:</strong> {b.serviceName}
                          </p>
                          <span className="font-serif text-base font-bold text-olive">
                            ${(b.price || 0) * (b.guests || 1)} USD
                          </span>
                        </div>
                        <p className="text-xs text-ink/70">
                          <strong>Phone / WhatsApp:</strong> {b.guest?.phone}{" "}
                          {b.guest?.email && `· Email: ${b.guest.email}`}
                        </p>
                        {b.guest?.notes && (
                          <p className="text-xs text-ink/80 italic pt-1 border-t border-mist/50">
                            <strong>Guest Notes:</strong> "{b.guest.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-stretch justify-center gap-2.5 shrink-0 min-w-[170px]">
                      {b.status === "new" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(b.id, "confirmed")}
                            disabled={loadingId === b.id}
                            className="flex items-center justify-center px-4 py-2.5 bg-olive text-cream hover:bg-[#343e30] rounded-xl text-xs uppercase tracking-wider font-semibold transition-all shadow-sm disabled:opacity-50 active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(b.id, "declined")}
                            disabled={loadingId === b.id}
                            className="flex items-center justify-center px-4 py-2 bg-white border border-mist text-rose-700 hover:bg-rose-50 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all disabled:opacity-50 active:scale-95"
                          >
                            <XCircle className="w-4 h-4 mr-2" /> Decline
                          </button>
                        </>
                      )}

                      {b.status === "confirmed" && (
                        <button
                          onClick={() => handleStatusChange(b.id, "cancelled")}
                          disabled={loadingId === b.id}
                          className="flex items-center justify-center px-4 py-2 bg-white border border-mist text-ink/60 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all disabled:opacity-50"
                        >
                          Cancel Booking
                        </button>
                      )}

                      {(b.status === "cancelled" || b.status === "declined") && (
                        <button
                          onClick={() => handleStatusChange(b.id, "confirmed")}
                          disabled={loadingId === b.id}
                          className="flex items-center justify-center px-4 py-2 bg-white border border-mist text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all disabled:opacity-50"
                        >
                          Re-Confirm
                        </button>
                      )}

                      {/* WhatsApp Chat Button */}
                      {b.guest?.phone && (
                        <a
                          href={`https://wa.me/${b.guest.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${b.guest.name}, this is Teuk Massage & Spa regarding your booking (${b.reference}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-4 py-2 bg-[#25D366]/10 text-[#1e994a] hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 mr-1.5" /> WhatsApp
                        </a>
                      )}

                      {/* Telegram Chat Button */}
                      {b.telegramUser?.username && (
                        <a
                          href={`https://t.me/${b.telegramUser.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-4 py-2 bg-[#29B6F6]/10 text-[#0288D1] hover:bg-[#29B6F6]/20 border border-[#29B6F6]/30 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" /> @{b.telegramUser.username}
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* ─── 4. PAGINATION FOOTER ─── */}
        {totalItems > 0 && (
          <div className="px-6 py-4 bg-mist/30 border-t border-mist flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Range Text */}
            <div className="text-xs text-ink/70">
              Showing{" "}
              <strong className="text-olive font-semibold">
                {(safeCurrentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-olive font-semibold">
                {Math.min(safeCurrentPage * pageSize, totalItems)}
              </strong>{" "}
              of <strong className="text-olive font-semibold">{totalItems}</strong> reservations
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Page Size Selector */}
              <div className="flex items-center gap-1.5 text-xs text-ink/60">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-white border border-mist rounded-lg text-xs font-medium text-ink focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Prev / Page / Next */}
              <div className="flex items-center gap-1">
                <button
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg bg-white border border-mist text-ink/70 hover:bg-mist disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show first, last, and pages close to current
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - safeCurrentPage) <= 1
                    );
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;

                    return (
                      <span key={p} className="flex items-center">
                        {showEllipsis && <span className="px-1 text-ink/40 text-xs">...</span>}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                            safeCurrentPage === p
                              ? "bg-olive text-cream font-bold"
                              : "bg-white border border-mist text-ink/70 hover:bg-mist"
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}

                <button
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg bg-white border border-mist text-ink/70 hover:bg-mist disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
