"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Heart, Bath, Clock, Flower2, Shield, Users } from "lucide-react";

export function CoupleSanctuarySection() {
  const highlights = [
    {
      icon: Users,
      title: "Synchronized Dual Therapists",
      description: "Two dedicated senior master therapists moving in harmonious cadence for a seamless shared journey.",
    },
    {
      icon: Bath,
      title: "Lotus Terrazzo Floral Bath",
      description: "Sunken stone soaking tub infused with wild floating lotus petals, fresh kaffir lime, and mountain mineral salts.",
    },
    {
      icon: Flower2,
      title: "Private Apothecary Selection",
      description: "Individual bespoke essential oil consultations for each guest before commencing the shared treatment.",
    },
    {
      icon: Clock,
      title: "Unhurried Tea Ceremony",
      description: "Post-ritual sanctuary lounging with hot pandan-lemongrass tea, dried organic mangoes, and private garden views.",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#141612] text-[#FAF7F2] overflow-hidden">
      {/* Decorative gradient accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4A5240]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Sanctuary Preview */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5] shadow-2xl border border-white/10 group">
              <Image
                src="/images/defaults/spa_package.jpg"
                alt="Teuk Spa Private Couple's Sanctuary Suite"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E100D] via-[#0E100D]/40 to-transparent" />

              {/* Floating luxury badge */}
              <div className="absolute top-6 left-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 max-w-[240px]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-jost font-medium mb-1">
                  <Sparkles className="w-3 h-3 text-[#C9A84C]" />
                  <span>Private VIP Suite</span>
                </div>
                <div className="font-serif text-lg text-white font-normal">
                  The Lotus Sanctuary
                </div>
                <div className="text-[11px] text-white/60 font-khmer mt-0.5">
                  បន្ទប់ស្ប៉ាពិសេសសម្រាប់គូស្នេហ៍
                </div>
              </div>

              {/* Bottom Quote Banner */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C9A84C] font-jost font-medium mb-1">
                  <Heart className="w-3.5 h-3.5 fill-[#C9A84C]" />
                  <span>Curated For Pairs & Honeymooners</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80 font-jost font-light leading-relaxed">
                  &ldquo;A secluded oasis where time dissolves. Side-by-side treatments followed by a 30-minute warm floral bath.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Suite Highlights */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A84C] font-medium font-jost">
                  Exclusive Couple&apos;s Ritual
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FAF7F2] tracking-tight leading-[1.15]">
                The Private Couple&apos;s Sanctuary Suite
              </h2>

              <p className="mt-4 text-base sm:text-lg text-white/70 font-jost font-light leading-relaxed">
                Designed for honeymoon couples, anniversaries, and travel companions seeking unhurried intimacy. Our VIP
                double suite offers complete acoustic privacy, private dressing chambers, and an artisan floral terrazzo bath.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-[#C9A84C]" />
                    </div>
                    <h3 className="font-serif text-lg text-white mb-1.5">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-white/60 font-jost font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Featured Journey Box */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.02] border border-[#C9A84C]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-jost font-medium">
                    Signature Experience
                  </div>
                  <div className="font-serif text-2xl text-white">
                    Sacred Couple&apos;s Harmonizing Odyssey
                  </div>
                  <div className="text-xs text-white/50 font-jost mt-0.5">
                    150 Minutes • Foot Soak + Body Scrub + Synchronized Massage + Lotus Floral Bath
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-xs text-white/40 font-jost uppercase">For Two Guests</div>
                  <div className="text-3xl font-serif text-[#C9A84C] font-medium">$165</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                <Link
                  href="/book?package=couples-harmonizing-odyssey"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C9A84C] hover:bg-[#B3933B] text-[#141612] text-xs sm:text-sm font-jost uppercase tracking-[0.15em] font-medium transition-all duration-300 shadow-lg shadow-[#C9A84C]/25"
                >
                  <span>Reserve Couple&apos;s Suite</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/60 hover:text-white font-jost tracking-wider transition-colors"
                >
                  <span>View All Packages</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
