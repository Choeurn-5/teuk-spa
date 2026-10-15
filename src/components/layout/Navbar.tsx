"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Phone, MessageCircle, ArrowRight, X, Sparkles, MapPin, Clock } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Treatment", href: "/treatments" },
  { label: "Package", href: "/packages" },
  { label: "Our Story", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide on admin portal or telegram mini app
  const isHidden = pathname.startsWith("/admin") || pathname.startsWith("/telegram");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isHidden) {
    return null;
  }

  const isHeroPage = [
    "/",
    "/about",
    "/treatments",
    "/packages",
    "/gallery",
    "/contact",
    "/gift-vouchers",
  ].includes(pathname);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-[#141612]/92 backdrop-blur-xl border-b border-[#C9A84C]/25 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
          : isHeroPage
            ? "bg-gradient-to-b from-black/85 via-black/40 to-transparent"
            : "bg-[#141612]/95 backdrop-blur-md border-b border-[#C9A84C]/20 shadow-md"
          }`}
      >
        {/* ─── 1. ATMOSPHERE MICRO TOP-LINE (Collapses on Scroll) ─── */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-b border-white/[0.08]"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-10 h-9 flex items-center justify-between text-[10px] tracking-[0.22em] uppercase font-light text-white/70">
                {/* Location & Schedule */}
                <div className="flex items-center gap-2">
                  <span className="text-[#C9A84C]">✦</span>
                  <span>Siem Reap, Cambodia</span>
                  <span className="text-white/30 hidden sm:inline">|</span>
                  <span className="hidden sm:inline text-white/50">Daily 10:00 AM – 10:00 PM</span>
                </div>

                {/* Subtitle / Philosophy */}
                <div className="hidden lg:block italic font-serif tracking-[0.15em] text-white/50 text-[11px] normal-case">
                  Sacred Khmer Healing &amp; Botanical Alchemy
                </div>

                {/* Concierge & WhatsApp */}
                <div className="flex items-center gap-4">
                  <a
                    href="https://wa.me/8551770835459"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#C9A84C] transition-colors"
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C9A84C]" />
                    </span>
                    <span>Concierge</span>
                  </a>
                  <span className="text-white/30">|</span>
                  <a
                    href="tel:+8551770835459"
                    className="hover:text-[#C9A84C] transition-colors"
                  >
                    +855 17 708 354 59
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── 2. MAIN SANCTUARY NAVIGATION BAR ─── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "h-20" : "h-24"
              }`}
          >
            {/* BRAND LOGO */}
            <Link
              href="/"
              className="flex items-center gap-3 group cursor-pointer focus:outline-none py-1"
            >
              <div className="relative h-12 md:h-14 w-auto flex items-center">
                <Image
                  src="/images/brand/logo.png"
                  alt="Teuk Spa Beauty - ទឹកស្ប៉ា"
                  width={160}
                  height={118}
                  priority
                  className="h-10 md:h-12 w-auto object-contain brightness-100 group-hover:brightness-110 group-hover:scale-105 transition-all duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                />
              </div>
            </Link>

            {/* DESKTOP MENU LINKS */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map(({ label, href }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative px-4 py-2 text-[11.5px] uppercase tracking-[0.22em] font-medium transition-all duration-300 group ${active
                      ? "text-[#DFC26D]"
                      : "text-[#FAF7F2]/75 hover:text-[#FAF7F2]"
                      }`}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      {label}
                    </span>

                    {/* Active Golden Glow Underline */}
                    {active ? (
                      <motion.span
                        layoutId="nav-glow-underline"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent shadow-[0_0_12px_rgba(201,168,76,0.9)]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    ) : (
                      <span className="absolute bottom-0 left-1/2 right-1/2 h-[1px] bg-[#C9A84C]/50 transition-all duration-300 group-hover:left-3 group-hover:right-3 group-hover:opacity-100 opacity-0" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT SIDE: CONCIERGE & RESERVE CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/book"
                className="relative group overflow-hidden px-6 py-2.5 rounded-full text-[11px] uppercase tracking-[0.22em] font-semibold transition-all duration-500 shadow-[0_4px_20px_rgba(201,168,76,0.25)] hover:shadow-[0_4px_28px_rgba(201,168,76,0.5)] hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Satin Champagne Gold Gradient */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#C9A84C] via-[#E5CE85] to-[#C9A84C] transition-transform duration-500 group-hover:brightness-105" />

                {/* Shimmer sweep reflection */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Label & icon */}
                <span className="relative z-10 text-[#141612] flex items-center gap-2">
                  <span>Reserve</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#141612] transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>

            {/* MOBILE ARCHITECTURAL HAMBURGER TOGGLE */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden relative p-3 flex flex-col items-end justify-center gap-1.5 focus:outline-none group"
              aria-label="Open Sanctuary Menu"
            >
              <span className="w-6 h-[1.5px] bg-[#FAF7F2] transition-all duration-300 group-hover:bg-[#C9A84C]" />
              <span className="w-4 h-[1.5px] bg-[#C9A84C] transition-all duration-300 group-hover:w-6" />
            </button>
          </div>
        </div>

        {/* Delicate Golden Hairline along bottom */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
      </header>

      {/* ─── 3. MOBILE FULLSCREEN SANCTUARY DRAWER ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sanctuary-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="sanctuary-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-[#12140F] border-l border-[#C9A84C]/30 text-[#FAF7F2] flex flex-col justify-between overflow-y-auto shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-6 sm:p-8 flex items-center justify-between border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/brand/logo.png"
                    alt="Teuk Spa"
                    width={130}
                    height={95}
                    className="h-10 w-auto object-contain drop-shadow"
                  />
                </div>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-[#C9A84C]/60 flex items-center justify-center text-white/70 hover:text-[#C9A84C] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="px-8 py-8 flex-1 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C9A84C] font-semibold mb-6 block">
                  ✦ The Sanctuary
                </span>

                <nav className="flex flex-col space-y-1">
                  {navLinks.map(({ label, href }, index) => {
                    const active = pathname === href;
                    const romanNumerals = ["I", "II", "III", "IV", "V", "VI"];
                    return (
                      <motion.div
                        key={href}
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index, duration: 0.4 }}
                      >
                        <Link
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className={`group flex items-baseline justify-between py-3.5 border-b border-white/[0.06] transition-all duration-300 ${active ? "text-[#C9A84C]" : "text-[#FAF7F2]/80 hover:text-white"
                            }`}
                        >
                          <div className="flex items-baseline gap-3">
                            <span className="font-serif text-xs text-[#C9A84C]/60 italic w-5">
                              {romanNumerals[index]}.
                            </span>
                            <span className="font-serif text-2xl tracking-wide group-hover:translate-x-1 transition-transform">
                              {label}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#C9A84C]" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Concierge Card & CTA */}
              <div className="p-6 sm:p-8 bg-[#161813] border-t border-[#C9A84C]/20 space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="tel:+8551770835459"
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-white/10 hover:border-[#C9A84C]/50 bg-white/[0.02] text-xs uppercase tracking-wider text-white/80 hover:text-[#C9A84C] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>Call Us</span>
                  </a>

                  <a
                    href="https://wa.me/8551770835459"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-white/10 hover:border-[#C9A84C]/50 bg-white/[0.02] text-xs uppercase tracking-wider text-white/80 hover:text-[#C9A84C] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <Link
                  href="/book"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-r from-[#C9A84C] via-[#E5CE85] to-[#C9A84C] text-[#141612] text-xs uppercase tracking-[0.25em] font-semibold shadow-[0_4px_24px_rgba(201,168,76,0.3)] hover:brightness-105 transition-all"
                >
                  <span>Reserve an Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-between text-[10px] tracking-[0.15em] uppercase text-white/40 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C9A84C]/70" />
                    Pakambor St, Siem Reap
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#C9A84C]/70" />
                    10 AM – 10 PM
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
