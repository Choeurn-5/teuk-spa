"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export interface HeroSlideItem {
  image: string;
  tag?: string;
  tagline?: string;
  heading: string;
  headingItalic: string;
  description?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

const DEFAULT_SLIDES: HeroSlideItem[] = [
  {
    image: "/images/home-page/home-hero-4.jpg",
    heading: "Sacred Water",
    headingItalic: "& Floral Hydrotherapy",
    primaryCta: { label: "Book Sanctuary Ritual", href: "/book" },
  },
  {
    image: "/images/home-page/home-hero-1.jpg",
    heading: "Authentic Khmer",
    headingItalic: "Hospitality & Care",
    primaryCta: { label: "Reserve Appointment", href: "/book" },
  },
  {
    image: "/images/home-page/home-hero-2.jpg",
    heading: "Traditional Khmer",
    headingItalic: "Bodywork Therapy",
    primaryCta: { label: "Book Body Therapy", href: "/book" },
  },
  {
    image: "/images/home-page/home-hero-3.jpg",
    heading: "Steamed Herbal",
    headingItalic: "Compress & Healing",
    primaryCta: { label: "Book Herbal Ritual", href: "/book" },
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
      className="relative h-screen min-h-[680px] lg:min-h-[780px] w-full overflow-hidden bg-[#0F110D] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Teuk Spa Showcase"
    >
      {/* ─── 1. FULL BLEED SLIDE BACKGROUNDS (NATURAL & VIBRANT) ─── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <div className="relative w-full h-full animate-kenburns overflow-hidden">
            <Image
              src={slide.image}
              alt={`${slide.heading} — Teuk Massage & Spa`}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ─── 2. ULTRA-LIGHT MINIMAL OVERLAY (Crystal clear background photo, gentle top contrast for navbar) ─── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-transparent to-black/25 pointer-events-none" />

      {/* ─── 3. MAIN HERO CONTENT: PURE TITLE & LUXURY BUTTON ─── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto pt-10 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* Grand Cormorant Serif Heading */}
            <h1
              className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#FAF7F2] leading-[1.05] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-light"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              {slide.heading}
              <br />
              <span className="italic font-normal text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
                {slide.headingItalic}
              </span>
            </h1>

            {/* Single Elegant Luxury CTA Button */}
            <div className="mt-8 sm:mt-10">
              <Link
                href={slide.primaryCta?.href || "/book"}
                className="relative group inline-flex items-center gap-3 overflow-hidden px-9 py-4 rounded-full text-xs font-semibold tracking-[0.22em] uppercase text-[#141612] transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_35px_rgba(201,168,76,0.65)] hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#C9A84C] via-[#F4E5BD] to-[#C9A84C]" />
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                <span className="relative z-10 flex items-center gap-2.5">
                  <span>{slide.primaryCta?.label || "Book Your Ritual"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── 4. SLIDE NAVIGATION CHEVRONS (DESKTOP) ─── */}
      <div className="hidden sm:flex absolute inset-y-0 left-4 lg:left-8 z-20 items-center">
        <button
          onClick={prevSlide}
          className="w-11 h-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-[#C9A84C] hover:border-[#C9A84C]/80 hover:bg-black/60 transition-all duration-300 focus:outline-none group shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>
      </div>

      <div className="hidden sm:flex absolute inset-y-0 right-4 lg:right-8 z-20 items-center">
        <button
          onClick={nextSlide}
          className="w-11 h-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-[#C9A84C] hover:border-[#C9A84C]/80 hover:bg-black/60 transition-all duration-300 focus:outline-none group shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* ─── 5. MINIMAL SLIDE INDICATORS (DISCREET GLASS PILL) ─── */}
      <div className="absolute bottom-8 sm:bottom-10 inset-x-0 z-20 flex justify-center">
        <div className="flex items-center gap-2 sm:gap-3 bg-black/35 backdrop-blur-md px-4 sm:px-5 py-2 rounded-full border border-white/15 shadow-xl">
          {activeSlides.map((s, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className="group relative flex items-center gap-2 text-left focus:outline-none py-1 px-1 cursor-pointer"
                aria-label={`Go to slide ${idx + 1}: ${s.heading}`}
              >
                <span
                  className={`text-[11px] font-mono tracking-wider transition-colors duration-300 ${
                    isActive
                      ? "text-[#C9A84C] font-semibold"
                      : "text-white/50 group-hover:text-white/80"
                  }`}
                >
                  0{idx + 1}
                </span>

                <div className="relative w-7 sm:w-12 h-[2px] bg-white/20 rounded-full overflow-hidden">
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
      </div>
    </section>
  );
}
