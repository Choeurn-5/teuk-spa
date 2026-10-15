import Image from 'next/image'
import Link from 'next/link'
import { getTreatments } from '@/lib/content/getters'
import { FadeIn } from '@/components/ui/FadeIn'
import { HeroSlider, HeroSlideItem } from '@/components/ui/HeroSlider'
import { getSiteSettings } from '@/lib/content/getters'
import { TreatmentModalityMatrix } from '@/components/spa/TreatmentModalityMatrix'
import { AromaOilBar } from '@/components/spa/AromaOilBar'

// ─── helpers ────────────────────────────────────────────────────────────────

function resolveImage(t: { imageUrl?: string; name: string }): string {
  if (t.imageUrl) return t.imageUrl
  if (/aroma/i.test(t.name)) return '/images/defaults/aromatherapy.jpg'
  if (/herbal|compress/i.test(t.name)) return '/images/defaults/herbal_compress.jpg'
  return '/images/defaults/massage_treatment.jpg'
}

// ─── component ──────────────────────────────────────────────────────────────

export default async function TreatmentsPage() {
  const treatments = await getTreatments()
  const settings = await getSiteSettings() || {}

  const treatmentSlides: HeroSlideItem[] = [
    {
      image: settings.treatmentHero1 || "/images/treatment-page/treatment-hero-1.jpg",
      heading: "Sacred Khmer",
      headingItalic: "Healing Traditions",
      primaryCta: { label: "Book Your Treatment", href: "/book" },
    },
    {
      image: settings.treatmentHero2 || "/images/treatment-page/treatment-hero-2.jpg",
      heading: "Restorative Bodywork",
      headingItalic: "& Foot Reflexology",
      primaryCta: { label: "Reserve A Session", href: "/book" },
    },
    {
      image: settings.treatmentHero3 || "/images/treatment-page/treatment-hero-3.jpg",
      heading: "Sanctuary Ambience",
      headingItalic: "& Deep Tranquility",
      primaryCta: { label: "Explore Rituals", href: "/book" },
    },
    {
      image: settings.treatmentHero4 || "/images/treatment-page/treatment-hero-4.jpg",
      heading: "Cambodian Botanical",
      headingItalic: "Baths & Aromatherapy",
      primaryCta: { label: "Book Bath Ritual", href: "/book" },
    },
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#2C2C2C] font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          1. HERO — Full Bleed Luxury Treatment Slider
      ══════════════════════════════════════════════════════ */}
      <HeroSlider slides={treatmentSlides} ariaLabel="Teuk Spa Treatment Rituals" />

      {/* ══════════════════════════════════════════════════════
          2. SECTION INTRO
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-6 text-center">
        <FadeIn direction="up" delay={0.05}>
          {/* gold overline */}
          <p
            className="text-[#C9A84C] text-xs tracking-[0.35em] uppercase mb-4 font-sans font-medium"
          >
            Every Treatment is a Ritual
          </p>

          <h2
            className="font-serif text-4xl md:text-5xl text-[#4A5240] leading-snug mb-6 max-w-2xl mx-auto"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Crafted to restore, renew,&nbsp;and&nbsp;revive
          </h2>

          <p className="text-[#2C2C2C]/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Each session at Teuk Spa draws on Cambodian botanical traditions and
            time-honoured techniques to bring you profound, lasting wellbeing.
          </p>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════════════════════════
          2.5 TREATMENT MODALITY COMPARISON MATRIX
      ══════════════════════════════════════════════════════ */}
      <TreatmentModalityMatrix />

      {/* ══════════════════════════════════════════════════════
          3. TREATMENT CARDS — Grid layout
      ══════════════════════════════════════════════════════ */}
      <section className="pb-16 md:pb-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatments.map((treatment: any, idx: number) => {
            const imgSrc = resolveImage(treatment)
            const firstOption = treatment.durationOptions?.[0] || { minutes: 60, price: 25 };
            const hasMultiple = treatment.durationOptions?.length > 1;

            return (
              <FadeIn key={treatment.id ?? idx} direction="up" delay={0.05} className="flex h-full">
                <Link href="/book" className="bg-[#F5F0E8] rounded-2xl overflow-hidden flex flex-col w-full shadow-sm hover:shadow-md transition-shadow duration-300 group">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={treatment.name}
                      fill
                      unoptimized={Boolean(imgSrc?.startsWith("data:"))}
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3
                      className="font-serif text-2xl text-[#4A5240] leading-snug mb-3"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {treatment.name}
                    </h3>
                    <p className="text-[#2C2C2C]/70 text-sm leading-relaxed mb-6 flex-grow">
                      {treatment.shortDescription || treatment.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-[#4A5240]/10">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#7A8C6E]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {hasMultiple ? `From ${firstOption.minutes} mins` : `${firstOption.minutes} mins`}
                      </div>
                      <div className="text-lg font-semibold text-[#C9A84C]">
                        {hasMultiple ? `From $${firstOption.price}` : `$${firstOption.price}`}
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3.5 SENSORY BOTANICAL AROMA & OIL BAR
      ══════════════════════════════════════════════════════ */}
      <AromaOilBar />

      {/* ══════════════════════════════════════════════════════
          4. BOTTOM STRIP — 4 numbered process steps
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#2C2C2C] py-16 md:py-20 px-6">
        <FadeIn direction="up" delay={0.05}>
          <p
            className="text-center text-[#C9A84C] text-[10px] tracking-[0.35em] uppercase font-medium mb-10"
          >
            Your Journey With Us
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { step: '01', label: 'Choose', sub: 'Select the treatment that calls to you.' },
            { step: '02', label: 'Book',   sub: 'Reserve your sanctuary in seconds.'     },
            { step: '03', label: 'Arrive', sub: 'Be welcomed with warm Khmer hospitality.' },
            { step: '04', label: 'Transform', sub: 'Leave renewed in body and spirit.'   },
          ].map(({ step, label, sub }, i) => (
            <FadeIn key={step} direction="up" delay={i * 0.08} className="text-center">
              <p
                className="font-serif text-7xl md:text-8xl text-[#C9A84C]/20 leading-none mb-1 select-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {step}
              </p>
              <p
                className="font-serif text-2xl md:text-3xl text-[#FAF7F2] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {label}
              </p>
              <p className="text-[#FAF7F2]/50 text-sm leading-relaxed">{sub}</p>
            </FadeIn>
          ))}
        </div>
      </section>

    </div>
  )
}
