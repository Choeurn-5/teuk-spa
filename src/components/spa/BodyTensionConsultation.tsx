"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Activity, Clock, CheckCircle2, AlertCircle, Compass } from "lucide-react";

interface TensionZone {
  id: string;
  title: string;
  khmerTitle: string;
  subtitle: string;
  iconLabel: string;
  symptoms: string[];
  rootCause: string;
  therapistSolution: string;
  recommendedTreatment: string;
  treatmentSlug: string;
  idealDuration: string;
  pressureGrade: string;
  herbalPairing: string;
}

const tensionZones: TensionZone[] = [
  {
    id: "neck-shoulders",
    title: "Cervical & Upper Trapezius",
    khmerTitle: "ក ស្មា និង ខ្នងផ្នែកលើ",
    subtitle: "Desk Neck, Screen Fatigue & Trapezius Knots",
    iconLabel: "Neck & Shoulders",
    symptoms: [
      "Tight knots along the shoulder blade edges",
      "Stiffness rotating head side-to-side",
      "Headaches originating from occipital tension",
      "Shallow breathing from hunched posture",
    ],
    rootCause: "Prolonged laptop use, carrying heavy travel backpacks, and emotional stress held in the upper shoulders.",
    therapistSolution:
      "Deep ischemic trigger point compression, myofascial release along the rhomboids, and warm lemongrass herbal compress to soften hardened fascial adhesions.",
    recommendedTreatment: "Deep Tissue Vitality Massage",
    treatmentSlug: "deep-tissue",
    idealDuration: "90 Minutes",
    pressureGrade: "Firm to Deep Pressure (Level 4-5)",
    herbalPairing: "Highland Lemongrass & Kaffir Lime Oil",
  },
  {
    id: "temple-trekker",
    title: "Lower Limbs & Tired Arches",
    khmerTitle: "ជើង និង បាតជើងដើរប្រាសាទ",
    subtitle: "The Post-Angkor Wat Temple Fatigue",
    iconLabel: "Legs & Feet",
    symptoms: [
      "Aching calves from climbing steep temple stone stairways",
      "Plantar fasciitis soreness and swollen ankles",
      "Lactic acid buildup from tropical heat walking",
      "Heavy legs and sluggish venous circulation",
    ],
    rootCause: "Climbing Angkor Wat, Bayon, and Ta Prohm under tropical sun with thousands of uneven stone steps.",
    therapistSolution:
      "Mineral salt and kaffir lime foot bath, followed by specialized Khmer foot reflexology using rosewood acupressure sticks to stimulate internal organ zones and flush leg edema.",
    recommendedTreatment: "Khmer Traditional Foot Reflexology & Leg Therapy",
    treatmentSlug: "foot-reflexology",
    idealDuration: "60 or 90 Minutes",
    pressureGrade: "Medium to Firm Acupressure (Level 3-4)",
    herbalPairing: "Warm Kaffir Lime & Mountain Mineral Salt Soak",
  },
  {
    id: "lower-back",
    title: "Lumbar Spine & Sacrum",
    khmerTitle: "ចង្កេះ និង ខ្នងផ្នែកក្រោម",
    subtitle: "Lower Back Compression & Long-Flight Tightness",
    iconLabel: "Lower Back",
    symptoms: [
      "Dull ache across the lower back after airplane flights",
      "Compressed gluteal muscles and tight hip flexors",
      "Stiffness when standing up after prolonged sitting",
      "Restricted lumbar rotational movement",
    ],
    rootCause: "Long-haul flight seating, pelvic misalignment, and constricted piriformis muscles pulling on the lower spine.",
    therapistSolution:
      "Steamed cotton poultices filled with warm plai root and wild turmeric applied rhythmically along lumbar meridians, paired with gentle assisted pelvic traction.",
    recommendedTreatment: "Sacred Herbal Compress Therapy",
    treatmentSlug: "herbal-compress",
    idealDuration: "90 Minutes",
    pressureGrade: "Comforting Heat & Medium Pressure (Level 3)",
    herbalPairing: "Organic Battambang Turmeric & Ginger Oil",
  },
  {
    id: "cranial-eyes",
    title: "Cranial, Temples & Sensory Overload",
    khmerTitle: "ក្បាល ថ្ងាស និង ភ្នែក",
    subtitle: "Digital Overstimulation, Migraines & Insomnia",
    iconLabel: "Head & Scalp",
    symptoms: [
      "Throbbing pressure behind the eyes and temples",
      "Jaw clenching (TMJ) and facial tension",
      "Racing thoughts preventing restorative REM sleep",
      "Sensory fatigue from screens and travel logistics",
    ],
    rootCause: "Elevated cortisol levels, blue light exposure, and chronic mental overexertion.",
    therapistSolution:
      "Chong Kbal (ancient Khmer cranial marma therapy): targeted thumb pressure on acupressure points across the skull, brow, and neck base, coupled with warm wild jasmine oil.",
    recommendedTreatment: "Chong Kbal Cranial & Scalp Marma Ritual",
    treatmentSlug: "chong-kbal-head",
    idealDuration: "60 Minutes",
    pressureGrade: "Gentle to Medium Rhythmic (Level 2-3)",
    herbalPairing: "Night-Harvested Angkor Wild Jasmine Nectar",
  },
  {
    id: "full-body-jetlag",
    title: "Full Body Somatic Jetlag",
    khmerTitle: "ការសម្រាកទូទាំងរាងកាយ",
    subtitle: "Circadian Disruption & Systemic Muscle Dehydration",
    iconLabel: "Full Body Jetlag",
    symptoms: [
      "Complete physical exhaustion coupled with inability to sleep",
      "Generalised muscle heaviness and dehydration",
      "Sluggish digestive metabolism from time zone shifts",
      "Disconnection between mind and physical body",
    ],
    rootCause: "Transcontinental flights, altered circadian melatonin rhythms, dry cabin pressurisation, and travel anxiety.",
    therapistSolution:
      "Our premier multi-phase ritual: dry assisted yoga stretching to lengthen compressed limbs, followed by hot herbal compress steaming and a full-body jasmine oil massage.",
    recommendedTreatment: "Teuk Signature Rejuvenation Ritual",
    treatmentSlug: "signature-ritual",
    idealDuration: "120 Minutes",
    pressureGrade: "Harmonious Tailored Pressure (Level 3-4)",
    herbalPairing: "Custom Bespoke Botanical Alchemy",
  },
];

export function BodyTensionConsultation() {
  const [activeZoneId, setActiveZoneId] = useState<string>("neck-shoulders");
  const activeZone = tensionZones.find((z) => z.id === activeZoneId) || tensionZones[0];

  return (
    <section className="relative py-24 sm:py-32 bg-[#FAF7F2] text-[#141612] overflow-hidden">
      {/* Decorative subtle texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#141612_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A5240]/10 border border-[#4A5240]/20 mb-6">
            <Activity className="w-3.5 h-3.5 text-[#4A5240]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#4A5240] font-medium font-jost">
              Holistic Body Diagnosis
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#141612] tracking-tight leading-[1.15]">
            Where Does Your Body Carry Fatigue?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#141612]/70 font-jost font-light leading-relaxed">
            In the Cambodian tradition, every ache has a root cause. Select your primary tension area below to receive a
            curated therapist prescription tailored to your somatic condition.
          </p>
        </div>

        {/* Interactive Zone Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 sm:mb-16">
          {tensionZones.map((zone) => {
            const isSelected = zone.id === activeZoneId;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZoneId(zone.id)}
                className={`px-5 py-3 rounded-full text-xs sm:text-sm font-jost uppercase tracking-[0.12em] transition-all duration-300 border flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#141612] text-[#FAF7F2] border-[#141612] shadow-lg shadow-black/15 scale-[1.02]"
                    : "bg-white/80 text-[#141612]/70 border-black/10 hover:border-black/30 hover:bg-white"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? "bg-[#C9A84C]" : "bg-black/20"
                  }`}
                />
                <span className="font-medium">{zone.iconLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Assessment & Prescription Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeZone.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="rounded-3xl bg-white border border-black/10 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-14"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Symptoms & Root Cause */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-jost uppercase tracking-wider text-[#4A5240] font-medium mb-2">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Target Zone Assessment</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#141612]">
                    {activeZone.title}
                  </h3>
                  <div className="text-sm sm:text-base text-[#141612]/50 font-khmer mt-0.5">
                    {activeZone.khmerTitle}
                  </div>
                  <p className="text-xs sm:text-sm font-serif italic text-[#C9A84C] mt-2">
                    {activeZone.subtitle}
                  </p>
                </div>

                {/* Root Cause Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-black/5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#141612]/50 font-jost font-medium mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>Clinical Root Mechanism</span>
                  </div>
                  <p className="text-sm text-[#141612]/80 font-jost leading-relaxed font-light">
                    {activeZone.rootCause}
                  </p>
                </div>

                {/* Common Symptoms Checklist */}
                <div>
                  <div className="text-xs uppercase tracking-[0.15em] text-[#141612]/50 font-jost font-medium mb-3">
                    Recognised Somatic Symptoms
                  </div>
                  <ul className="space-y-2.5">
                    {activeZone.symptoms.map((symptom, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#4A5240] flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#141612]/80 font-jost leading-relaxed">
                          {symptom}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Therapist Prescription */}
              <div className="lg:col-span-6 space-y-6 lg:border-l lg:border-black/5 lg:pl-12">
                <div className="p-6 sm:p-8 rounded-2xl bg-[#141612] text-[#FAF7F2] space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-jost font-medium mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                      <span>Therapist Curated Protocol</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-serif text-[#FAF7F2] leading-snug">
                      {activeZone.recommendedTreatment}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-white/70 font-jost leading-relaxed font-light">
                    {activeZone.therapistSolution}
                  </p>

                  {/* Protocol Specs Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs font-jost">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-white/40 uppercase tracking-wider text-[10px] flex items-center gap-1.5 mb-1">
                        <Clock className="w-3 h-3 text-[#C9A84C]" /> Ideal Duration
                      </div>
                      <div className="text-white font-medium">{activeZone.idealDuration}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-white/40 uppercase tracking-wider text-[10px] flex items-center gap-1.5 mb-1">
                        <Activity className="w-3 h-3 text-[#C9A84C]" /> Pressure Grade
                      </div>
                      <div className="text-white font-medium">{activeZone.pressureGrade}</div>
                    </div>

                    <div className="sm:col-span-2 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-white/40 uppercase tracking-wider text-[10px] mb-1">
                        Botanical / Herbal Poultice Pairing
                      </div>
                      <div className="text-[#C9A84C] font-medium">{activeZone.herbalPairing}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Link
                      href={`/book?treatment=${activeZone.treatmentSlug}&tension=${activeZone.id}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#C9A84C] hover:bg-[#B3933B] text-[#141612] text-xs sm:text-sm font-jost uppercase tracking-[0.15em] font-medium transition-all duration-300 shadow-lg shadow-[#C9A84C]/20"
                    >
                      <span>Book Recommended Treatment</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href="/treatments"
                      className="inline-flex items-center justify-center px-5 py-3.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-xs font-jost uppercase tracking-[0.12em] transition-colors"
                    >
                      <span>Compare All Modalities</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
