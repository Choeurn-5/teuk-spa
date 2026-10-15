"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

interface PhilosophyItem {
  src: string;
  alt: string;
  caption: string;
  badge: string;
}

const PHILOSOPHY_PHOTOS: PhilosophyItem[] = [
  {
    src: "/images/home-page/home-Philosophy-1.jpg",
    alt: "Hand-harvested Cambodian lemongrass, wild ginger, fresh turmeric, and kaffir lime",
    caption: "Sacred Roots, Lemongrass & Prairie Turmeric",
    badge: "✦ 100% Local Botanicals",
  },
  {
    src: "/images/home-page/home-Philosophy-2.jpg",
    alt: "Artisanal pink mineral body scrub, sliced fresh kaffir lime, and warm linens",
    caption: "Himalayan Pink Salt & Fresh Kaffir Lime Polish",
    badge: "✦ Handcrafted Daily",
  },
  {
    src: "/images/home-page/home-Philosophy-3.jpg",
    alt: "Ceramic lotus essential oil jars, crushed rice powders, and restorative herbal pastes",
    caption: "Organic Rice Scrubs & Pure Botanical Oils",
    badge: "✦ Pure Healing Traditions",
  },
];

export function PhilosophyFadeGallery() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth crossfade rotation every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % PHILOSOPHY_PHOTOS.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const photo = PHILOSOPHY_PHOTOS[current];

  return (
    <div
      className="relative group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Natural Botanical Preparations"
    >
      {/* ─── 1. GOLD DECORATIVE ACCENT FRAMES ─── */}
      <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border border-[#C9A84C]/50 transition-all duration-700 group-hover:border-[#C9A84C] group-hover:-top-5 group-hover:-left-5 pointer-events-none" />
      <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 rounded-2xl border border-[#7A8C6E]/30 pointer-events-none hidden sm:block" />

      {/* ─── 2. MAIN IMAGE CONTAINER WITH PURE FADE CROSS-DISSOLVE ─── */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(74,82,64,0.18)] bg-[#1A1D17]">
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority={current === 0}
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient subtle vignette for visual richness */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/15 to-black/25 pointer-events-none" />

        {/* Floating top badge */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={photo.badge}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1D17]/85 border border-[#C9A84C]/60 backdrop-blur-md shadow-lg"
            >
              <Sparkles className="w-3 h-3 text-[#C9A84C]" />
              <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#FAF7F2]">
                {photo.badge}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom caption with gold hairline & counter */}
        <div className="absolute bottom-4 inset-x-4 z-10">
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#141612]/75 backdrop-blur-md border border-white/10 shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#C9A84C] font-mono">
                Botanical Ritual 0{current + 1} / 0{PHILOSOPHY_PHOTOS.length}
              </span>

              {/* Step indicator dots */}
              <div className="flex items-center gap-1.5">
                {PHILOSOPHY_PHOTOS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                      idx === current
                        ? "w-6 bg-[#C9A84C]"
                        : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={photo.caption}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.5 }}
                className="text-xs sm:text-sm font-light text-[#FAF7F2] tracking-wide"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {photo.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── 3. INTERACTIVE MINI THUMBNAIL SELECTORS UNDER IMAGE ─── */}
      <div className="flex items-center gap-3 mt-4 px-1">
        {PHILOSOPHY_PHOTOS.map((item, idx) => {
          const isActive = idx === current;
          return (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`group/thumb relative flex-1 aspect-[4/3] rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer shadow-md ${
                isActive
                  ? "border-[#C9A84C] ring-2 ring-[#C9A84C]/40 scale-[1.03]"
                  : "border-[#E8E4DC] opacity-65 hover:opacity-100 hover:border-[#7A8C6E]"
              }`}
              aria-label={`Select ${item.caption}`}
            >
              <Image
                src={item.src}
                alt={item.caption}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover/thumb:scale-110"
                sizes="120px"
              />
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isActive ? "bg-transparent" : "bg-black/25 group-hover/thumb:bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
