"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { format, addDays } from "date-fns";
import {
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Check,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  MessageCircle,
  MapPin,
  Flame,
  CheckCircle2,
  X,
} from "lucide-react";
import { checkAvailableSlots, submitBookingRequest } from "@/lib/booking/actions";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function TelegramBookingClient({
  packages = [],
  treatments = [],
  settings,
}: {
  packages: any[];
  treatments: any[];
  settings?: any;
}) {
  const [tgUser, setTgUser] = useState<TelegramUser | null>(null);
  const [step, setStep] = useState<number>(1);
  const [tab, setTab] = useState<"packages" | "treatments">("packages");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Selection states
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);

  // Scheduling states
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [guests, setGuests] = useState<number>(1);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Guest details
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    phone: "",
    email: "",
    hotel: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingReference, setBookingReference] = useState("");

  // Telegram SDK trigger & haptics
  const haptic = (type: "light" | "medium" | "heavy" | "success" | "warning" = "light") => {
    if (typeof window === "undefined") return;
    const tg = (window as any).Telegram?.WebApp;
    if (!tg?.HapticFeedback) return;
    if (type === "success" || type === "warning") {
      tg.HapticFeedback.notificationOccurred(type);
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready();
        tg.expand();
        // Set header color if supported (Telegram v6.1+)
        if (tg.isVersionAtLeast && tg.isVersionAtLeast("6.1")) {
          if (typeof tg.setHeaderColor === "function") {
            tg.setHeaderColor("#0E100C");
          }
          if (typeof tg.setBackgroundColor === "function") {
            tg.setBackgroundColor("#0E100C");
          }
        }
      } catch (e) {
        console.error("Telegram WebApp init error:", e);
      }

      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTgUser(user);
        const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
        setGuestDetails((prev) => ({
          ...prev,
          name: prev.name || fullName,
        }));
      }
    }
  }, []);

  // Fetch live capacity slots whenever date, duration, guests or step changes
  useEffect(() => {
    if (step === 2 && selectedDuration) {
      let isMounted = true;
      setLoadingSlots(true);
      checkAvailableSlots(selectedDate, selectedDuration, guests)
        .then((slots) => {
          if (!isMounted) return;
          setAvailableSlots(slots || []);
          setSelectedTime(null);
          setLoadingSlots(false);
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error("Failed to check slots:", err);
          setLoadingSlots(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [step, selectedDate, selectedDuration, guests]);

  // Unique categories for treatments
  const categories = useMemo(() => {
    const set = new Set<string>();
    treatments.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ["all", ...Array.from(set)];
  }, [treatments]);

  // Filtered treatments
  const filteredTreatments = useMemo(() => {
    if (selectedCategory === "all") return treatments;
    return treatments.filter((t) => t.category === selectedCategory);
  }, [treatments, selectedCategory]);

  // Upcoming 10 days for rapid tap
  const dateOptions = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const d = addDays(today, i);
      arr.push({
        dateStr: format(d, "yyyy-MM-dd"),
        dayName: i === 0 ? "Today" : i === 1 ? "Tmrw" : format(d, "EEE"),
        dayNum: format(d, "d"),
        monthName: format(d, "MMM"),
      });
    }
    return arr;
  }, []);

  // Handlers
  const handleSelectPackage = (pkg: any) => {
    haptic("medium");
    setSelectedService({ ...pkg, type: "package" });
    setSelectedDuration(pkg.totalMinutes || 90);
    setSelectedPrice(pkg.price || 0);
    setStep(2);
  };

  const handleSelectTreatment = (treatment: any, option?: { minutes: number; price: number }) => {
    haptic("medium");
    const duration = option ? option.minutes : treatment.durationOptions?.[0]?.minutes || 60;
    const price = option ? option.price : treatment.durationOptions?.[0]?.price || treatment.price || 25;

    setSelectedService({ ...treatment, type: "treatment" });
    setSelectedDuration(duration);
    setSelectedPrice(price);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedTime || !selectedDuration) return;

    haptic("heavy");
    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      service: selectedService,
      durationMinutes: selectedDuration,
      price: selectedPrice,
      date: selectedDate,
      time: selectedTime,
      guests,
      guestDetails,
      source: "telegram",
      telegramUser: tgUser
        ? {
            id: tgUser.id,
            username: tgUser.username,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name,
          }
        : null,
    };

    const res = await submitBookingRequest(payload);

    if (res.success) {
      haptic("success");
      setBookingReference(res.reference || "");
      setStep(4);
    } else {
      haptic("warning");
      const err = res.error || "Reservation request could not be processed.";
      setErrorMsg(err);
      if (err.includes("time slot")) setStep(2);
    }
    setSubmitting(false);
  };

  const handleCloseTelegram = () => {
    haptic("light");
    if (typeof window !== "undefined") {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.close) {
        tg.close();
        return;
      }
    }
    // Fallback if opened outside Telegram webview
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen text-[#E8E2D5] bg-[#0E100C] selection:bg-[#C9A84C]/30 selection:text-[#E8E2D5]">
      {/* ── TOP VIP BRAND HEADER ── */}
      <header className="sticky top-0 z-30 bg-[#0E100C]/90 backdrop-blur-md border-b border-[#C9A84C]/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => {
                haptic("light");
                setStep(step - 1);
              }}
              className="w-8 h-8 rounded-full bg-[#181C15] border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#181C15] border border-[#C9A84C]/30 flex items-center justify-center p-1">
              <Image
                src="/images/brand/logo.png"
                alt="Teuk Spa"
                width={32}
                height={32}
                className="w-full h-full object-contain brightness-100"
              />
            </div>
          )}

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif text-base tracking-wide text-[#FAF7F2] font-medium">
                TEUK SPA
              </span>
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#C9A84C]/20 text-[#C9A84C] font-semibold border border-[#C9A84C]/40">
                VIP
              </span>
            </div>
            <p className="text-[10px] text-[#A6A29A] font-light">
              {tgUser?.first_name ? `Welcome, ${tgUser.first_name}` : "Siem Reap Sanctuary"}
            </p>
          </div>
        </div>

        {/* Telegram User Badge */}
        {tgUser?.username ? (
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#181C15] border border-[#2A3125] text-[11px] text-[#C9A84C]">
            <Send className="w-3 h-3 text-[#29B6F6]" />
            <span className="font-mono">@{tgUser.username}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-[11px] text-[#A6A29A]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Concierge</span>
          </div>
        )}
      </header>

      {/* ── STEP PROGRESS BAR ── */}
      {step < 4 && (
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#A6A29A] mb-1.5 font-medium">
            <span className={step >= 1 ? "text-[#C9A84C] font-semibold" : ""}>1. Ritual</span>
            <span className={step >= 2 ? "text-[#C9A84C] font-semibold" : ""}>2. Schedule</span>
            <span className={step >= 3 ? "text-[#C9A84C] font-semibold" : ""}>3. Confirm</span>
          </div>
          <div className="w-full h-1 bg-[#1A1F16] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C9A84C] to-[#E3C676] transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ACCORDING TO STEP ── */}
      <main className="flex-1 px-4 py-3">
        {/* ══════════════════════════════════════════════════
            STEP 1: SELECT RITUAL OR TREATMENT
        ══════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Quick Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-[#C9A84C]/30 p-4 bg-gradient-to-br from-[#181C15] to-[#10130E] shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-semibold flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3" /> Telegram Instant Concierge
                  </span>
                  <h1 className="font-serif text-xl text-[#FAF7F2] leading-tight">
                    Select Your Healing Ritual
                  </h1>
                  <p className="text-xs text-[#A6A29A] mt-1 leading-relaxed">
                    No prepayment required. Reserve in seconds and pay at the spa.
                  </p>
                </div>
              </div>
            </div>

            {/* TAB SELECTOR: Packages vs Treatments */}
            <div className="flex p-1 rounded-xl bg-[#151912] border border-[#252C20]">
              <button
                onClick={() => {
                  haptic("light");
                  setTab("packages");
                }}
                className={`flex-1 py-2 text-xs uppercase tracking-wider rounded-lg font-medium transition-all ${
                  tab === "packages"
                    ? "bg-[#C9A84C] text-[#0E100C] shadow-sm font-semibold"
                    : "text-[#A6A29A] hover:text-[#E8E2D5]"
                }`}
              >
                Signature Packages ({packages.length})
              </button>
              <button
                onClick={() => {
                  haptic("light");
                  setTab("treatments");
                }}
                className={`flex-1 py-2 text-xs uppercase tracking-wider rounded-lg font-medium transition-all ${
                  tab === "treatments"
                    ? "bg-[#C9A84C] text-[#0E100C] shadow-sm font-semibold"
                    : "text-[#A6A29A] hover:text-[#E8E2D5]"
                }`}
              >
                Treatments ({treatments.length})
              </button>
            </div>

            {/* PACKAGES VIEW */}
            {tab === "packages" && (
              <div className="space-y-3">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    className="group relative rounded-2xl bg-[#141812] border border-[#252C20] hover:border-[#C9A84C]/60 transition-all p-3.5 flex flex-col justify-between cursor-pointer active:scale-[0.98] shadow-md"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#20271B] shrink-0 border border-[#2A3423]">
                        <Image
                          src={pkg.imageUrl || "/images/defaults/spa_package.jpg"}
                          alt={pkg.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-serif text-base text-[#FAF7F2] truncate group-hover:text-[#C9A84C] transition-colors">
                            {pkg.name}
                          </h3>
                        </div>
                        <p className="text-[11px] text-[#A6A29A] line-clamp-2 mt-0.5 leading-snug">
                          {pkg.description || pkg.subtitle}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#252C20]">
                          <span className="text-[11px] text-[#A6A29A] flex items-center gap-1 font-light">
                            <Clock className="w-3 h-3 text-[#C9A84C]" />
                            {pkg.totalMinutes} min
                          </span>
                          <span className="font-serif text-base text-[#C9A84C] font-semibold">
                            ${pkg.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {pkg.includes && pkg.includes.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#20271A] flex flex-wrap gap-1">
                        {pkg.includes.slice(0, 3).map((inc: string, i: number) => (
                          <span
                            key={i}
                            className="text-[9.5px] px-2 py-0.5 rounded-full bg-[#1C2218] text-[#A6A29A] border border-[#273022]"
                          >
                            ✓ {inc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TREATMENTS VIEW */}
            {tab === "treatments" && (
              <div className="space-y-3">
                {/* Category Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        haptic("light");
                        setSelectedCategory(cat);
                      }}
                      className={`px-3 py-1.5 rounded-full text-[11px] whitespace-nowrap transition-colors capitalize ${
                        selectedCategory === cat
                          ? "bg-[#C9A84C] text-[#0E100C] font-semibold"
                          : "bg-[#161A13] text-[#A6A29A] border border-[#252C20] hover:text-[#E8E2D5]"
                      }`}
                    >
                      {cat === "all" ? "All Treatments" : cat}
                    </button>
                  ))}
                </div>

                {filteredTreatments.map((t) => {
                  const opts = t.durationOptions || [];
                  return (
                    <div
                      key={t.id}
                      className="rounded-2xl bg-[#141812] border border-[#252C20] p-3.5 space-y-2.5 shadow-md"
                    >
                      <div className="flex gap-3">
                        {t.imageUrl && (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#20271B] shrink-0 border border-[#2A3423]">
                            <Image
                              src={t.imageUrl}
                              alt={t.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif text-base text-[#FAF7F2] truncate">
                              {t.name}
                            </h3>
                            {t.category && (
                              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#C9A84C]/15 text-[#C9A84C]">
                                {t.category}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#A6A29A] line-clamp-2 mt-1 leading-snug">
                            {t.shortDescription || t.description}
                          </p>
                        </div>
                      </div>

                      {/* Duration Choice Buttons */}
                      <div className="pt-2 border-t border-[#22281D] flex flex-wrap gap-2">
                        {opts.length > 0 ? (
                          opts.map((opt: any, i: number) => (
                            <button
                              key={i}
                              onClick={() => handleSelectTreatment(t, opt)}
                              className="flex-1 min-w-[90px] py-1.5 px-2 rounded-xl bg-[#1C2218] border border-[#2D3626] hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 text-center transition-all active:scale-[0.98]"
                            >
                              <div className="text-[10px] text-[#A6A29A] uppercase tracking-wider">
                                {opt.minutes} mins
                              </div>
                              <div className="font-serif text-sm text-[#C9A84C] font-semibold">
                                ${opt.price}
                              </div>
                            </button>
                          ))
                        ) : (
                          <button
                            onClick={() => handleSelectTreatment(t)}
                            className="w-full py-2 px-3 rounded-xl bg-[#C9A84C] text-[#0E100C] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                          >
                            <span>Select Ritual</span>
                            {t.price && <span>(${t.price})</span>}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 2: DATE, TIME & PARTY SIZE
        ══════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Selected Service Card */}
            <div className="p-3.5 rounded-2xl bg-[#141812] border border-[#C9A84C]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-semibold">
                  Selected Ritual
                </span>
                <h2 className="font-serif text-lg text-[#FAF7F2]">{selectedService.name}</h2>
                <p className="text-xs text-[#A6A29A]">
                  {selectedDuration} mins · ${selectedPrice} per person
                </p>
              </div>
              <button
                onClick={() => {
                  haptic("light");
                  setStep(1);
                }}
                className="text-xs text-[#C9A84C] underline hover:opacity-80 px-2 py-1"
              >
                Change
              </button>
            </div>

            {/* Party Size Selector */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#A6A29A] font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#C9A84C]" /> Number of Guests
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      haptic("light");
                      setGuests(num);
                    }}
                    className={`py-2 px-3 rounded-xl text-center border transition-all ${
                      guests === num
                        ? "bg-[#C9A84C] text-[#0E100C] border-[#C9A84C] font-semibold"
                        : "bg-[#141812] text-[#E8E2D5] border-[#252C20] hover:border-[#C9A84C]/40"
                    }`}
                  >
                    <div className="text-sm font-medium">{num} {num === 1 ? "Guest" : "Guests"}</div>
                    <div className="text-[10px] opacity-80">
                      {num === 1 ? "Private Suite" : num === 2 ? "Couple Ritual" : "Group Sanctuary"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Picker Horizontal Chips */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#A6A29A] font-medium flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#C9A84C]" /> Choose Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {dateOptions.map((item) => {
                  const isSelected = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      onClick={() => {
                        haptic("light");
                        setSelectedDate(item.dateStr);
                      }}
                      className={`flex flex-col items-center justify-center min-w-[64px] py-2.5 px-2 rounded-2xl border transition-all shrink-0 ${
                        isSelected
                          ? "bg-[#C9A84C] text-[#0E100C] border-[#C9A84C] font-semibold shadow-md"
                          : "bg-[#141812] text-[#A6A29A] border-[#252C20] hover:text-[#E8E2D5]"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider font-light">
                        {item.dayName}
                      </span>
                      <span className="text-base font-serif font-bold leading-tight mt-0.5">
                        {item.dayNum}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest opacity-80">
                        {item.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Time Slots */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider text-[#A6A29A] font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C9A84C]" /> Available Appointment Times
                </label>
                {loadingSlots && (
                  <span className="text-[11px] text-[#C9A84C] animate-pulse">Checking capacity...</span>
                )}
              </div>

              {loadingSlots ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 rounded-xl bg-[#161A13] animate-pulse border border-[#252C20]"
                    />
                  ))}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#181C15] border border-[#252C20] text-center text-xs text-[#A6A29A]">
                  No slots currently available for this day. Please pick another date.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
                  {availableSlots.map(({ time, available }) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        disabled={!available}
                        onClick={() => {
                          haptic("light");
                          setSelectedTime(time);
                        }}
                        className={`py-2 px-2 rounded-xl text-center border transition-all text-xs font-mono font-medium ${
                          !available
                            ? "bg-[#11140F] border-[#1D2218] text-[#555C4E] line-through cursor-not-allowed"
                            : isSelected
                            ? "bg-[#C9A84C] text-[#0E100C] border-[#C9A84C] font-bold shadow-md scale-[1.02]"
                            : "bg-[#161A13] text-[#E8E2D5] border-[#252C20] hover:border-[#C9A84C]/50 active:scale-95"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Next Button */}
            <div className="pt-2">
              <button
                disabled={!selectedTime}
                onClick={() => {
                  haptic("medium");
                  setStep(3);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C9A84C] to-[#DFC170] text-[#0E100C] font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition-transform"
              >
                <span>Continue to Guest Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 3: GUEST DETAILS & CONFIRMATION
        ══════════════════════════════════════════════════ */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Summary Ticket */}
            <div className="rounded-2xl bg-gradient-to-br from-[#161B13] to-[#10130E] border border-[#C9A84C]/40 p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#2A3324]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-semibold">
                    Reservation Summary
                  </span>
                  <h3 className="font-serif text-lg text-[#FAF7F2]">{selectedService.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#A6A29A]">Total</span>
                  <div className="font-serif text-2xl text-[#C9A84C] font-bold">
                    ${selectedPrice * guests}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#A6A29A]">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>{format(new Date(selectedDate), "EEE, MMM d")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>
                    {selectedTime} ({selectedDuration}m)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>
                    {guests} {guests > 1 ? "Guests" : "Guest"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span className="text-[#C9A84C]">Pay at Spa</span>
                </div>
              </div>
            </div>

            {/* Telegram Profile Linked Notice */}
            {tgUser && (
              <div className="p-3 rounded-xl bg-[#162013] border border-[#2C3B24] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#29B6F6]" />
                  <span>
                    Auto-linking with <b>{tgUser.first_name}</b> {tgUser.username ? `(@${tgUser.username})` : ""}
                  </span>
                </div>
                <span className="text-[10px] text-[#C9A84C] uppercase tracking-widest font-semibold">
                  VERIFIED
                </span>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A6A29A] mb-1 font-medium">
                  Full Name <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Somaly Chen"
                  value={guestDetails.name}
                  onChange={(e) => setGuestDetails({ ...guestDetails, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141812] border border-[#252C20] focus:border-[#C9A84C] text-[#FAF7F2] text-sm focus:outline-none placeholder:text-[#555C4E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A6A29A] mb-1 font-medium">
                  Phone / WhatsApp <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  required
                  type="tel"
                  placeholder="e.g. +855 12 345 678"
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141812] border border-[#252C20] focus:border-[#C9A84C] text-[#FAF7F2] text-sm focus:outline-none placeholder:text-[#555C4E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A6A29A] mb-1 font-medium">
                  Hotel / Room in Siem Reap (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Raffles Grand Hotel d'Angkor, Room 204"
                  value={guestDetails.hotel}
                  onChange={(e) => setGuestDetails({ ...guestDetails, hotel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141812] border border-[#252C20] focus:border-[#C9A84C] text-[#FAF7F2] text-sm focus:outline-none placeholder:text-[#555C4E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A6A29A] mb-1 font-medium">
                  Special Notes or Pressure Preference (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Firm pressure, focus on shoulders, herbal tea preference"
                  value={guestDetails.notes}
                  onChange={(e) => setGuestDetails({ ...guestDetails, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141812] border border-[#252C20] focus:border-[#C9A84C] text-[#FAF7F2] text-sm focus:outline-none placeholder:text-[#555C4E]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#341616] border border-[#642828] text-xs text-[#FF9B9B]">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C9A84C] to-[#DFC170] text-[#0E100C] font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {submitting ? (
                  <span>Securing Your Ritual...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#0E100C]" />
                    <span>Confirm Spa Reservation</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-[#7F796E] mt-2 font-light">
                Instant notification will be sent to the front desk.
              </p>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 4: INSTANT SUCCESS CONFIRMATION
        ══════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="py-6 space-y-6 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#C9A84C]/30 to-[#C9A84C]/10 border border-[#C9A84C] flex items-center justify-center shadow-[0_0_30px_rgba(201,168,76,0.3)] animate-in fade-in zoom-in duration-500">
              <Check className="w-10 h-10 text-[#C9A84C]" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-widest text-[#C9A84C] font-semibold">
                Ritual Reserved
              </span>
              <h2 className="font-serif text-3xl text-[#FAF7F2]">Sanctuary Confirmed</h2>
              <p className="text-xs text-[#A6A29A] max-w-xs mx-auto">
                Thank you, <span className="text-[#FAF7F2] font-medium">{guestDetails.name}</span>. Your private suite is being prepared.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="inline-block px-5 py-2.5 rounded-2xl bg-[#161C13] border border-[#C9A84C]/50 shadow-inner">
              <div className="text-[10px] uppercase tracking-widest text-[#A6A29A]">
                Booking Reference
              </div>
              <div className="font-mono text-2xl text-[#C9A84C] font-bold tracking-wider mt-0.5">
                {bookingReference}
              </div>
            </div>

            {/* Details Box */}
            <div className="rounded-2xl bg-[#141812] border border-[#252C20] p-4 text-left space-y-2 text-xs text-[#A6A29A]">
              <div className="flex justify-between py-1 border-b border-[#20271A]">
                <span>Service:</span>
                <span className="text-[#FAF7F2] font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#20271A]">
                <span>Date & Time:</span>
                <span className="text-[#FAF7F2] font-medium">
                  {format(new Date(selectedDate), "MMM d, yyyy")} @ {selectedTime}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#20271A]">
                <span>Guests:</span>
                <span className="text-[#FAF7F2] font-medium">
                  {guests} {guests > 1 ? "Guests" : "Guest"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#20271A]">
                <span>Total Amount:</span>
                <span className="text-[#C9A84C] font-semibold">${selectedPrice * guests}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Payment:</span>
                <span className="text-[#FAF7F2]">Pay at Spa (Cash, ABA QR, Card)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleCloseTelegram}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C9A84C] to-[#DFC170] text-[#0E100C] font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <span>Return to Telegram</span>
              </button>

              <button
                onClick={() => {
                  haptic("light");
                  setStep(1);
                  setSelectedService(null);
                  setSelectedTime(null);
                }}
                className="w-full py-3 rounded-2xl bg-[#141812] border border-[#252C20] text-[#A6A29A] hover:text-[#FAF7F2] text-xs uppercase tracking-wider"
              >
                Book Another Ritual
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
