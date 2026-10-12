"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Droplet, Wind, Sun, Heart, Check, ArrowRight, ShieldCheck } from "lucide-react";

interface OilBlend {
  id: string;
  name: string;
  khmerName: string;
  subtitle: string;
  origin: string;
  category: "Euphoric & Calming" | "Clarifying & Detox" | "Warming & Restorative" | "Nourishing & Grounding";
  topNote: string;
  heartNote: string;
  baseNote: string;
  scentProfile: string;
  therapeuticBenefits: string[];
  extraction: string;
  recommendedTreatment: string;
  treatmentSlug: string;
  color: {
    bg: string;
    border: string;
    accent: string;
    badge: string;
    glow: string;
  };
}

const oilBlends: OilBlend[] = [
  {
    id: "wild-jasmine",
    name: "Angkor Wild Jasmine",
    khmerName: "ផ្កាម្លិះព្រៃអង្គរ",
    subtitle: "Night-Harvested Petal Nectar",
    origin: "Siem Reap Province Orchards",
    category: "Euphoric & Calming",
    topNote: "Dewy green tea blossom",
    heartNote: "Night-blooming royal jasmine",
    baseNote: "Subtle white musk & benzoin",
    scentProfile: "Delicate, sweet, narcotic floral with an ethereal, uplifting softness.",
    therapeuticBenefits: [
      "Soothes severe jetlag & resets circadian rest",
      "Alleviates nervous tension and chronic stress",
      "Heart-opening holistic emotional release",
      "Softens delicate skin with intense moisture",
    ],
    extraction: "Slow floral enfleurage in organic cold-pressed jojoba base",
    recommendedTreatment: "Jasmine Aromatherapy Journey (90m)",
    treatmentSlug: "jasmine-aromatherapy",
    color: {
      bg: "from-amber-500/10 via-amber-900/5 to-transparent",
      border: "border-amber-400/40",
      accent: "text-amber-300",
      badge: "bg-amber-500/15 text-amber-200 border-amber-400/30",
      glow: "rgba(217, 119, 6, 0.15)",
    },
  },
  {
    id: "kaffir-lemongrass",
    name: "Kulen Highland Lemongrass & Kaffir",
    khmerName: "ស្លឹកគ្រៃ និង ក្រូចសើចភ្នំគូលែន",
    subtitle: "Wild Riverbed Citrus & Herb",
    origin: "Sacred Phnom Kulen Slopes",
    category: "Clarifying & Detox",
    topNote: "Crushed kaffir lime zest & wild mint",
    heartNote: "Highland organic lemongrass stem",
    baseNote: "Earthy galangal root & vetiver",
    scentProfile: "Crisp, zesty, sparkling herbal citrus that awakens dormant energy.",
    therapeuticBenefits: [
      "Flushes lactic acid and stagnant lymphatic fluids",
      "Clears mental fatigue and post-travel heaviness",
      "Natural tropical antibacterial & toning qualities",
      "Invigorates breath and sinus pathways",
    ],
    extraction: "Steam distillation of fresh morning stalks & wild peel",
    recommendedTreatment: "Deep Tissue Vitality Massage (90m)",
    treatmentSlug: "deep-tissue",
    color: {
      bg: "from-emerald-500/10 via-emerald-900/5 to-transparent",
      border: "border-emerald-400/40",
      accent: "text-emerald-300",
      badge: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
      glow: "rgba(16, 185, 129, 0.15)",
    },
  },
  {
    id: "turmeric-ginger",
    name: "Sacred Golden Turmeric & Ginger",
    khmerName: "រមៀតមាស និង ខ្ញីព្រៃ",
    subtitle: "Sun-Dried Rhizome Infusion",
    origin: "Battambang Organic Valley",
    category: "Warming & Restorative",
    topNote: "Spicy fresh cut wild ginger",
    heartNote: "Rich golden turmeric root",
    baseNote: "Warm star anise & black pepper",
    scentProfile: "Deeply warm, spicy, and earthy; penetrates sore muscle tissues with radiant warmth.",
    therapeuticBenefits: [
      "Targeted relief for stiff spinal vertebrae & knees",
      "Accelerates post-exertion recovery after temple trekking",
      "Stimulates micro-capillary blood circulation",
      "Calms somatic inflammation and deep-seated chills",
    ],
    extraction: "Low-temperature solar lipid infusion with sweet almond oil",
    recommendedTreatment: "Herbal Compress Therapy (90m)",
    treatmentSlug: "herbal-compress",
    color: {
      bg: "from-orange-500/10 via-orange-900/5 to-transparent",
      border: "border-orange-400/40",
      accent: "text-orange-300",
      badge: "bg-orange-500/15 text-orange-200 border-orange-400/30",
      glow: "rgba(249, 115, 22, 0.15)",
    },
  },
  {
    id: "coconut-frangipani",
    name: "Koh Rong Virgin Coconut & Frangipani",
    khmerName: "ដូងបរិសុទ្ធ និង ផ្កាចំប៉ីកោះរ៉ុង",
    subtitle: "Coastal Tree-Pressed Elixir",
    origin: "Southern Island Coconut Groves",
    category: "Nourishing & Grounding",
    topNote: "Sweet frangipani / plumeria nectar",
    heartNote: "Silky raw coconut cream",
    baseNote: "Subtle Madagascar vanilla pod",
    scentProfile: "Velvety, exotic, soothing tropical comfort that envelops the senses.",
    therapeuticBenefits: [
      "Replenishes skin barrier stripped by tropical sun",
      "High natural lauric acid restores moisture elasticity",
      "Subtle calming aroma induces meditative stillness",
      "Completely hypoallergenic & pure food-grade cold-press",
    ],
    extraction: "Centrifuged cold-press within 48 hours of nut harvesting",
    recommendedTreatment: "Teuk Signature Rejuvenation Ritual (120m)",
    treatmentSlug: "signature-ritual",
    color: {
      bg: "from-stone-400/10 via-stone-800/5 to-transparent",
      border: "border-stone-300/40",
      accent: "text-stone-200",
      badge: "bg-stone-500/15 text-stone-200 border-stone-400/30",
      glow: "rgba(231, 229, 228, 0.12)",
    },
  },
];

export function AromaOilBar() {
  const [selectedId, setSelectedId] = useState<string>("wild-jasmine");
  const currentOil = oilBlends.find((o) => o.id === selectedId) || oilBlends[0];

  return (
    <section className="relative py-24 sm:py-32 bg-[#0E100D] text-[#FAF7F2] overflow-hidden border-t border-b border-white/5">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-40"
        style={{ background: currentOil.color.glow }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A84C] font-medium font-jost">
              Cambodian Botanical Apothecary
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#FAF7F2] tracking-tight leading-[1.15]">
            The Sensory Oil Bar
          </h2>

          <p className="mt-4 text-base sm:text-lg text-white/60 font-jost font-light leading-relaxed">
            Every massage therapy at Teuk Spa begins at our custom Aroma Bar. Guests select an artisanal, cold-pressed
            Cambodian botanical blend tailored to their emotional state and body fatigue.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-[#C9A84C]/80 font-serif italic">
            100% Organic • Zero Mineral Oils • Zero Synthetics • Wild-Harvested
          </p>
        </div>

        {/* Oil Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {oilBlends.map((oil) => {
            const isSelected = oil.id === selectedId;
            return (
              <button
                key={oil.id}
                onClick={() => setSelectedId(oil.id)}
                className={`relative group text-left p-5 sm:p-6 rounded-2xl transition-all duration-500 border backdrop-blur-md ${
                  isSelected
                    ? `${oil.color.border} bg-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)]`
                    : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeOilIndicator"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${
                      isSelected
                        ? `${oil.color.badge}`
                        : "border-white/10 bg-white/5 text-white/40 group-hover:text-white/70"
                    }`}
                  >
                    <Droplet className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-jost">
                    {oil.origin.split(" ")[0]}
                  </span>
                </div>

                <div className="font-serif text-lg sm:text-xl text-[#FAF7F2] font-normal leading-snug">
                  {oil.name}
                </div>
                <div className="text-xs text-white/40 font-khmer mt-0.5">{oil.khmerName}</div>

                <div className="mt-3 text-xs text-white/60 font-jost line-clamp-1">
                  {oil.category}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Oil Detailed Apothecary Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentOil.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`relative rounded-3xl p-6 sm:p-10 lg:p-12 border ${currentOil.color.border} bg-gradient-to-br ${currentOil.color.bg} backdrop-blur-xl shadow-2xl`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Scent Profile & Notes */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-jost uppercase tracking-wider border mb-4 ${currentOil.color.badge}">
                    <Sparkles className="w-3 h-3" />
                    <span>{currentOil.category}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#FAF7F2] leading-tight">
                    {currentOil.name}
                  </h3>
                  <div className="text-sm sm:text-base text-white/50 font-khmer mt-1">
                    {currentOil.khmerName} • <span className="font-serif italic text-white/70">{currentOil.subtitle}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-white/80 font-jost leading-relaxed font-light">
                  {currentOil.scentProfile}
                </p>

                {/* Olfactory Pyramid (Top, Heart, Base) */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-jost font-medium mb-4">
                    Olfactory Architecture
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/40 font-jost mb-1">
                        <Wind className="w-3 h-3 text-[#C9A84C]" /> Top Note
                      </div>
                      <div className="text-xs sm:text-sm text-white/90 font-serif leading-snug">
                        {currentOil.topNote}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/40 font-jost mb-1">
                        <Heart className="w-3 h-3 text-[#C9A84C]" /> Heart Note
                      </div>
                      <div className="text-xs sm:text-sm text-white/90 font-serif leading-snug">
                        {currentOil.heartNote}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/40 font-jost mb-1">
                        <Sun className="w-3 h-3 text-[#C9A84C]" /> Base Anchor
                      </div>
                      <div className="text-xs sm:text-sm text-white/90 font-serif leading-snug">
                        {currentOil.baseNote}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sourcing and Extraction */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white/60 space-y-1 font-jost">
                  <div>
                    <span className="text-white/40 uppercase tracking-wider">Harvest Terroir:</span>{" "}
                    <span className="text-white/90 font-medium">{currentOil.origin}</span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase tracking-wider">Method:</span>{" "}
                    <span className="text-white/90 font-medium">{currentOil.extraction}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Therapeutic Actions & Pairing */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-jost font-medium mb-3">
                    Therapeutic & Somatic Actions
                  </div>

                  <ul className="space-y-3">
                    {currentOil.therapeuticBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-[#C9A84C]" />
                        </span>
                        <span className="text-sm sm:text-base text-white/80 font-jost font-light leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ritual Pairing Recommendation Card */}
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-jost mb-1">
                    Therapist Recommended Pairing
                  </div>
                  <div className="font-serif text-xl sm:text-2xl text-[#FAF7F2] mb-3">
                    {currentOil.recommendedTreatment}
                  </div>
                  <p className="text-xs sm:text-sm text-white/60 font-jost leading-relaxed mb-5">
                    Our master bodyworkers blend this warm botanical elixir directly into the palms before each long, rhythmic
                    effleurage stroke to maximize dermal absorption.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href={`/book?oil=${currentOil.id}&treatment=${currentOil.treatmentSlug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C9A84C] hover:bg-[#B3933B] text-[#141612] text-xs sm:text-sm font-jost uppercase tracking-[0.15em] font-medium transition-all duration-300 shadow-lg shadow-[#C9A84C]/20"
                    >
                      <span>Reserve With This Blend</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href="/treatments"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/60 hover:text-white font-jost tracking-wider transition-colors"
                    >
                      <span>Explore Treatment Menu</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Assurance Guarantee */}
        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-white/40 font-jost">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C9A84C]" /> 100% Unadulterated Plant Lipids
          </span>
          <span className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-[#C9A84C]" /> Non-Greasy & Fast Dermal Absorption
          </span>
          <span className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#C9A84C]" /> Fair-Trade Cambodian Farming Cooperatives
          </span>
        </div>
      </div>
    </section>
  );
}
