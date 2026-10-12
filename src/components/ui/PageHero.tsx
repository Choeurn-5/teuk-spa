"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

interface PageHeroProps {
  image: string;
  badge?: string;
  scriptTag: string;
  title: string;
  titleAccent?: string;
  description: string;
  heightClass?: string; // default h-screen min-h-[750px] lg:min-h-[820px]
  actions?: {
    primary?: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
  children?: React.ReactNode;
}

export function PageHero({
  image,
  badge = "✦ Teuk Sanctuary · Siem Reap",
  scriptTag,
  title,
  titleAccent,
  description,
  heightClass = "h-screen min-h-[750px] lg:min-h-[820px]",
  actions,
  children,
}: PageHeroProps) {
  return (
    <section
      className={`relative ${heightClass} w-full overflow-hidden bg-[#141612] flex items-center justify-center`}
    >
      {/* ─── BACKGROUND IMAGE WITH KEN BURNS LUXURY SLOW MOTION ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="relative w-full h-full animate-kenburns scale-105">
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>

      {/* ─── LUXURY MULTI-LAYERED GRADIENT OVERLAYS ─── */}
      {/* Top shadow for seamless contrast with navbar */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/85 via-black/45 to-black/75" />

      {/* Ambient radial gold warmth */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C9A84C]/10 via-transparent to-transparent pointer-events-none" />

      {/* Bottom fade into cream content */}
      <div className="absolute bottom-0 inset-x-0 h-40 z-[2] bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/45 to-transparent pointer-events-none" />

      {/* ─── FLOATING SANCTUARY BADGE ─── */}
      <div className="absolute top-28 lg:top-36 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181A14]/75 border border-[#C9A84C]/40 backdrop-blur-md shadow-lg animate-float"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-[#FAF7F2]">
            {badge}
          </span>
        </motion.div>
      </div>

      {/* ─── HERO EDITORIAL CONTENT (Centered in full-viewport) ─── */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          {/* Script Tagline */}
          <p
            className="text-2xl sm:text-3xl md:text-4xl text-[#DFC26D] mb-3 leading-none drop-shadow-md"
            style={{ fontFamily: "var(--font-pinyon), cursive" }}
          >
            {scriptTag}
          </p>

          {/* Main Title */}
          <h1
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#FAF7F2] leading-[1] mb-5 drop-shadow-lg font-light"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            {title}
            {titleAccent && (
              <>
                {" "}
                <span className="italic font-normal text-[#DFC26D]">
                  {titleAccent}
                </span>
              </>
            )}
          </h1>

          {/* Gold Hairline Divider with Diamond */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs">✦</span>
            <div className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>

          {/* Description */}
          <p className="max-w-2xl text-[#FAF7F2]/85 font-light text-sm sm:text-base md:text-lg leading-relaxed mb-8 drop-shadow">
            {description}
          </p>

          {/* Optional Action CTAs */}
          {actions && (
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
              {actions.primary && (
                <Link
                  href={actions.primary.href}
                  className="relative group overflow-hidden px-8 py-3.5 rounded-full text-xs font-semibold tracking-[0.22em] uppercase text-[#141612] transition-all duration-300 shadow-[0_4px_28px_rgba(201,168,76,0.35)] hover:shadow-[0_4px_36px_rgba(201,168,76,0.6)] hover:scale-105 active:scale-95"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#C9A84C] via-[#E8D494] to-[#C9A84C]" />
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{actions.primary.label}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              )}

              {actions.secondary && (
                <Link
                  href={actions.secondary.href}
                  className="rounded-full border border-white/40 bg-black/20 backdrop-blur-sm px-8 py-3.5 text-xs font-medium tracking-[0.22em] uppercase text-[#FAF7F2] transition-all duration-300 hover:border-[#C9A84C] hover:text-[#DFC26D] hover:bg-black/40 hover:scale-105"
                >
                  {actions.secondary.label}
                </Link>
              )}
            </div>
          )}

          {/* Extra Custom Children if any */}
          {children}
        </motion.div>
      </div>

      {/* ─── SCROLL INDICATOR PROMPT ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#C9A84C] font-light">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-[#C9A84C]/50 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-[#C9A84C]"
          />
        </div>
      </div>
    </section>
  );
}
