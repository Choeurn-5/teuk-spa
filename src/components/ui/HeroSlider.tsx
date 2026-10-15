"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export interface HeroSlideItem {
  image: string;
  tag: string;
  tagline: string;
  heading: string;
  headingItalic: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const DEFAULT_SLIDES: HeroSlideItem[] = [
  {
    image: "/images/home-page/home-hero-4.jpg",
    tag: "✦ Sacred Water Sanctuary",
    tagline: "Teuk — The Ancient Element of Purity",
    heading: "Sacred Water",
    headingItalic: "& Floral Hydrotherapy",
    description:
      "Immerse in warm botanicals, floating lotuses, and therapeutic waters. An ancient Khmer bathing tradition designed to dissolve fatigue and awaken inner stillness.",
    primaryCta: { label: "Book Sanctuary Ritual", href: "/book" },
    secondaryCta: { label: "Explore Treatments", href: "/treatments" },
  },
  {
    image: "/images/home-page/home-hero-1.jpg",
    tag: "✦ Siem Reap Sanctuary",
    tagline: "Warmth, Grace & Mindful Touch",
    heading: "Authentic Khmer",
    headingItalic: "Hospitality & Care",
    description:
      "Step inside our teakwood haven where every traveler is welcomed with heartfelt warmth. Certified master therapists trained in ancient healing traditions.",
    primaryCta: { label: "Reserve Appointment", href: "/book" },
    secondaryCta: { label: "Our Story & Sanctuary", href: "/about" },
  },
  {
    image: "/images/home-page/home-hero-2.jpg",
    tag: "✦ Time-Honored Healing Arts",
    tagline: "Passed Down Through Generations",
    heading: "Traditional Khmer",
    headingItalic: "Bodywork Therapy",
    description:
      "Restore natural energy balance after wandering Angkor's temples. Rhythmic acupressure and gentle passive stretches dissolve deep muscle tension.",
    primaryCta: { label: "View Body Therapy", href: "/treatments" },
    secondaryCta: { label: "Reserve Your Slot", href: "/book" },
  },
  {
    image: "/images/defaults/herbal_compress.jpg",
    tag: "✦ Sacred Cambodian Botanicals",
    tagline: "800-Year Herbal Alchemy",
    heading: "Steamed Herbal",
    headingItalic: "Compress & Packages",
    description:
      "Handmade pouches of prairie turmeric, wild kaffir lime, and fragrant lemongrass pressed along energy meridians to revive tired bodies and souls.",
    primaryCta: { label: "Explore Packages", href: "/packages" },
    secondaryCta: { label: "Reserve Experience", href: "/book" },
  },
];

interface HeroSliderProps {
  images?: string[];
  slides?: HeroSlideItem[];
}

export function HeroSlider({ images, slides: customSlides }: HeroSliderProps) {
  // Construct dynamic slide list combining custom slides or images with defaults
  const activeSlides: HeroSlideItem[] = customSlides || DEFAULT_SLIDES.map((slide, idx) => ({
    ...slide,
    image: images?.[idx] || slide.image,
  }));

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  // Auto-advance slides every 6.5s when not paused
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard navigation (Left / Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slide = activeSlides[current] || activeSlides[0];

  return (
    <section
      className="relative h-screen min-h-[760px] lg:min-h-[850px] w-full overflow-hidden bg-[#0F110D] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Teuk Spa Showcase"
    >
      {/* ─── 1. FULL BLEED SLIDE BACKGROUNDS WITH KEN BURNS ─── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <div className="relative w-full h-full animate-kenburns overflow-hidden">
            <Image
              src={slide.image}
              alt={`${slide.heading} — Teuk Massage & Spa`}
              fill
              priority
              className="object-cover object-center filter brightness-[0.88]"
              sizes="100vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ─── 2. ATMOSPHERIC CINEMATIC OVERLAYS ─── */}
      {/* Top shadow for crisp navbar contrast */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/85 via-black/35 to-black/80" />

      {/* Radial warmth centered behind typography */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.5)_0%,_rgba(0,0,0,0.2)_50%,_rgba(0,0,0,0.7)_100%)] pointer-events-none" />

      {/* Subtle gold radiance shimmer */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,_rgba(201,168,76,0.12),_transparent_70%)] pointer-events-none" />

      {/* Bottom fade into page cream background */}
      <div className="absolute bottom-0 inset-x-0 h-36 z-[2] bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/40 to-transparent pointer-events-none" />

      {/* ─── 3. FLOATING SANCTUARY BADGE ─── */}
      <div className="absolute top-28 lg:top-36 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <motion.div
          key={`badge-${current}`}
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-[#141712]/80 border border-[#C9A84C]/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] animate-float"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#DFC26D]" />
          <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-[#FAF7F2]">
            {slide.tag}
          </span>
        </motion.div>
      </div>

      {/* ─── 4. MAIN EDITORIAL HERO CONTENT ─── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto pt-16 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* Elegant Script Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl text-[#DFC26D] mb-3 leading-none drop-shadow-md"
              style={{ fontFamily: "var(--font-pinyon), cursive" }}
            >
              {slide.tagline}
            </motion.p>

            {/* Grand Cormorant Serif Heading */}
            <h1
              className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#FAF7F2] leading-[1.0] mb-5 drop-shadow-xl font-light"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              {slide.heading}
              <br />
              <span className="italic font-normal text-[#FAF7F2]/95">
                {slide.headingItalic}
              </span>
            </h1>

            {/* Gold Hairline Divider with Diamond Motif */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs">✦</span>
              <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[#C9A84C]" />
            </div>

            {/* Refined Descriptive Subtext */}
            <p className="max-w-xl text-[#FAF7F2]/90 font-light text-sm sm:text-base md:text-lg leading-relaxed mb-9 drop-shadow">
              {slide.description}
            </p>

            {/* Luxury Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link
                href={slide.primaryCta.href}
                className="relative group overflow-hidden px-8 py-3.5 rounded-full text-xs font-semibold tracking-[0.22em] uppercase text-[#141612] transition-all duration-300 shadow-[0_4px_30px_rgba(201,168,76,0.4)] hover:shadow-[0_4px_40px_rgba(201,168,76,0.7)] hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#C9A84C] via-[#EBD79B] to-[#C9A84C]" />
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                <span className="relative z-10 flex items-center gap-2">
                  <span>{slide.primaryCta.label}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href={slide.secondaryCta.href}
                className="rounded-full border border-white/40 bg-black/30 backdrop-blur-md px-8 py-3.5 text-xs font-medium tracking-[0.22em] uppercase text-[#FAF7F2] transition-all duration-300 hover:border-[#C9A84C] hover:text-[#DFC26D] hover:bg-black/50 hover:scale-105"
              >
                {slide.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── 5. SLIDE NAVIGATION CHEVRONS (DESKTOP) ─── */}
      <div className="hidden sm:flex absolute inset-y-0 left-4 lg:left-8 z-20 items-center">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-[#C9A84C] hover:border-[#C9A84C]/80 hover:bg-black/70 transition-all duration-300 focus:outline-none group shadow-xl"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>
      </div>

      <div className="hidden sm:flex absolute inset-y-0 right-4 lg:right-8 z-20 items-center">
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-[#C9A84C] hover:border-[#C9A84C]/80 hover:bg-black/70 transition-all duration-300 focus:outline-none group shadow-xl"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* ─── 6. INTERACTIVE SLIDE INDICATORS & PROGRESS BARS ─── */}
      <div className="absolute bottom-12 inset-x-0 z-20 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 sm:gap-3 bg-[#10130E]/75 backdrop-blur-md px-4 sm:px-6 py-2 rounded-full border border-white/15 shadow-2xl">
          {activeSlides.map((s, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className="group relative flex items-center gap-2 text-left focus:outline-none py-1.5 px-1 cursor-pointer"
                aria-label={`Go to slide ${idx + 1}: ${s.heading}`}
              >
                <span
                  className={`text-[11px] font-mono tracking-wider transition-colors duration-300 ${
                    isActive
                      ? "text-[#C9A84C] font-semibold"
                      : "text-white/40 group-hover:text-white/80"
                  }`}
                >
                  0{idx + 1}
                </span>

                <div className="relative w-8 sm:w-14 h-[2.5px] bg-white/20 rounded-full overflow-hidden">
                  {isActive && (
                    <motion.div
                      key={`progress-${current}-${isPaused}`}
                      initial={{ width: "0%" }}
                      animate={{ width: isPaused ? "100%" : "100%" }}
                      transition={{
                        duration: isPaused ? 0 : 6.5,
                        ease: "linear",
                      }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C9A84C] to-[#EBD79B]"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Sanctuary Info Strip */}
        <div className="hidden md:flex items-center gap-6 text-[11px] tracking-widest uppercase text-[#FAF7F2]/65 font-light">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#C9A84C]" />
            Daily 9:00 AM – 12:00 AM
          </span>
          <span className="text-[#C9A84C]/50">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#C9A84C]" />
            Siem Reap Old Market Area
          </span>
          <span className="text-[#C9A84C]/50">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#C9A84C]" />
            Certified Khmer Therapists
          </span>
        </div>
      </div>
    </section>
  );
}
