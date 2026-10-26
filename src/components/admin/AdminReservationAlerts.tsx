"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  BellOff,
  Volume2,
  Calendar,
  Clock,
  User,
  Users,
  Phone,
  ArrowRight,
  X,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { playSpaChime, initAudioUnlock } from "@/lib/audio/spaChime";

export interface NewBookingAlert {
  id: string;
  reference: string;
  status: string;
  source: string;
  serviceName: string;
  guestName: string;
  phone: string;
  email?: string | null;
  hotel?: string | null;
  date: string;
  time: string;
  guests: number;
  price: number;
  durationMinutes: number;
  createdAt: string;
  createdMillis: number;
}

export function AdminReservationAlerts() {
  const router = useRouter();

  // Audio preference state
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("teuk_admin_sound_alert");
      if (saved !== null) return saved === "true";
    }
    return true;
  });
  const [desktopNotifAllowed, setDesktopNotifAllowed] = useState(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission === "granted";
    }
    return false;
  });
  const [unreviewedCount, setUnreviewedCount] = useState<number>(0);
  const [activeAlerts, setActiveAlerts] = useState<NewBookingAlert[]>([]);
  const [testChimePlaying, setTestChimePlaying] = useState(false);

  const knownIdsRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef(false);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("teuk_admin_sound_alert", String(next));
      }
      return next;
    });
  };

  const handleTestChime = () => {
    playSpaChime(0.85);
    setTestChimePlaying(true);
    setTimeout(() => setTestChimePlaying(false), 2000);
  };

  const requestDesktopNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    try {
      const permission = await Notification.requestPermission();
      setDesktopNotifAllowed(permission === "granted");
      if (permission === "granted") {
        new Notification("Teuk Spa Admin Alerts Active", {
          body: "You will now receive desktop notifications for new reservations.",
          icon: "/favicon.ico",
        });
      }
    } catch (err) {
      console.warn("Could not request notification permission:", err);
    }
  };

  const dismissAlert = (id: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Polling fetcher
  const checkLatestBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bookings/latest", {
        cache: "no-store",
      });
      if (!res.ok) return;

      const data = await res.json();
      if (!data.success || !Array.isArray(data.bookings)) return;

      setUnreviewedCount(data.unreviewedCount || 0);

      // 1. Initial baseline: load existing IDs silently so we don't alarm for past bookings
      if (!isInitializedRef.current) {
        data.bookings.forEach((b: NewBookingAlert) => {
          knownIdsRef.current.add(b.id);
        });
        isInitializedRef.current = true;
        return;
      }

      // 2. Identify brand-new bookings
      const incomingNewBookings: NewBookingAlert[] = [];
      data.bookings.forEach((b: NewBookingAlert) => {
        if (!knownIdsRef.current.has(b.id)) {
          knownIdsRef.current.add(b.id);
          // Only alert if the reservation is actually "new" (unreviewed)
          if (b.status === "new") {
            incomingNewBookings.push(b);
          }
        }
      });

      if (incomingNewBookings.length > 0) {
        // Play Chime
        if (soundEnabledRef.current) {
          playSpaChime(0.85);
        }

        // Add to active toast banner
        setActiveAlerts((prev) => [...incomingNewBookings, ...prev].slice(0, 3));

        // Desktop System Notification
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          incomingNewBookings.forEach((b) => {
            try {
              new Notification(`🔔 New Reservation: ${b.reference}`, {
                body: `${b.guestName} booked ${b.serviceName} (${b.guests} guest${b.guests > 1 ? "s" : ""}) on ${b.date} at ${b.time}.`,
                icon: "/favicon.ico",
                tag: b.id,
              });
            } catch {
              // ignore
            }
          });
        }

        // Dispatch DOM event for pages like BookingListClient to update immediately
        incomingNewBookings.forEach((b) => {
          window.dispatchEvent(new CustomEvent("teuk:new-booking", { detail: b }));
        });

        // Refresh Server Components (like AdminBookingsPage & Dashboard counters)
        router.refresh();
      }
    } catch (err) {
      // Background poll silently retries next interval
      console.warn("Booking alert poll error:", err);
    }
  }, [router]);

  // Polling setup: 8s when active, 16s when blurred/hidden
  useEffect(() => {
    initAudioUnlock();

    let isCancelled = false;
    let timer: NodeJS.Timeout | null = null;

    const performCheck = async () => {
      if (isCancelled) return;
      await checkLatestBookings();
    };

    // Initial check on next tick
    const initTimer = setTimeout(() => {
      performCheck();
    }, 50);

    const scheduleNext = () => {
      const interval = document.visibilityState === "hidden" ? 16000 : 8000;
      timer = setTimeout(async () => {
        await performCheck();
        scheduleNext();
      }, interval);
    };

    scheduleNext();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        performCheck();
      }
    };

    const handleFocus = () => {
      performCheck();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      isCancelled = true;
      clearTimeout(initTimer);
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkLatestBookings]);

  return (
    <>
      {/* Floating Reservation Alert Toasts (Top Right) */}
      <div className="fixed top-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className="pointer-events-auto bg-warm/95 backdrop-blur-md border-2 border-gold/60 shadow-2xl rounded-2xl p-4 sm:p-5 text-ink animate-in fade-in slide-in-from-top-4 duration-300 transform transition-all hover:scale-[1.01]"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gold/20 text-olive">
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
                  </span>
                  <Bell className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold uppercase tracking-wider bg-gold text-olive px-2 py-0.5 rounded-full">
                      New Reservation
                    </span>
                    <span className="text-xs font-mono font-bold text-ink/70">
                      {alert.reference}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-medium text-olive leading-tight mt-0.5">
                    {alert.guestName}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => dismissAlert(alert.id)}
                className="text-ink/40 hover:text-ink p-1 rounded-lg hover:bg-mist transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reservation Highlights */}
            <div className="mt-3 bg-white/70 rounded-xl p-3 border border-mist/80 space-y-1.5 text-xs text-ink/80">
              <div className="font-medium text-ink flex items-center justify-between">
                <span>{alert.serviceName}</span>
                <span className="font-bold text-olive">
                  ${alert.price * (alert.guests || 1)}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-ink/70">
                <span className="inline-flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-gold" />
                  {alert.date}
                </span>
                <span className="inline-flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-gold" />
                  {alert.time} ({alert.durationMinutes}m)
                </span>
                <span className="inline-flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-gold" />
                  {alert.guests} {alert.guests > 1 ? "guests" : "guest"}
                </span>
              </div>
              {alert.phone && (
                <div className="inline-flex items-center text-ink/60 pt-0.5">
                  <Phone className="w-3.5 h-3.5 mr-1" />
                  {alert.phone}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => dismissAlert(alert.id)}
                className="text-xs font-medium text-ink/60 hover:text-ink transition-colors px-2 py-1"
              >
                Dismiss
              </button>
              <Link
                href="/admin/bookings"
                onClick={() => dismissAlert(alert.id)}
                className="inline-flex items-center px-3.5 py-1.5 bg-olive text-cream hover:bg-gold hover:text-olive rounded-xl text-xs font-medium transition-all shadow-sm"
              >
                Review Booking <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Persistent Admin Header Bar Widget */}
      <AdminHeaderControls
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onTestChime={handleTestChime}
        isTestPlaying={testChimePlaying}
        unreviewedCount={unreviewedCount}
        desktopNotifAllowed={desktopNotifAllowed}
        onRequestDesktopNotifs={requestDesktopNotifications}
      />
    </>
  );
}

interface AdminHeaderControlsProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTestChime: () => void;
  isTestPlaying: boolean;
  unreviewedCount: number;
  desktopNotifAllowed: boolean;
  onRequestDesktopNotifs: () => void;
}

function AdminHeaderControls({
  soundEnabled,
  onToggleSound,
  onTestChime,
  isTestPlaying,
  unreviewedCount,
  desktopNotifAllowed,
  onRequestDesktopNotifs,
}: AdminHeaderControlsProps) {
  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      {/* Unreviewed Bookings Badge */}
      <Link
        href="/admin/bookings"
        className={`inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
          unreviewedCount > 0
            ? "bg-gold/20 text-olive border border-gold/40 hover:bg-gold hover:text-olive shadow-xs"
            : "bg-mist/70 text-ink/60 hover:bg-mist hover:text-ink"
        }`}
        title={`${unreviewedCount} pending booking requests`}
      >
        <span
          className={`w-2 h-2 rounded-full mr-1.5 ${
            unreviewedCount > 0 ? "bg-gold animate-pulse" : "bg-ink/30"
          }`}
        />
        <span>{unreviewedCount > 0 ? `${unreviewedCount} New` : "0 New"}</span>
      </Link>

      {/* Sound Alert Toggle */}
      <button
        type="button"
        onClick={onToggleSound}
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
          soundEnabled
            ? "bg-warm text-olive border-olive/30 hover:border-olive shadow-xs"
            : "bg-mist/40 text-ink/40 border-mist hover:text-ink"
        }`}
        title={soundEnabled ? "Reservation Sound: ON (Click to mute)" : "Reservation Sound: MUTED (Click to turn on)"}
      >
        {soundEnabled ? (
          <>
            <Bell className="w-3.5 h-3.5 text-gold" />
            <span className="hidden md:inline">Alert Sound: On</span>
          </>
        ) : (
          <>
            <BellOff className="w-3.5 h-3.5 text-ink/40" />
            <span className="hidden md:inline">Alert Sound: Muted</span>
          </>
        )}
      </button>

      {/* Test Chime Button */}
      <button
        type="button"
        onClick={onTestChime}
        disabled={isTestPlaying}
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-mist transition-all ${
          isTestPlaying
            ? "bg-gold text-olive border-gold shadow-sm"
            : "bg-warm text-ink/70 hover:text-olive hover:border-olive/40 hover:bg-white"
        }`}
        title="Play a test spa chime to verify your speakers"
      >
        <Volume2 className={`w-3.5 h-3.5 ${isTestPlaying ? "animate-spin" : "text-olive"}`} />
        <span className="hidden lg:inline">{isTestPlaying ? "Playing..." : "Test Chime"}</span>
      </button>

      {/* Desktop Notification Request (if not yet granted) */}
      {!desktopNotifAllowed && typeof window !== "undefined" && "Notification" in window && (
        <button
          type="button"
          onClick={onRequestDesktopNotifs}
          className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-mist/60 hover:bg-mist text-ink/70 hover:text-olive border border-mist transition-colors"
          title="Enable system desktop alerts when tab is in background"
        >
          <Sparkles className="w-3 h-3 text-gold" />
          <span>Desktop Alerts</span>
        </button>
      )}
    </div>
  );
}
