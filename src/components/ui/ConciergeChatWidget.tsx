"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, ChevronRight } from "lucide-react";

interface ChatOption {
  id: string;
  name: string;
  detail: string;
  href: string;
  iconBg: string;
  iconColor: string;
  type: "whatsapp" | "telegram";
}

const CHAT_OPTIONS: ChatOption[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    detail: "092 835 459 · Reception",
    href: "https://wa.me/85592835459",
    iconBg: "bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
    iconColor: "text-emerald-400",
    type: "whatsapp",
  },
  {
    id: "telegram-direct",
    name: "Telegram Direct",
    detail: "070 835 459 · Direct chat",
    href: "https://t.me/+85570835459",
    iconBg: "bg-[#C9A84C]/15 text-[#DFC26D] group-hover:bg-[#C9A84C] group-hover:text-[#141712]",
    iconColor: "text-[#DFC26D]",
    type: "telegram",
  },
  {
    id: "telegram-bot",
    name: "Telegram Booking Bot",
    detail: "@TeukSpaBookingBot · Menu & Slots",
    href: "https://t.me/TeukSpaBookingBot",
    iconBg: "bg-sky-500/15 text-sky-400 group-hover:bg-sky-500 group-hover:text-white",
    iconColor: "text-sky-400",
    type: "telegram",
  },
];

export function ConciergeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Hide on admin or telegram mini app routes
  const isHidden = pathname?.startsWith("/admin") || pathname?.startsWith("/telegram");

  // Close when clicking outside
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
      className="fixed bottom-20 right-4 lg:bottom-7 lg:right-7 z-50 select-none font-sans"
    >
      {/* ─── 1. CLEAN POPUP MENU (3 OPTIONS) ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute bottom-16 right-0 mb-2 w-[310px] sm:w-[330px] rounded-2xl bg-[#141712]/95 backdrop-blur-xl border border-[#C9A84C]/35 shadow-[0_20px_50px_rgba(0,0,0,0.65)] text-[#FAF7F2] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-serif text-sm tracking-wide text-[#FAF7F2]">
                  Chat with Concierge
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat menu"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 Clean Options */}
            <div className="p-2.5 space-y-1.5">
              {CHAT_OPTIONS.map((opt) => (
                <a
                  key={opt.id}
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
                >
                  {/* Clean Brand Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${opt.iconBg}`}
                  >
                    {opt.type === "whatsapp" ? (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.945z" />
                      </svg>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#FAF7F2] group-hover:text-[#DFC26D] transition-colors truncate">
                      {opt.name}
                    </p>
                    <p className="text-[11px] text-white/55 font-light truncate">
                      {opt.detail}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#DFC26D] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 2. PURE CHAT ICON FLOATING BUTTON ─── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#181B14] border border-[#C9A84C]/50 text-[#DFC26D] shadow-[0_10px_30px_rgba(0,0,0,0.55)] hover:border-[#C9A84C] hover:shadow-[0_10px_35px_rgba(201,168,76,0.35)] flex items-center justify-center transition-all duration-300 cursor-pointer relative"
        aria-label="Toggle chat options"
      >
        {/* Subtle Online Dot */}
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#181B14]" />

        {/* Swapping Icon with smooth transition */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-[#FAF7F2]" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-[#DFC26D]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
