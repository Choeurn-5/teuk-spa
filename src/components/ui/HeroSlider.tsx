"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

interface Slide {
  image: string;
  tag: string;
  tagline: string;
  heading: string;
  headingItalic: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const slides: Slide[] = [
  {
    image: "/images/defaults/spa_hero.jpg",
    tag: "✦ Sanctuary in Siem Reap",
    tagline: "Sacred Water & Serenity",
    heading: "Teuk Massage",
    headingItalic: "& Ancient Spa",
    description:
      "Ancient Khmer healing arts reimagined for the discerning traveller. Step inside our tranquil sanctuary and let the healing waters carry you home.",
    primaryCta: { label: "Book Your Escape", href: "/book" },
    secondaryCta: { label: "Discover Treatments", href: "/treatments" },
  },
  {
    image: "/images/defaults/aromatherapy.jpg",
    tag: "✦ Aromatic Alchemy",
    tagline: "Hand-Blended Cambodian Botanicals",
    heading: "Jasmine & Lemongrass",
    headingItalic: "Sensory Journey",
    description:
      "Warm essential oils hand-pressed from wild Cambodian flora, worked deep into tired muscles with slow, meditative strokes that dissolve all tension.",
    primaryCta: { label: "Explore Rituals", href: "/treatments" },
    secondaryCta: { label: "Reserve Appointment", href: "/book" },
  },
  {
    image: "/images/defaults/herbal_compress.jpg",
    tag: "✦ 800-Year Healing Legacy",
    tagline: "Sacred Herbology",
    heading: "Khmer Herbal",
    headingItalic: "Compress Therapy",
    description:
      "Steamed bundles of sacred lemongrass, kaffir lime, turmeric, and camphor pressed along energy meridians to awaken natural vitality.",
    primaryCta: { label: "View Herbal Therapy", href: "/treatments" },
    secondaryCta: { label: "Reserve Treatment", href: "/book" },
  },
  {
    image: "/images/defaults/spa_package.jpg",
    tag: "✦ Complete Transformation",
    tagline: "Immersive Half-Day Rituals",
    heading: "Holistic Rebirth",
    headingItalic: "& Couple Packages",
    description:
      "Indulgent multi-hour journeys combining foot purification, organic botanical body polishes, hot basalt stone massage, and herbal teas.",
    primaryCta: { label: "Explore Packages", href: "/packages" },
    secondaryCta: { label: "Reserve Package", href: "/book" },
  },
];

export function HeroSlider({ images }: { images?: string[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance slides every 7 seconds when not paused
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, current]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[current];

  return (
    <section
      className="relative h-screen min-h-[750px] lg:min-h-[820px] w-full overflow-hidden bg-[#141612]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Teuk Spa Showcase"
    >
      {/* ─── SLIDE BACKGROUND IMAGES WITH KEN BURNS ─── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <div className="relative w-full h-full animate-kenburns overflow-hidden">
            <Image
              src={images?.[current] || slide.image}
              alt={`${slide.heading} — Teuk Massage & Spa`}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ─── ATMOSPHERIC LUXURY GRADIENT OVERLAYS ─── */}
      {/* Top shadow for seamless contrast with navbar */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/85 via-black/40 to-black/75" />

      {/* Center radial glow for editorial drama */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C9A84C]/10 via-transparent to-transparent pointer-events-none" />

      {/* Bottom fade into cream content */}
      <div className="absolute bottom-0 inset-x-0 h-32 z-[2] bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/40 to-transparent" />

      {/* ─── FLOATING LUXURY SANCTUARY BADGE ─── */}
      <div className="absolute top-28 lg:top-36 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181A14]/70 border border-[#C9A84C]/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] animate-float"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-[#FAF7F2]">
            {slide.tag}
          </span>
        </motion.div>
      </div>

      {/* ─── MAIN HERO CONTENT ─── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* Script Tagline */}
            <p
              className="text-2xl sm:text-3xl md:text-4xl text-[#DFC26D] mb-3 leading-none drop-shadow-md"
              style={{ fontFamily: "var(--font-pinyon), cursive" }}
            >
              {slide.tagline}
            </p>

            {/* Main Editorial Heading */}
            <h1
              className="font-serif text-4xl sm:text-6xl md:text-8xl tracking-tight text-[#FAF7F2] leading-[0.96] mb-6 drop-shadow-lg font-light"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              {slide.heading}
              <br />
              <span className="italic font-normal text-[#FAF7F2]/90">
                {slide.headingItalic}
              </span>
            </h1>

            {/* Gold Hairline Divider with Diamond */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs">✦</span>
              <div className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#C9A84C]" />
            </div>

            {/* Subtext */}
            <p className="max-w-xl text-[#FAF7F2]/80 font-light text-sm sm:text-base md:text-lg leading-relaxed mb-10 drop-shadow">
              {slide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link
                href={slide.primaryCta.href}
                className="relative group overflow-hidden px-8 py-3.5 rounded-full text-xs font-semibold tracking-[0.22em] uppercase text-[#141612] transition-all duration-300 shadow-[0_4px_28px_rgba(201,168,76,0.35)] hover:shadow-[0_4px_36px_rgba(201,168,76,0.6)] hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#C9A84C] via-[#E8D494] to-[#C9A84C]" />
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <span className="relative z-10 flex items-center gap-2">
                  <span>{slide.primaryCta.label}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href={slide.secondaryCta.href}
                className="rounded-full border border-white/40 bg-black/20 backdrop-blur-sm px-8 py-3.5 text-xs font-medium tracking-[0.22em] uppercase text-[#FAF7F2] transition-all duration-300 hover:border-[#C9A84C] hover:text-[#DFC26D] hover:bg-black/40 hover:scale-105"
              >
                {slide.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── SLIDE CONTROLS: PREV / NEXT CHEVRONS ─── */}
      <div className="absolute inset-y-0 left-4 sm:left-8 z-20 flex items-center">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-[#C9A84C] hover:border-[#C9A84C]/60 hover:bg-black/60 transition-all duration-300 focus:outline-none group shadow-lg"
          aria-label="Previous sanctuary experience"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-4 sm:right-8 z-20 flex items-center">
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-[#C9A84C] hover:border-[#C9A84C]/60 hover:bg-black/60 transition-all duration-300 focus:outline-none group shadow-lg"
          aria-label="Next sanctuary experience"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* ─── BOTTOM SLIDE INDICATORS WITH TIMED PROGRESS BARS ─── */}
      <div className="absolute bottom-10 inset-x-0 z-20 flex flex-col items-center gap-4">
        {/* Navigation Pips / Progress Bars */}
        <div className="flex items-center gap-3 bg-[#12140F]/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-xl">
          {slides.map((s, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className="group relative flex items-center gap-2 text-left focus:outline-none py-1"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span
                  className={`text-[10px] font-mono tracking-wider transition-colors duration-300 ${
                    isActive ? "text-[#C9A84C] font-bold" : "text-white/40 group-hover:text-white/80"
                  }`}
                >
                  0{idx + 1}
                </span>

                <div className="relative w-8 sm:w-12 h-[2px] bg-white/20 rounded-full overflow-hidden">
                  {isActive && (
                    <motion.div
                      key={`progress-${current}-${isPaused}`}
                      initial={{ width: "0%" }}
                      animate={{ width: isPaused ? "100%" : "100%" }}
                      transition={{
                        duration: isPaused ? 0 : 7,
                        ease: "linear",
                      }}
                      className="absolute inset-y-0 left-0 bg-[#C9A84C]"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
