"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  Send,
  User,
  X,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface ChatOption {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  href: string;
  icon: "whatsapp" | "telegram-bot" | "telegram-user";
  themeColor: {
    badgeBg: string;
    badgeText: string;
    borderHover: string;
    iconBg: string;
    iconColor: string;
  };
}

const CHAT_OPTIONS: ChatOption[] = [
  {
    id: "whatsapp",
    title: "WhatsApp Reception",
    subtitle: "Instant chat with reception for inquiries & fast booking",
    badge: "Direct Chat",
    href: "https://wa.me/8551770835459",
    icon: "whatsapp",
    themeColor: {
      badgeBg: "bg-emerald-500/15",
      badgeText: "text-emerald-300",
      borderHover: "hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/15 border-emerald-500/30",
      iconColor: "text-emerald-400",
    },
  },
  {
    id: "telegram-bot",
    title: "Telegram Booking Bot",
    subtitle: "Open our Telegram Mini App to browse menu & reserve slots",
    badge: "Mini App Bot",
    href: "https://t.me/TeukSpaBookingBot",
    icon: "telegram-bot",
    themeColor: {
      badgeBg: "bg-sky-500/15",
      badgeText: "text-sky-300",
      borderHover: "hover:border-sky-500/50",
      iconBg: "bg-sky-500/15 border-sky-500/30",
      iconColor: "text-sky-400",
    },
  },
  {
    id: "telegram-manager",
    title: "Telegram Concierge",
    subtitle: "Direct message to @SanpeterHARI for VIP assistance",
    badge: "@SanpeterHARI",
    href: "https://t.me/SanpeterHARI",
    icon: "telegram-user",
    themeColor: {
      badgeBg: "bg-[#C9A84C]/15",
      badgeText: "text-[#DFC26D]",
      borderHover: "hover:border-[#C9A84C]/60",
      iconBg: "bg-[#C9A84C]/15 border-[#C9A84C]/30",
      iconColor: "text-[#DFC26D]",
    },
  },
];

export function ConciergeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Hide on admin or telegram mini app pages
  const isHidden = pathname?.startsWith("/admin") || pathname?.startsWith("/telegram");

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isHidden) return null;

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-50 select-none font-jost"
    >
      {/* ─── 1. POPUP CHAT MODAL ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 16 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 26,
            }}
            className="absolute bottom-16 right-0 mb-2 w-[90vw] max-w-[360px] sm:max-w-[390px] rounded-3xl bg-[#141712]/95 backdrop-blur-2xl border border-[#C9A84C]/40 shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-[#FAF7F2] overflow-hidden"
          >
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative p-5 pb-4 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar with pulsing online dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8C702E] flex items-center justify-center text-[#141712] shadow-md font-serif font-bold text-lg">
                      T
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#141712] shadow-sm animate-pulse" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif text-lg font-normal text-[#FAF7F2] tracking-tight">
                        Teuk Spa Concierge
                      </h3>
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                    </div>
                    <p className="text-[11px] text-emerald-400 font-light flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Receptionist Online • 9AM – 12AM
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
                  aria-label="Close concierge options"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="mt-3 text-xs text-white/70 font-light leading-relaxed">
                Step inside our sanctuary. Choose how you would like to connect with our team:
              </p>
            </div>

            {/* Options List */}
            <div className="p-4 space-y-2.5">
              {CHAT_OPTIONS.map((opt) => (
                <a
                  key={opt.id}
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 ${opt.themeColor.borderHover} hover:bg-white/[0.07] transition-all duration-300 shadow-sm cursor-pointer`}
                >
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${opt.themeColor.iconBg} ${opt.themeColor.iconColor} transition-transform duration-300 group-hover:scale-105`}
                  >
                    {opt.icon === "whatsapp" && <MessageCircle className="w-5 h-5" strokeWidth={1.8} />}
                    {opt.icon === "telegram-bot" && <Send className="w-4 h-4" strokeWidth={1.8} />}
                    {opt.icon === "telegram-user" && <User className="w-5 h-5" strokeWidth={1.8} />}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-medium text-sm text-[#FAF7F2] group-hover:text-[#DFC26D] transition-colors truncate">
                        {opt.title}
                      </span>
                      <span
                        className={`text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-full font-mono ${opt.themeColor.badgeBg} ${opt.themeColor.badgeText} flex-shrink-0`}
                      >
                        {opt.badge}
                      </span>
                    </div>

                    <p className="text-[11.5px] text-white/60 font-light leading-snug line-clamp-2">
                      {opt.subtitle}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex-shrink-0 self-center text-white/30 group-hover:text-[#C9A84C] group-hover:translate-x-0.5 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </a>
              ))}
            </div>

            {/* Footer Notice */}
            <div className="px-5 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-white/45">
              <span>Siem Reap Sanctuary • Pakambor St</span>
              <span className="text-[#C9A84C]/70">No Prepayment Required</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 2. FLOATING TRIGGER BUTTON (FAB) ─── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        className="relative group flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-[#181B14] border border-[#C9A84C]/50 text-[#FAF7F2] shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-[#C9A84C] transition-all duration-300 cursor-pointer overflow-hidden"
        aria-label="Open chat concierge"
      >
        {/* Shimmer effect */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Ambient pulse halo */}
        <span className="absolute -inset-1 rounded-full bg-[#C9A84C]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Online Dot Ping */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[#181B14]" />
        </span>

        {/* Icon (swaps between MessageCircle and X) */}
        <div className="relative text-[#DFC26D]">
          {isOpen ? (
            <X className="w-5 h-5 transition-transform" />
          ) : (
            <MessageCircle className="w-5 h-5 transition-transform" />
          )}
        </div>

        {/* Label (Desktop only) */}
        <span className="relative hidden sm:inline-block text-xs font-medium uppercase tracking-[0.2em] text-[#FAF7F2] group-hover:text-[#DFC26D] transition-colors pr-1">
          {isOpen ? "Close" : "Concierge"}
        </span>
      </motion.button>
    </div>
  );
}
