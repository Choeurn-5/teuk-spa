"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Check, Droplets, Feather, ShieldCheck, Flame } from "lucide-react";

interface Modality {
  id: string;
  name: string;
  khmerName: string;
  category: string;
  medium: "Dry (No Oil)" | "Organic Warm Oil" | "Steamed Herbal Poultices" | "Firm Pressure & Oil";
  pressureLevel: number; // 1 to 5
  pressureDescription: string;
  clothingProvided: string;
  bestFor: string[];
  description: string;
  recommendedDuration: string;
  priceStarting: string;
  icon: any;
}

const modalities: Modality[] = [
  {
    id: "khmer-traditional",
    name: "Khmer Traditional Massage",
    khmerName: "ម៉ាស្សាបែបបុរាណខ្មែរ",
    category: "Ancient Lineage",
    medium: "Dry (No Oil)",
    pressureLevel: 4,
    pressureDescription: "Medium to Firm Acupressure",
    clothingProvided: "Loose organic Cambodian cotton pants & tunic",
    bestFor: [
      "Clearing blocked energy meridians",
      "Increasing spine & joint flexibility",
      "Passive yoga stretching after long flights",
      "Guests who prefer treatment without oils",
    ],
    description:
      "Full body massage without oil, using thumb and palm to make pressure point and combination of stretching, bending.",
    recommendedDuration: "60, 90 or 120 mins",
    priceStarting: "$20",
    icon: Feather,
  },
  {
    id: "aromatherapy",
    name: "Aromatherapy Massage",
    khmerName: "ម៉ាស្សាដោយប្រេងក្រអូប",
    category: "Botanical Alchemy",
    medium: "Organic Warm Oil",
    pressureLevel: 2.5,
    pressureDescription: "Gentle to Meditative Medium",
    clothingProvided: "Disposable spa undergarments & plush cotton robe",
    bestFor: [
      "Overcoming jet lag & sleep disruption",
      "Nervous system decompression",
      "Skin hydration with virgin cold-pressed oils",
      "Pure sensory and emotional surrender",
    ],
    description:
      "Full body massage with oil, gentle massage that we use thumb and palm for relaxing and relieve tension.",
    recommendedDuration: "60, 90 or 120 mins",
    priceStarting: "$25",
    icon: Droplets,
  },
  {
    id: "herbal-compress",
    name: "Khmer Herbal Compress",
    khmerName: "ស្អំស្មៅឱសថបុរាណ",
    category: "Therapeutic Heat",
    medium: "Steamed Herbal Poultices",
    pressureLevel: 3.5,
    pressureDescription: "Warm Thermal & Meridian Pressing",
    clothingProvided: "Soft breathable linen spa garments",
    bestFor: [
      "Sore knees, calves & hips after Angkor temples",
      "Chronic lower back tension & stiffness",
      "Deep respiratory opening (camphor & eucalyptus)",
      "Detoxifying lymphatic circulation",
    ],
    description:
      "Full body massage with oil and using the hot compress to apply on the body for muscle relax.",
    recommendedDuration: "90 mins",
    priceStarting: "$45",
    icon: Flame,
  },
  {
    id: "swedish",
    name: "Swedish Massage",
    khmerName: "ម៉ាស្សាស៊ុយអែត",
    category: "Intensive Recovery",
    medium: "Firm Pressure & Oil",
    pressureLevel: 5,
    pressureDescription: "Medium to Strong Pressure",
    clothingProvided: "Disposable spa undergarments & robe",
    bestFor: [
      "Chronic postural knots & tight shoulders",
      "Athletes, runners & active hikers",
      "Sciatica & stubborn muscular adhesions",
      "Long-lasting neuromuscular release",
    ],
    description:
      "Full body massage with oil, for the pressure from medium to strong massage.",
    recommendedDuration: "60, 90 or 120 mins",
    priceStarting: "$25",
    icon: ShieldCheck,
  },
];

export function TreatmentModalityMatrix() {
  const [activeTab, setActiveTab] = useState<string>("khmer-traditional");
  const activeModality = modalities.find((m) => m.id === activeTab) || modalities[0];

  return (
    <section className="py-28 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      {/* ─── HEADER ─── */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181A14]/5 border border-[#C9A84C]/30 text-[#C9A84C] text-[10px] uppercase tracking-[0.25em] font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Master Spa Guide</span>
        </div>
        <h2
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#141612] leading-tight mb-4 font-light"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          Which Healing Modality{" "}
          <span className="italic font-normal text-[#C9A84C]">Suits You?</span>
        </h2>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-6" />
        <p className="text-ink/70 font-light text-base md:text-lg leading-relaxed">
          Every body brings unique fatigue. Explore our four authentic therapy lineages to find
          the ideal balance of pressure, warmth, and herbal medicine for your treatment.
        </p>
      </div>

      {/* ─── MODALITY SELECTOR TABS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {modalities.map((m) => {
          const isActive = m.id === activeTab;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer focus:outline-none ${
                isActive
                  ? "bg-[#181A14] text-[#FAF7F2] border-[#C9A84C] shadow-[0_8px_30px_rgba(20,22,18,0.25)]"
                  : "bg-white/80 hover:bg-white text-ink border-mist/80 hover:border-[#C9A84C]/50 shadow-sm"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#C9A84C]/20 to-transparent rounded-bl-full pointer-events-none" />
              )}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`p-2 rounded-xl ${
                    isActive ? "bg-[#C9A84C]/20 text-[#DFC26D]" : "bg-mist/50 text-olive group-hover:text-[#C9A84C]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <span
                  className={`text-[9px] uppercase tracking-[0.2em] font-mono px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/10 text-[#DFC26D]" : "bg-mist/60 text-ink/60"
                  }`}
                >
                  {m.category}
                </span>
              </div>
              <h3
                className={`font-serif text-lg leading-tight mb-1 ${
                  isActive ? "text-[#FAF7F2]" : "text-olive group-hover:text-[#C9A84C] transition-colors"
                }`}
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {m.name}
              </h3>
              <p
                className={`text-[11px] font-sans ${
                  isActive ? "text-white/60" : "text-ink/50"
                }`}
              >
                {m.medium}
              </p>
            </button>
          );
        })}
      </div>

      {/* ─── ACTIVE MODALITY CARD SPOTLIGHT ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModality.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-8 md:p-12 border border-[#C9A84C]/25 shadow-xl relative overflow-hidden"
        >
          {/* Subtle gold watermark */}
          <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-[#C9A84C]/5 pointer-events-none blur-2xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 Columns: Description & Best-For List */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#C9A84C]">
                    ✦ {activeModality.category}
                  </span>
                  <span className="text-ink/30">|</span>
                  <span className="text-xs font-serif italic text-ink/60">
                    {activeModality.khmerName}
                  </span>
                </div>
                <h3
                  className="font-serif text-3xl sm:text-4xl text-[#141612] leading-tight"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {activeModality.name}
                </h3>
              </div>

              <p className="text-ink/80 text-base leading-relaxed font-light">
                {activeModality.description}
              </p>

              {/* Best Suited For checklist */}
              <div className="pt-2">
                <h4 className="text-[11px] uppercase tracking-[0.22em] font-medium text-olive mb-3">
                  Recommended For Your Body If You Experience:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModality.bestFor.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-ink/80">
                      <span className="w-4 h-4 rounded-full bg-[#C9A84C]/15 flex items-center justify-center shrink-0 mt-0.5 text-[#C9A84C]">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Technical Anatomy Specs Box */}
            <div className="lg:col-span-5 bg-[#FAF7F2] p-7 md:p-8 rounded-2xl border border-mist space-y-5">
              <h4 className="font-serif text-xl text-olive pb-3 border-b border-mist/80">
                Therapy Specifications
              </h4>

              {/* Pressure Meter */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-ink/60 uppercase tracking-wider">Pressure Level</span>
                  <span className="font-medium text-olive">{activeModality.pressureDescription}</span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        level <= activeModality.pressureLevel
                          ? "bg-gradient-to-r from-[#C9A84C] to-[#DFC26D]"
                          : "bg-mist"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Oil / Dry medium */}
              <div className="flex items-center justify-between text-sm py-2 border-b border-mist/60">
                <span className="text-ink/60">Medium Applied</span>
                <span className="font-medium text-olive">{activeModality.medium}</span>
              </div>

              {/* Attire Provided */}
              <div className="text-sm py-2 border-b border-mist/60 space-y-1">
                <span className="text-ink/60 text-xs uppercase tracking-wider block">Attire Provided</span>
                <p className="font-light text-ink/90 text-xs leading-relaxed">
                  {activeModality.clothingProvided}
                </p>
              </div>

              {/* Recommended Duration & Price */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs text-ink/50 uppercase tracking-wider block">Duration</span>
                  <span className="font-medium text-olive text-sm">{activeModality.recommendedDuration}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-ink/50 uppercase tracking-wider block">Starting From</span>
                  <span className="font-serif text-2xl text-[#C9A84C] font-semibold">{activeModality.priceStarting}</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/book"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#181A14] text-[#FAF7F2] hover:bg-[#C9A84C] hover:text-[#141612] text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-md group"
              >
                <span>Reserve This Modality</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
