import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { HeroSlider } from "@/components/ui/HeroSlider";
import { getSiteSettings } from "@/lib/content/getters";
import { BodyTensionConsultation } from "@/components/spa/BodyTensionConsultation";
import { AromaOilBar } from "@/components/spa/AromaOilBar";
import { SpaEtiquetteSection } from "@/components/spa/SpaEtiquetteSection";
import { PhilosophyFadeGallery } from "@/components/ui/PhilosophyFadeGallery";

/* ─────────────────────────────────────────────
   Teuk Massage & Spa — Home Page
   Server Component — no "use client" needed here
───────────────────────────────────────────── */

const treatments = [
  {
    image: "/images/defaults/aromatherapy.jpg",
    category: "Aromatic Ritual",
    name: "Jasmine Aromatherapy Journey",
    description:
      "Drift into stillness as warm essential oils — hand-blended from Cambodian jasmine and lemongrass — are worked deep into tired muscles with slow, rhythmic strokes.",
    duration: "90 min",
    price: "$68",
  },
  {
    image: "/images/defaults/herbal_compress.jpg",
    category: "Khmer Tradition",
    name: "Khmer Herbal Compress",
    description:
      "Steamed bundles of lemongrass, kaffir lime, turmeric, and sacred herbs are pressed along energy meridians, releasing centuries of healing wisdom through warmth.",
    duration: "75 min",
    price: "$58",
  },
  {
    image: "/images/defaults/massage_treatment.jpg",
    category: "Therapeutic",
    name: "Deep Tissue Restoration",
    description:
      "Targeted, firm pressure dissolves chronic tension knots, restores range of motion, and rebalances the body's natural flow — leaving you reborn.",
    duration: "60 min",
    price: "$48",
  },
];

const marqueeText =
  "✦ Ancient Khmer Healing ✦ Hot Stone Therapy ✦ Herbal Compress ✦ Aromatherapy ✦ Deep Tissue ✦ ";

export default async function HomePage() {
  const settings = await getSiteSettings() || {};
  const heroImages = [
    settings.heroImage1 || "/images/home-page/home-hero-4.jpg",
    settings.heroImage2 || "/images/home-page/home-hero-1.jpg",
    settings.heroImage3 || "/images/home-page/home-hero-2.jpg",
    settings.heroImage4 || "/images/defaults/herbal_compress.jpg",
  ];
  
  return (
    <div className="bg-[#FAF7F2] text-[#2C2C2C]">
      {/* ══════════════════════════════════════════
          1. HERO — Full Bleed Luxury Slider
      ══════════════════════════════════════════ */}
      <HeroSlider images={heroImages} />

      {/* ══════════════════════════════════════════
          2. MARQUEE STRIP
      ══════════════════════════════════════════ */}
      <section className="bg-[#2C2C2C] overflow-hidden py-4 relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#2C2C2C] to-transparent z-10" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#2C2C2C] to-transparent z-10" />

        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee 28s linear infinite",
          }}
        >
          {/* Repeat 4× so the loop is seamless */}
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-[#C9A84C] text-xl md:text-2xl pr-4"
              style={{ fontFamily: "'Pinyon Script', cursive" }}
            >
              {marqueeText}
            </span>
          ))}
        </div>

        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════
          3. OUR ESSENCE
      ══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-16 xl:px-32 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* LEFT — Luxury Crossfade Gallery of Handcrafted Botanicals */}
          <FadeIn direction="left" delay={0.1}>
            <PhilosophyFadeGallery />
          </FadeIn>

          {/* RIGHT — Copy */}
          <FadeIn direction="right" delay={0.2}>
            <div className="flex flex-col gap-6">
              {/* Overline */}
              <p
                className="text-xs font-medium tracking-[0.35em] uppercase text-[#C9A84C]"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Our Philosophy
              </p>

              {/* Heading */}
              <h2
                className="font-serif text-4xl md:text-5xl text-[#4A5240] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Rooted in Ancient
                <br />
                <span className="italic font-light">Khmer Wisdom</span>
              </h2>

              {/* Paragraphs */}
              <p
                className="text-[#2C2C2C]/70 leading-relaxed text-base"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                <em>Teuk</em> (ទឹក) means <em>water</em> in Khmer — the gentle, essential force
                that purifies, restores, and sustains. It is this spirit that flows through every
                corner of our sanctuary, from the stone-carved water features at our entrance to
                the warm herbal compresses placed upon your skin.
              </p>
              <p
                className="text-[#2C2C2C]/70 leading-relaxed text-base"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Our therapists are trained in traditional Khmer massage lineages passed down
                through generations of Cambodian healers — a living tradition we are privileged
                to preserve and share with guests from around the world.
              </p>
              <p
                className="text-[#2C2C2C]/70 leading-relaxed text-base"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Every ingredient we use — lemongrass, kaffir lime, turmeric, jasmine — is sourced
                from local Cambodian farms and prepared fresh each morning. Healing, as it was always
                meant to be: intimate, intentional, and deeply human.
              </p>

              {/* Bullet labels divider */}
              <div className="flex items-center gap-4 py-4 border-t border-b border-[#E8E4DC]">
                {["100% Natural", "Trained Therapists", "Private Rooms"].map((item, i) => (
                  <span
                    key={item}
                    className="flex items-center gap-4 text-xs tracking-widest uppercase text-[#4A5240]"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    {i > 0 && <span className="text-[#C9A84C]">·</span>}
                    {item}
                  </span>
                ))}
              </div>

              {/* Link with underline animation */}
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-sm tracking-widest uppercase text-[#4A5240] w-fit"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-[#C9A84C] after:transition-all after:duration-300 group-hover:after:w-full">
                  Discover Our Story
                </span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3.5 INTERACTIVE BODY TENSION DIAGNOSIS
      ══════════════════════════════════════════ */}
      <BodyTensionConsultation />

      {/* ══════════════════════════════════════════
          4. FEATURED TREATMENTS
      ══════════════════════════════════════════ */}
      <section className="py-32 bg-[#F5F0E8]">
        <div className="px-6 md:px-16 xl:px-32 max-w-screen-xl mx-auto">

          {/* Section header */}
          <FadeIn direction="up" delay={0.05}>
            <div className="text-center mb-16">
              <p
                className="text-xs font-medium tracking-[0.35em] uppercase text-[#C9A84C] mb-4"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                What We Offer
              </p>
              <h2
                className="font-serif text-4xl md:text-5xl text-[#2C2C2C]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Our Signature{" "}
                <span className="italic font-light text-[#4A5240]">Rituals</span>
              </h2>
              <div className="w-12 h-px bg-[#C9A84C] mx-auto mt-6" />
            </div>
          </FadeIn>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {treatments.map((t, i) => (
              <FadeIn key={t.name} direction="up" delay={0.1 + i * 0.12}>
                <div className="group bg-[#FAF7F2] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
                  {/* Card image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Category pill */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="rounded-full bg-[#2C2C2C]/70 px-3 py-1 text-xs tracking-widest uppercase text-[#C9A84C] backdrop-blur-sm"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {t.category}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-6 gap-3">
                    <h3
                      className="font-serif text-xl text-[#2C2C2C]"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {t.name}
                    </h3>
                    <p
                      className="text-sm text-[#2C2C2C]/60 leading-relaxed flex-1"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      {t.description}
                    </p>

                    {/* Duration + price + CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DC]">
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs tracking-widest text-[#7A8C6E] uppercase"
                          style={{ fontFamily: "'Jost', sans-serif" }}
                        >
                          {t.duration}
                        </span>
                        <span className="text-[#C9A84C]">·</span>
                        <span
                          className="text-base font-medium text-[#4A5240]"
                          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                        >
                          {t.price}
                        </span>
                      </div>
                      <Link
                        href="/book"
                        className="text-xs tracking-widest uppercase text-[#C9A84C] hover:text-[#b8963e] transition-colors"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        Book →
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* View all CTA */}
          <FadeIn direction="up" delay={0.4}>
            <div className="text-center mt-14">
              <Link
                href="/treatments"
                className="group inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-[#4A5240] border-b border-[#C9A84C]/40 pb-0.5 hover:border-[#C9A84C] transition-colors duration-300"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                View All Treatments
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4.5 CAMBODIAN AROMA & ESSENTIAL OIL BAR
      ══════════════════════════════════════════ */}
      <AromaOilBar />


      {/* ══════════════════════════════════════════
          5. TESTIMONIAL PULL QUOTE
      ══════════════════════════════════════════ */}
      <section className="relative py-24 bg-[#4A5240] overflow-hidden">
        {/* Decorative large quotation marks */}
        <div
          className="absolute -top-6 left-6 md:left-20 text-[12rem] leading-none text-white/10 select-none pointer-events-none"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          aria-hidden="true"
        >
          &ldquo;
        </div>
        <div
          className="absolute -bottom-16 right-6 md:right-20 text-[12rem] leading-none text-white/10 select-none pointer-events-none"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          aria-hidden="true"
        >
          &rdquo;
        </div>

        <FadeIn direction="up" delay={0.1}>
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-6">
            <blockquote
              className="font-serif italic text-2xl md:text-4xl text-[#FAF7F2] leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              "After years of searching, I found my sanctuary here. The Khmer herbal compress changed everything."
            </blockquote>
            <div className="w-10 h-px bg-[#C9A84C]" />
            <p
              className="text-sm tracking-widest uppercase text-[#C9A84C]"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              — Sophie M., Paris, France
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════════════
          5.5 SACRED SPA ETIQUETTE & DIGITAL DETOX
      ══════════════════════════════════════════ */}
      <SpaEtiquetteSection />

      {/* ══════════════════════════════════════════
          6. BOOK CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="relative h-[65vh] min-h-[460px] overflow-hidden flex items-center justify-center">
        {/* Background image — Real Hydrotherapy Bath */}
        <Image
          src={settings.ctaImage || "/images/home-page/CTA.jpg"}
          alt="Teuk Spa sanctuary hydrotherapy bath with floating lotus flowers and candles"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Ambient Dark Overlay with Subtle Warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,168,76,0.12)_0%,_transparent_70%)] pointer-events-none" />

        {/* Content */}
        <FadeIn direction="up" delay={0.1}>
          <div className="relative z-10 text-center px-6 flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <p
              className="text-xs font-medium tracking-[0.35em] uppercase text-[#C9A84C]"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Reserve Your Ritual
            </p>
            <h2
              className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#FAF7F2] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Your moment of calm is waiting.
            </h2>
            <Link
              href="/book"
              className="mt-2 rounded-full bg-[#C9A84C] px-10 py-3.5 text-sm font-medium tracking-widest uppercase text-[#2C2C2C] transition-all duration-300 hover:bg-[#b8963e] hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] hover:scale-105 active:scale-95"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Book Now
            </Link>
            <p
              className="text-white/60 text-xs tracking-widest uppercase font-light"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Daily 9:00 AM – 12:00 AM (Last Booking 11:00 PM) &nbsp;·&nbsp; Pakambor St, Siem Reap
            </p>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}
