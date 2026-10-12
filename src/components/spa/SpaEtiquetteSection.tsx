"use client";

import { motion } from "motion/react";
import { PhoneOff, Shirt, Footprints, Moon, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";

export function SpaEtiquetteSection() {
  const protocols = [
    {
      step: "01",
      icon: PhoneOff,
      title: "Digital Detox & Sanctuary Silence",
      khmerTitle: "ការផ្តាច់ពីបច្ចេកវិទ្យា",
      description:
        "To honor your nervous system and the tranquility of fellow guests, we invite you to secure all digital devices in our handcrafted bamboo lockboxes upon arrival. Experience the luxury of complete disconnected stillness.",
    },
    {
      step: "02",
      icon: Footprints,
      title: "Arrival & Floral Foot Cleansing",
      khmerTitle: "ពិធីលាងជើង និង តែស្វាគមន៍",
      description:
        "Please arrive 15 minutes prior to your booking. Your therapist will greet you with a chilled lemongrass-infused towel, an iced hibiscus herbal cooler, and an auspicious warm mineral salt foot bath.",
    },
    {
      step: "03",
      icon: Shirt,
      title: "Organic Cambodian Cotton Robes",
      khmerTitle: "សម្លៀកបំពាក់កប្បាសធម្មជាតិ",
      description:
        "Every guest is provided with sanitized, handwoven organic cotton robes and disposable garments. For dry Khmer massages, loose-fitting cotton pants and tunics allow full range of assisted stretching.",
    },
    {
      step: "04",
      icon: Moon,
      title: "Unhurried Post-Ritual Resting",
      khmerTitle: "ការសម្រាកដោយស្ងប់ស្ងាត់",
      description:
        "Healing requires integration. We never rush you out of your treatment chamber. Afterward, relax in our garden tea pavilion with hot ginger-pandan infusion and sun-dried organic Siem Reap fruits.",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#FAF7F2] text-[#141612] overflow-hidden border-t border-black/5">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A5240]/10 border border-[#4A5240]/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#4A5240]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#4A5240] font-medium font-jost">
              Mindful Guest Guidelines
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#141612] tracking-tight leading-[1.15]">
            The Sacred Spa Etiquette
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#141612]/70 font-jost font-light leading-relaxed">
            At Teuk Spa, we preserve an atmosphere of reverence, privacy, and serene renewal. We encourage every guest to
            embrace these four mindful pillars during their visit.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {protocols.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-7 sm:p-8 rounded-3xl bg-white border border-black/8 hover:border-black/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl text-[#C9A84C]/40 font-light">{item.step}</span>
                    <div className="w-10 h-10 rounded-2xl bg-[#4A5240]/10 border border-[#4A5240]/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#4A5240]" />
                    </div>
                  </div>

                  <h3 className="font-serif text-xl text-[#141612] mb-1 leading-snug">{item.title}</h3>
                  <div className="text-xs text-[#141612]/40 font-khmer mb-4">{item.khmerTitle}</div>

                  <p className="text-xs sm:text-sm text-[#141612]/70 font-jost font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-1.5 text-[11px] text-[#4A5240] font-jost uppercase tracking-wider font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Sanctuary Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Health & Medical Note */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white border border-black/8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center flex-shrink-0">
            <HeartHandshake className="w-6 h-6 text-[#C9A84C]" />
          </div>
          <div>
            <div className="font-serif text-base sm:text-lg text-[#141612] mb-1">
              Customized Health, Pregnancy & Pressure Consultation
            </div>
            <p className="text-xs sm:text-sm text-[#141612]/70 font-jost font-light leading-relaxed">
              If you are pregnant, have hypertension, recent surgical procedures, or chronic joint conditions, please inform
              our reception desk upon arrival. Our therapists will adjust all techniques and avoid contraindicated pressure points.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
