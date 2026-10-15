"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Maximize2,
  Users,
  Flame,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export interface SanctuaryRoom {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  titleItalic: string;
  subtitle: string;
  description: string;
  capacity: string;
  ambiance: string;
  idealFor: string;
  features: string[];
  mainImage: string;
  gallery: string[];
}

export const SANCTUARY_ROOMS: SanctuaryRoom[] = [
  {
    id: "vip-couple-suite",
    tabLabel: "VIP Couple Suite",
    badge: "✦ Private Sanctuary Suite",
    title: "The Royal Lotus",
    titleItalic: "VIP Couple Suite",
    subtitle: "Sunken Hydrotherapy & Twin Silk Sanctuary",
    description:
      "Our premier private haven designed for couples and multi-hour transformation packages. Immerse yourselves in a handcrafted sunken mosaic bath strewn with fresh lotus blossoms and floating candle flames, followed by synchronous bodywork on twin silk-adorned treatment beds beneath celestial sky lighting.",
    capacity: "1 – 2 Guests",
    ambiance: "Candlelight, warm mosaic bath, private music & cerulean sky ceiling",
    idealFor: "Couples Packages, Honeymoon Rituals, Full-Body Polish & Hydrotherapy",
    features: [
      "Sunken ceramic hydrotherapy bath with fresh lotus blossoms",
      "Twin luxury treatment beds draped in traditional silk",
      "Private en-suite changing, rain shower & vanity area",
      "Custom temperature, acoustic & aromatherapy controls",
    ],
    mainImage: "/images/rooms/0Y9A5252.jpg",
    gallery: [
      "/images/rooms/0Y9A5252.jpg",
      "/images/rooms/0Y9A5255.jpg",
    ],
  },
  {
    id: "teakwood-cabanas",
    tabLabel: "Private Cabana Suites",
    badge: "✦ Khmer Timber Architecture",
    title: "Private Teakwood",
    titleItalic: "Canopy Cabanas",
    subtitle: "Secluded Suites Above Flowing Waters",
    description:
      "Handcrafted from ancient Cambodian teak, each private cabana is framed by flowing royal blue acoustic drapes and rests gently above reflective water canals. Featuring hand-carved copper lotus fountains and illuminated floral alcoves, these suites provide unbroken serenity for holistic body therapies.",
    capacity: "Individual or Companions",
    ambiance: "Tranquil water canals, flowing royal blue drapery, warm wood scent",
    idealFor: "Traditional Khmer Massage, Aromatic Hot Stone, Herbal Compress",
    features: [
      "Heavy royal blue privacy drapery with sound-dampening velvet lining",
      "Carved copper lotus wall fountain with peaceful water trickle",
      "Plush memory-foam massage mattresses with crisp organic linens",
      "Handmade woven baskets for personal belongings & soft robes",
    ],
    mainImage: "/images/rooms/0Y9A5022.jpg",
    gallery: [
      "/images/rooms/0Y9A5022.jpg",
      "/images/rooms/0Y9A5023-1.jpg",
      "/images/rooms/0Y9A5023.jpg",
    ],
  },
  {
    id: "starlit-lounge",
    tabLabel: "Starlit Reflexology Lounge",
    badge: "✦ Celestial Stillness",
    title: "The Starlit Acupressure",
    titleItalic: "& Reflexology Hall",
    subtitle: "Fiber-Optic Sky & Ergonomic Wave Couches",
    description:
      "Surrender to deep stillness beneath hundreds of twinkling fiber-optic constellations on our vaulted ceiling. Recline on bespoke ergonomic wave-form white leather loungers while skilled therapists release tension through ancient foot reflexology, acupressure meridians, and head-and-shoulder relief.",
    capacity: "Individual or Small Groups",
    ambiance: "Starry starlight ceiling, illuminated moon niches, tempered glass floor",
    idealFor: "Foot Reflexology, Neck & Shoulder Acupressure, Head & Scalp Therapy",
    features: [
      "Vaulted galaxy ceiling with twinkling optical starlight and color therapy",
      "Ergonomic wave-form leather recliners with plush bolster support",
      "Tempered glass pathway suspended over illuminated river stone waters",
      "Circular illuminated wall niches featuring fresh botanical arrangements",
    ],
    mainImage: "/images/rooms/0Y9A5010.jpg",
    gallery: [
      "/images/rooms/0Y9A5010.jpg",
      "/images/rooms/0Y9A5008.jpg",
      "/images/rooms/0Y9A5003.jpg",
      "/images/rooms/0Y9A5011.jpg",
    ],
  },
  {
    id: "herbal-apothecary",
    tabLabel: "Herbal Apothecary Bar",
    badge: "✦ Sensory Consultation",
    title: "The Teakwood",
    titleItalic: "Herbal Apothecary",
    subtitle: "Olfactory Oil Selection & Sensory Journey",
    description:
      "Every guest ritual begins at our carved teakwood apothecary. Here, you will be welcomed with cold herbal lemongrass tea and invited to sample our cold-pressed Cambodian oils, pure organic rice scrubs, and wild-harvested herbs to tailor your treatment to your body's personal needs.",
    capacity: "Pre-Treatment Welcome",
    ambiance: "Warm golden wood shelves, lotus bowls, therapeutic botanical aromas",
    idealFor: "Aroma Blending Consultation, Sensory Testing, Organic Tea Welcome",
    features: [
      "Custom cold-pressed Cambodian jasmine, kaffir lime & lemongrass oils",
      "Wildcrafted organic rice and turmeric body polishes",
      "Handmade ceramic consultation decanters and lotus presentation bowls",
      "Warm greeting with traditional Sampeah and personalized therapist consultation",
    ],
    mainImage: "/images/rooms/0Y9A5021.jpg",
    gallery: [
      "/images/rooms/0Y9A5021.jpg",
    ],
  },
];

interface SanctuaryRoomsSectionProps {
  variant?: "full" | "preview";
  className?: string;
}

export function SanctuaryRoomsSection({
  variant = "full",
  className = "",
}: SanctuaryRoomsSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const room = SANCTUARY_ROOMS[activeTab] || SANCTUARY_ROOMS[0];
  const activeImage = room.gallery[selectedPhotoIndex] || room.mainImage;

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setSelectedPhotoIndex(0);
  };

  const nextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % room.gallery.length);
  };

  const prevPhoto = () => {
    setSelectedPhotoIndex(
      (prev) => (prev - 1 + room.gallery.length) % room.gallery.length
    );
  };

  return (
    <section
      className={`relative overflow-hidden py-20 lg:py-28 ${
        variant === "full" ? "bg-[#141612] text-[#FAF7F2]" : "bg-[#1B1E17] text-[#FAF7F2]"
      } ${className}`}
      aria-label="Sanctuary Rooms & Treatment Suites"
    >
      {/* Subtle atmospheric glow decorations */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#C9A84C]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#7A8C6E]/15 blur-[140px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
        {/* ─── SECTION HEADER ─── */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-3"
          >
            <span className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#C9A84C]">
              Sanctuary Architecture
            </span>
            <span className="h-px w-8 bg-[#C9A84C]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF7F2] font-light leading-tight"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
          >
            Our Private Suites &amp;{" "}
            <span className="italic font-normal text-white">Healing Spaces</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-[#FAF7F2]/70 leading-relaxed max-w-2xl mx-auto"
          >
            Every square meter of Teuk Spa has been thoughtfully designed with natural
            Cambodian teak, soothing water features, and acoustic privacy drapes to ensure
            your mind disconnects the moment you step through our doors.
          </motion.p>
        </div>

        {/* ─── INTERACTIVE ROOM SELECTOR TABS ─── */}
        <div className="flex justify-center mb-10 lg:mb-14 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            {SANCTUARY_ROOMS.map((r, idx) => {
              const isActive = idx === activeTab;
              return (
                <button
                  key={r.id}
                  onClick={() => handleTabChange(idx)}
                  className={`relative px-5 sm:px-7 py-2.5 rounded-full text-xs font-medium tracking-[0.15em] uppercase transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "text-[#141612] font-semibold shadow-lg"
                      : "text-[#FAF7F2]/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSanctuaryTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#C9A84C] via-[#E8D6A7] to-[#C9A84C] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {r.tabLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── ACTIVE ROOM SHOWCASE CONTAINER ─── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#1B1E17]/80 rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/10 shadow-2xl backdrop-blur-sm"
          >
            {/* ─── LEFT: PHOTO GALLERY & INTERACTIVE PREVIEW (7 COLS) ─── */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Primary Image Stage */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-black/40">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={activeImage}
                      alt={`${room.title} — Teuk Massage & Spa`}
                      fill
                      priority
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Ambient photo overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Badge top-left */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase bg-black/60 backdrop-blur-md text-[#C9A84C] border border-[#C9A84C]/40">
                    <Sparkles className="w-3 h-3 text-[#C9A84C]" />
                    {room.badge}
                  </span>
                </div>

                {/* Expand / Lightbox trigger top-right */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                  aria-label="View full resolution image"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Subtitle tag on image bottom */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                  <div>
                    <p className="text-white text-base sm:text-lg font-serif font-medium drop-shadow-md">
                      {room.subtitle}
                    </p>
                  </div>
                  {room.gallery.length > 1 && (
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[11px] text-white/70">
                      <span>{selectedPhotoIndex + 1}</span>
                      <span>/</span>
                      <span>{room.gallery.length}</span>
                    </div>
                  )}
                </div>

                {/* Left/Right controls if gallery has multiple photos */}
                {room.gallery.length > 1 && (
                  <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevPhoto();
                      }}
                      className="pointer-events-auto w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Previous room photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextPhoto();
                      }}
                      className="pointer-events-auto w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Next room photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails Strip */}
              {room.gallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {room.gallery.map((thumb, idx) => {
                    const isSelected = idx === selectedPhotoIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`relative w-20 sm:w-24 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 cursor-pointer ${
                          isSelected
                            ? "border-[#C9A84C] scale-105 shadow-md shadow-[#C9A84C]/30"
                            : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
                        }`}
                        aria-label={`Select room angle ${idx + 1}`}
                      >
                        <Image
                          src={thumb}
                          alt={`${room.title} angle ${idx + 1}`}
                          fill
                          className="object-cover object-center"
                          sizes="96px"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ─── RIGHT: SPACE DETAILS & SPECIFICATIONS (5 COLS) ─── */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <h3
                  className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-light leading-snug"
                  style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
                >
                  {room.title}{" "}
                  <span className="italic font-normal text-[#C9A84C]">
                    {room.titleItalic}
                  </span>
                </h3>
                <p className="mt-3 text-sm text-[#FAF7F2]/75 leading-relaxed">
                  {room.description}
                </p>
              </div>

              {/* Quick Specs Pill Badges */}
              <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/10">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-[#C9A84C]">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-wider uppercase text-white/40 font-mono">
                      Capacity
                    </p>
                    <p className="text-xs font-medium text-white/90">{room.capacity}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-[#C9A84C]">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-wider uppercase text-white/40 font-mono">
                      Ambiance
                    </p>
                    <p className="text-xs font-medium text-white/90 line-clamp-1">
                      {room.ambiance}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold tracking-wider uppercase text-[#C9A84C] font-mono">
                  Suite Inclusions
                </p>
                <ul className="space-y-2">
                  {room.features.map((feat, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-start gap-2.5 text-xs text-[#FAF7F2]/80 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/book"
                  className="relative group inline-flex items-center gap-2.5 overflow-hidden px-7 py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-[#141612] transition-all duration-300 shadow-[0_4px_25px_rgba(201,168,76,0.3)] hover:shadow-[0_6px_35px_rgba(201,168,76,0.6)] hover:scale-105 active:scale-95"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#C9A84C] via-[#F4E5BD] to-[#C9A84C]" />
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Reserve in this Suite</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>

                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-white/70 hover:text-[#C9A84C] transition-colors py-2 px-3 border border-white/10 hover:border-[#C9A84C]/50 rounded-full"
                >
                  <span>View Packages</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── FULLSCREEN LIGHTBOX MODAL ─── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            <div
              className="relative max-w-6xl w-full h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeImage}
                alt={`${room.title} full view`}
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />

              {/* Close Button */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-20 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs tracking-wider uppercase backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                Close ✕
              </button>

              {/* Caption */}
              <div className="absolute bottom-4 inset-x-4 text-center pointer-events-none">
                <p className="inline-block bg-black/70 backdrop-blur-md px-5 py-2 rounded-full text-xs text-white/90 border border-white/15">
                  {room.title} — {room.subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
