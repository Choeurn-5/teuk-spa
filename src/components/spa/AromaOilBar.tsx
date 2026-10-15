"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Droplet,
  Flame,
  Leaf,
  Flower2,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  Tag,
} from "lucide-react";

interface BotanicalItem {
  id: string;
  name: string;
  khmerName: string;
  subtitle: string;
  category: "Traditional Hot Compress" | "Aromatic Body Therapy" | "Herbal Mineral Exfoliation" | "Fresh Fruit & Milk Nourishment";
  iconType: "flame" | "flower" | "leaf" | "droplet";
  referenceSource: string;
  ingredients: string[];
  scentProfile: string;
  therapeuticBenefits: string[];
  recommendedTreatments: {
    name: string;
    khmer: string;
    duration: string;
    price: string;
    slug: string;
  }[];
  color: {
    bg: string;
    border: string;
    accent: string;
    badge: string;
    glow: string;
  };
}

const BOTANICAL_APOTHECARY: BotanicalItem[] = [
  {
    id: "khmer-herbal-compress",
    name: "Steamed Khmer Herbal Compress",
    khmerName: "គ្រឿងពន្លៃស្អំក្តៅ",
    subtitle: "Sacred Phlei & Mountain Roots",
    category: "Traditional Hot Compress",
    iconType: "flame",
    referenceSource: "Teuk Spa Menu: Body Therapy & Signature Packages",
    ingredients: [
      "Prairie Turmeric / Phlei (ពន្លៃ)",
      "Wild Mountain Ginger (ខ្ញីព្រៃ)",
      "Fresh Highland Lemongrass (ស្លឹកគ្រៃ)",
      "Wild Kaffir Lime & Leaves (ក្រូចសើច)",
      "Natural Camphor Crystals (កបូរ)",
    ],
    scentProfile: "Deeply warming, aromatic, earthy and spicy; steam releases rich botanical essences deep into muscle fibers.",
    therapeuticBenefits: [
      "Relieves deep muscle soreness and fatigue after temple walking",
      "Stimulates sluggish blood flow and lymphatic microcirculation",
      "Soothes joint stiffness, spinal tension, and lower back ache",
      "Traditional Khmer postpartum and recuperative heating therapy",
    ],
    recommendedTreatments: [
      {
        name: "Khmer Herbal Compress",
        khmer: "ម៉ាស្សាប្រេងជាមួយគ្រឿងពន្លៃស្អំក្តៅ",
        duration: "90 mins",
        price: "$45",
        slug: "khmer-herbal-compress",
      },
      {
        name: "Treasure Of Khmer Package",
        khmer: "កញ្ចប់តានតឹងសាច់ដុំ",
        duration: "150 mins",
        price: "$55",
        slug: "treasure-of-khmer-package",
      },
      {
        name: "Special Package",
        khmer: "កញ្ចប់ពិសេស",
        duration: "180 mins",
        price: "$68",
        slug: "special-package",
      },
    ],
    color: {
      bg: "from-amber-600/15 via-amber-950/10 to-transparent",
      border: "border-amber-500/40",
      accent: "text-amber-300",
      badge: "bg-amber-500/15 text-amber-200 border-amber-400/30",
      glow: "rgba(245, 158, 11, 0.18)",
    },
  },
  {
    id: "aromatherapy-oils",
    name: "Aromatherapy Botanical Oil Blend",
    khmerName: "ម៉ាស្សាប្រេងធម្មជាតិ",
    subtitle: "Calming Floral & Gentle Palm Pressure",
    category: "Aromatic Body Therapy",
    iconType: "flower",
    referenceSource: "Teuk Spa Menu: Body Therapy — Aromatherapy & Swedish",
    ingredients: [
      "Pure Royal Cambodian Jasmine (ផ្កាម្លិះ)",
      "Sweet Frangipani / Champa Blossom (ផ្កាចំប៉ី)",
      "Pure Virgin Coconut Oil (ប្រេងដូងបរិសុទ្ធ)",
      "Cold-Pressed Sweet Almond Base Oil",
    ],
    scentProfile: "Silky, sweet, floral and tranquil; delicate floral petals induce mental stillness and peaceful relaxation.",
    therapeuticBenefits: [
      "Dissolves nervous anxiety and travel-related insomnia",
      "Nourishes dry skin with essential fatty acids and antioxidants",
      "Gentle thumb and palm strokes release chronic tension effortlessly",
      "Restores emotional balance and resets natural circadian sleep",
    ],
    recommendedTreatments: [
      {
        name: "Aromatherapy Massage",
        khmer: "ម៉ាស្សាប្រេងធម្មតា",
        duration: "60 / 90 / 120 mins",
        price: "$25 / $35 / $45",
        slug: "aromatherapy-massage",
      },
      {
        name: "Swedish Massage",
        khmer: "ម៉ាស្សាប្រេងធ្ងន់",
        duration: "60 / 90 / 120 mins",
        price: "$25 / $35 / $45",
        slug: "swedish-massage",
      },
      {
        name: "Relaxing Package",
        khmer: "កញ្ចប់បំបាត់ភាពតានតឹង",
        duration: "120 mins",
        price: "$50",
        slug: "relaxing-package",
      },
    ],
    color: {
      bg: "from-rose-500/15 via-rose-950/10 to-transparent",
      border: "border-rose-400/40",
      accent: "text-rose-300",
      badge: "bg-rose-500/15 text-rose-200 border-rose-400/30",
      glow: "rgba(244, 63, 94, 0.16)",
    },
  },
  {
    id: "khmer-herbal-scrub",
    name: "Khmer Herbal Mineral Salt & Wrap",
    khmerName: "គ្រឿងខ្មែរស្លាប់ស្បែក និង អប់ស្បែក",
    subtitle: "Exfoliating Mineral Crystals & Detox Wrap",
    category: "Herbal Mineral Exfoliation",
    iconType: "leaf",
    referenceSource: "Teuk Spa Menu: Body Scrub & Body Wrap",
    ingredients: [
      "Natural Cambodian Sea Salt Crystals (អំបិលរ៉ែធម្មជាតិ)",
      "Sun-Dried Prairie Turmeric Powder (ម្សៅរមៀតពន្លៃ)",
      "Crushed Fresh Kaffir Lime Zest (សំបកក្រូចសើច)",
      "Wild Tamarind Juice & Rice Powder (អំពិល និង ម្សៅអង្ករ)",
    ],
    scentProfile: "Crisp, tangy citrus, invigorating herbal minerals; clears the senses and tones the skin.",
    therapeuticBenefits: [
      "Sloughs away dead skin cells for instantly silkier texture",
      "Stimulates dermal microcirculation and accelerates skin renewal",
      "Warm cocooning wrap draws out environmental toxins and impurities",
      "Deeply refines skin radiance without irritating delicate epidermis",
    ],
    recommendedTreatments: [
      {
        name: "Khmer Herbal Salt Scrub",
        khmer: "គ្រឿងខ្មែរស្លាប់ស្បែក",
        duration: "60 mins",
        price: "$45",
        slug: "khmer-herbal-salt-scrub",
      },
      {
        name: "Khmer Herbal Wrap",
        khmer: "គ្រឿងខ្មែរអប់ស្បែក",
        duration: "60 mins",
        price: "$45",
        slug: "khmer-herbal-wrap",
      },
      {
        name: "Special Package",
        khmer: "កញ្ចប់ពិសេស",
        duration: "180 mins",
        price: "$68",
        slug: "special-package",
      },
    ],
    color: {
      bg: "from-emerald-500/15 via-emerald-950/10 to-transparent",
      border: "border-emerald-400/40",
      accent: "text-emerald-300",
      badge: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
      glow: "rgba(16, 185, 129, 0.16)",
    },
  },
  {
    id: "fruit-milk-nourishment",
    name: "Fresh Tropical Fruit & Milk Elixir",
    khmerName: "គ្រឿងផ្សំផ្លែឈើ និង ទឹកដោះគោ",
    subtitle: "Raw Tropical Enzymes & Organic Milk Bath",
    category: "Fresh Fruit & Milk Nourishment",
    iconType: "droplet",
    referenceSource: "Teuk Spa Menu: Facial Treatment, Fruit Scrub & Fruit Wrap",
    ingredients: [
      "Fresh Ripe Papaya & Mango Enzymes (ផ្លែឈើស្រស់)",
      "Pure Natural Cow's Milk (ទឹកដោះគោសុទ្ធ)",
      "Wild Forest Honey (ទឹកឃ្មុំព្រៃ)",
      "Fresh Cucumber & Ground Organic Rice (ត្រសក់ និង ម្សៅអង្ករ)",
    ],
    scentProfile: "Sweet, cooling, tropical and creamy; gentle refreshing aromas of fresh fruit and floral honey.",
    therapeuticBenefits: [
      "Natural alpha-hydroxy fruit acids (AHA) gently brighten dull tone",
      "Intensely hydrates and repairs sun-exposed skin after outdoor excursions",
      "Soothes facial sensitivity and replenishes natural moisture barrier",
      "Leaves body touchably soft, radiant, and naturally fragrant",
    ],
    recommendedTreatments: [
      {
        name: "Express Natural Facial",
        khmer: "គ្រឿងធម្មជាតិ",
        duration: "60 mins",
        price: "$25",
        slug: "express-facial",
      },
      {
        name: "Fruit Scrub",
        khmer: "គ្រឿងផ្សំផ្លែឈើ",
        duration: "60 mins",
        price: "$25",
        slug: "fruit-scrub",
      },
      {
        name: "Fruit Milk Wrap",
        khmer: "គ្រឿងផ្សំផ្លែឈើ",
        duration: "60 mins",
        price: "$45",
        slug: "fruit-milk-wrap",
      },
    ],
    color: {
      bg: "from-amber-400/15 via-orange-950/10 to-transparent",
      border: "border-amber-300/40",
      accent: "text-amber-200",
      badge: "bg-amber-400/15 text-amber-200 border-amber-300/30",
      glow: "rgba(251, 191, 36, 0.15)",
    },
  },
];

export function AromaOilBar() {
  const [selectedId, setSelectedId] = useState<string>("khmer-herbal-compress");
  const currentItem = BOTANICAL_APOTHECARY.find((item) => item.id === selectedId) || BOTANICAL_APOTHECARY[0];

  const renderIcon = (type: BotanicalItem["iconType"]) => {
    switch (type) {
      case "flame":
        return <Flame className="w-4 h-4" />;
      case "flower":
        return <Flower2 className="w-4 h-4" />;
      case "leaf":
        return <Leaf className="w-4 h-4" />;
      case "droplet":
        return <Droplet className="w-4 h-4" />;
    }
  };

  return (
    <section className="relative py-24 sm:py-32 bg-[#0C0E0B] text-[#FAF7F2] overflow-hidden border-t border-b border-white/5">
      {/* Ambient glowing radial warmth */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full blur-[150px] pointer-events-none transition-all duration-700 opacity-45"
        style={{ background: currentItem.color.glow }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A84C] font-medium font-jost">
              Cambodian Botanical Apothecary
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#FAF7F2] tracking-tight leading-[1.12]">
            Authentic Khmer Formulations
          </h2>

          <p className="mt-4 text-base sm:text-lg text-white/70 font-jost font-light leading-relaxed">
            Every ritual at Teuk Spa is prepared with time-honored Cambodian herbal recipes drawn directly from our
            treatment menu. Fresh prairie turmeric, wild ginger, crushed kaffir lime, and pure tropical botanicals
            prepared each morning.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-[#C9A84C]/90 font-serif italic">
            ✦ Sourced from Local Cambodian Farms • Prepared Fresh Daily • Zero Synthetic Additives ✦
          </p>
        </div>

        {/* Botanical Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-14">
          {BOTANICAL_APOTHECARY.map((botanical) => {
            const isSelected = botanical.id === selectedId;
            return (
              <button
                key={botanical.id}
                onClick={() => setSelectedId(botanical.id)}
                className={`relative group text-left p-4 sm:p-6 rounded-2xl transition-all duration-500 border backdrop-blur-md cursor-pointer ${
                  isSelected
                    ? `${botanical.color.border} bg-white/[0.09] shadow-[0_10px_35px_rgba(0,0,0,0.6)] scale-[1.02]`
                    : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeBotanicalIndicator"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${
                      isSelected
                        ? `${botanical.color.badge}`
                        : "border-white/10 bg-white/5 text-white/40 group-hover:text-white/80"
                    }`}
                  >
                    {renderIcon(botanical.iconType)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/45 font-mono">
                    0{BOTANICAL_APOTHECARY.findIndex((b) => b.id === botanical.id) + 1}
                  </span>
                </div>

                <div className="font-serif text-lg sm:text-xl text-[#FAF7F2] font-normal leading-snug">
                  {botanical.name}
                </div>
                <div className="text-xs text-white/50 font-khmer mt-0.5">{botanical.khmerName}</div>

                <div className="mt-2.5 text-[11px] text-white/60 font-jost line-clamp-1">
                  {botanical.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Botanical Detailed Apothecary Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`relative rounded-3xl p-6 sm:p-10 lg:p-12 border ${currentItem.color.border} bg-gradient-to-br ${currentItem.color.bg} backdrop-blur-xl shadow-2xl`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Scent Profile & Natural Ingredients */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-jost uppercase tracking-wider border mb-4 ${currentItem.color.badge}`}>
                    <Sparkles className="w-3 h-3" />
                    <span>{currentItem.category}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#FAF7F2] leading-tight">
                    {currentItem.name}
                  </h3>
                  <div className="text-sm sm:text-base text-white/60 font-khmer mt-1">
                    {currentItem.khmerName} • <span className="font-serif italic text-white/80">{currentItem.subtitle}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-white/80 font-jost leading-relaxed font-light">
                  {currentItem.scentProfile}
                </p>

                {/* Fresh Ingredients from Reference Booklet */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-jost font-medium mb-3">
                    <Leaf className="w-3.5 h-3.5" />
                    Authentic Cambodian Ingredients
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentItem.ingredients.map((ingredient, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/35 border border-white/5 text-xs text-white/90 font-jost"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                        <span>{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Source Verification Badge */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white/50 flex items-center gap-2 font-jost">
                  <Tag className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>{currentItem.referenceSource}</span>
                </div>
              </div>

              {/* Right Column: Therapeutic Actions & Direct Menu Pairings */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-jost font-medium mb-3">
                    Therapeutic Actions
                  </div>

                  <ul className="space-y-2.5">
                    {currentItem.therapeuticBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-[#C9A84C]" />
                        </span>
                        <span className="text-xs sm:text-sm text-white/80 font-jost font-light leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Menu Treatments Featuring This Formulation */}
                <div className="p-5 sm:p-6 rounded-2xl bg-black/45 border border-white/10">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/50 font-jost">
                      Menu Treatments Using This Preparation
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#C9A84C] font-mono">
                      Official Teuk Menu
                    </span>
                  </div>

                  <div className="space-y-2.5 mb-5">
                    {currentItem.recommendedTreatments.map((tr, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-colors"
                      >
                        <div>
                          <div className="text-xs sm:text-sm font-serif text-[#FAF7F2] font-normal">
                            {tr.name}
                          </div>
                          <div className="text-[11px] text-white/40 font-khmer">{tr.khmer}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs sm:text-sm font-medium text-[#C9A84C] font-mono">
                            {tr.price}
                          </div>
                          <div className="text-[10px] text-white/40 flex items-center gap-1 justify-end font-jost">
                            <Clock className="w-2.5 h-2.5" />
                            {tr.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/book?treatment=${currentItem.recommendedTreatments[0]?.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C9A84C] hover:bg-[#B3933B] text-[#141612] text-xs font-jost uppercase tracking-[0.16em] font-medium transition-all duration-300 shadow-lg shadow-[#C9A84C]/25"
                    >
                      <span>Book This Treatment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href="/treatments"
                      className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white font-jost tracking-wider transition-colors px-3 py-2"
                    >
                      <span>View Full Spa Menu</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Assurance Guarantee */}
        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-white/45 font-jost">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C9A84C]" /> 100% Cambodian Farmed Herbs
          </span>
          <span className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-[#C9A84C]" /> Natural Plant Extractions
          </span>
          <span className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#C9A84C]" /> Prepared Fresh Daily
          </span>
        </div>
      </div>
    </section>
  );
}
