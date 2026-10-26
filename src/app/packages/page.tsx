import Image from 'next/image'
import Link from 'next/link'
import { getPackages, getSiteSettings } from '@/lib/content/getters'
import { FadeIn } from '@/components/ui/FadeIn'
import { HeroSlider, HeroSlideItem } from '@/components/ui/HeroSlider'
import { calculateItemPrice } from '@/lib/pricing'

// ─── component ──────────────────────────────────────────────────────────────

export default async function PackagesPage() {
  const packages = await getPackages()
  const settings = await getSiteSettings() || {}

  const packageSlides: HeroSlideItem[] = [
    {
      image: settings.packageHero1 || "/images/package-page/package-hero-1.jpg",
      heading: "Curated Khmer",
      headingItalic: "Wellness Packages",
      primaryCta: { label: "Book Sanctuary Package", href: "/book" },
    },
    {
      image: settings.packageHero2 || "/images/package-page/package-hero2.jpg",
      heading: "Private Cabana",
      headingItalic: "Sanctuary Suites",
      primaryCta: { label: "Reserve Your Journey", href: "/book" },
    },
    {
      image: settings.packageHero3 || "/images/package-page/package-hero3.jpg",
      heading: "Immersive Multi-Hour",
      headingItalic: "Healing Rituals",
      primaryCta: { label: "Explore Packages", href: "/book" },
    },
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#2C2C2C] font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          1. HERO — Full Bleed Luxury Packages Slider
      ══════════════════════════════════════════════════════ */}
      <HeroSlider slides={packageSlides} ariaLabel="Teuk Spa Sanctuary Packages" />

      {/* ══════════════════════════════════════════════════════
          2. PACKAGES GRID — premium full-width cards
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto space-y-12">

        {/* section intro */}
        <FadeIn direction="up" delay={0.05} className="text-center mb-12">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.35em] uppercase font-medium mb-4">
            Curated Experiences
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl text-[#4A5240] leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Immersive Wellness Journeys
          </h2>
        </FadeIn>

        {packages.map((pkg, idx) => {
          const imgSrc = pkg.imageUrl && pkg.imageUrl.trim() !== '' ? pkg.imageUrl : '/images/defaults/spa_package.jpg'
          const includes: string[] = Array.isArray(pkg.includes) && pkg.includes.length > 0
            ? pkg.includes
            : (Array.isArray(pkg.items) ? pkg.items.map((it: any) => typeof it === 'string' ? it : `${it.minutes ? `${it.minutes}m ` : ''}${it.name}`) : (pkg.treatments ?? []))
          const formattedDuration = pkg.duration || (pkg.totalMinutes ? `${pkg.totalMinutes} min` : '90 min')
          const priceInfo = calculateItemPrice(pkg.price, pkg.discountPrice)
          const isOdd = idx % 2 !== 0

          return (
            <FadeIn key={pkg.id ?? idx} direction="up" delay={idx * 0.07}>
              {/* ── CARD ── */}
              <div className={`relative flex flex-col ${isOdd ? 'md:flex-row-reverse' : 'md:flex-row'} overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500 bg-white border border-[#C9A84C]/20 min-h-[420px]`}>

                {/* ── IMAGE PANEL — Real Visible Uploaded Image ── */}
                <div className="relative w-full md:w-5/12 min-h-[300px] md:min-h-[460px] overflow-hidden group">
                  <Image
                    src={imgSrc}
                    alt={pkg.name}
                    fill
                    unoptimized={Boolean(imgSrc?.startsWith("data:"))}
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                  {/* Subtle luxury gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                  {/* Top luxury badge & discount badge */}
                  <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 bg-[#4A5240]/85 backdrop-blur-md border border-[#C9A84C]/50 text-[#FAF7F2] text-[10px] tracking-[0.25em] uppercase font-medium px-3.5 py-1.5 rounded-full shadow-lg">
                      ✦ Sanctuary Ritual
                    </span>
                    {priceInfo.hasDiscount && (
                      <span className="inline-flex items-center gap-1 bg-[#8A3B2A] text-white text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                        SAVE ${priceInfo.savings} (-{priceInfo.discountPercent}%)
                      </span>
                    )}
                  </div>

                  {/* Bottom overlay with duration & name */}
                  <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-[#FAF7F2]/90 text-xs tracking-wider uppercase font-medium mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3.5 h-3.5 text-[#C9A84C]"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {formattedDuration}
                      </span>
                      <h4
                        className="font-serif text-2xl text-[#FAF7F2] leading-tight line-clamp-1"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {pkg.name}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#FAF7F2]/60 uppercase tracking-widest block font-sans">Price</span>
                      <div className="flex items-baseline justify-end gap-2">
                        {priceInfo.hasDiscount ? (
                          <>
                            <span className="text-sm md:text-base text-[#FAF7F2]/60 line-through">
                              ${priceInfo.regularPrice}
                            </span>
                            <p
                              className="font-serif text-3xl md:text-4xl text-[#C9A84C] font-semibold leading-none"
                              style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                              ${priceInfo.finalPrice}
                            </p>
                          </>
                        ) : (
                          <p
                            className="font-serif text-3xl md:text-4xl text-[#C9A84C] font-light leading-none"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                          >
                            ${priceInfo.regularPrice}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT CONTENT PANEL — description, includes & CTA ── */}
                <div className="relative z-10 flex flex-col justify-between md:w-7/12 bg-[#F5F0E8] p-8 md:p-12 lg:p-14">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[#C9A84C] text-[10px] tracking-[0.35em] uppercase font-medium">
                        Curated Experience
                      </p>
                      <span className="text-xs text-[#4A5240] font-sans font-medium tracking-wide bg-[#4A5240]/10 border border-[#4A5240]/20 px-3 py-1 rounded-full">
                        {formattedDuration}
                      </span>
                    </div>

                    <h3
                      className="font-serif text-3xl md:text-4xl text-[#4A5240] leading-snug mb-4"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {pkg.name}
                    </h3>

                    {/* description */}
                    {pkg.description && (
                      <p
                        className="font-serif italic text-[#2C2C2C]/75 text-base md:text-lg leading-relaxed mb-6"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {pkg.description}
                      </p>
                    )}

                    {/* includes list */}
                    {includes.length > 0 && (
                      <div className="mb-8">
                        <p
                          className="font-serif text-[#4A5240] text-xl mb-3 font-medium"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          This Journey Includes
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-[#C9A84C]" />
                              <span className="text-[#2C2C2C]/80 text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* CTA buttons + price summary */}
                  <div className="pt-6 border-t border-[#C9A84C]/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs uppercase tracking-widest text-[#2C2C2C]/50 block">Investment</span>
                        {priceInfo.hasDiscount && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Save ${priceInfo.savings} (-{priceInfo.discountPercent}%)
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2.5">
                        {priceInfo.hasDiscount ? (
                          <>
                            <span className="text-base text-[#2C2C2C]/40 line-through">
                              ${priceInfo.regularPrice}
                            </span>
                            <span
                              className="font-serif text-3xl md:text-4xl text-[#8A3B2A] font-medium leading-none"
                              style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                              ${priceInfo.finalPrice}
                            </span>
                          </>
                        ) : (
                          <span
                            className="font-serif text-3xl md:text-4xl text-[#C9A84C] font-light leading-none"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                          >
                            ${priceInfo.regularPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <Link
                        href={`/book?package=${pkg.id ?? ''}`}
                        className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b8953e] text-[#FAF7F2] text-xs tracking-[0.15em] uppercase font-medium px-6 py-3.5 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg group flex-1 sm:flex-initial"
                      >
                        Book Package
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>

                      <Link
                        href="/book"
                        className="inline-flex items-center justify-center border border-[#4A5240] text-[#4A5240] hover:bg-[#4A5240] hover:text-[#FAF7F2] text-xs tracking-[0.15em] uppercase font-medium px-6 py-3.5 rounded-full transition-all duration-300 flex-1 sm:flex-initial"
                      >
                        Enquire
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )
        })}
      </section>

      {/* ══════════════════════════════════════════════════════
          3. COUPLES & GROUPS SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#4A5240] py-20 md:py-28 px-6 text-center relative overflow-hidden">

        {/* decorative large faded ring */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-[600px] h-[600px] rounded-full border border-[#C9A84C]/10" />
          <div className="absolute w-[420px] h-[420px] rounded-full border border-[#C9A84C]/8" />
        </div>

        <FadeIn direction="up" delay={0.05} className="relative z-10 max-w-2xl mx-auto">
          {/* gold script */}
          <p
            className="font-script text-[#C9A84C] text-4xl mb-3 leading-none"
            style={{ fontFamily: "'Pinyon Script', cursive" }}
          >
            Share the Experience
          </p>

          {/* serif heading */}
          <h2
            className="font-serif text-4xl md:text-5xl text-[#FAF7F2] leading-snug mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Couples &amp; Groups
          </h2>

          {/* subtext */}
          <p className="text-[#FAF7F2]/65 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Celebrate love, friendship, or a special milestone with a bespoke
            shared spa journey. Our team will tailor every detail — from
            synchronised treatments to private suites — just for you and your
            loved ones.
          </p>

          {/* gold WhatsApp CTA */}
          <Link
            href="https://wa.me/85592835459"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#C9A84C] hover:bg-[#b8953e] text-[#FAF7F2] text-sm tracking-[0.15em] uppercase font-medium px-8 py-4 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl group"
          >
            {/* WhatsApp icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
              />
              <path
                d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.532 5.845L.057 23.57a.5.5 0 00.612.612l5.725-1.475A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.875a9.851 9.851 0 01-5.031-1.378l-.36-.214-3.734.962.983-3.622-.235-.373A9.852 9.852 0 012.125 12C2.125 6.554 6.554 2.125 12 2.125S21.875 6.554 21.875 12 17.446 21.875 12 21.875z"
              />
            </svg>
            Enquire on WhatsApp
          </Link>
        </FadeIn>
      </section>

    </div>
  )
}
