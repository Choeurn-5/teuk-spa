import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHero } from "@/components/ui/PageHero";
import { getSiteSettings } from "@/lib/content/getters";

/* ─────────────────────────────────────────────
   Teuk Massage & Spa — About Page
   Async Server Component
───────────────────────────────────────────── */

export default async function AboutPage() {
  /* Fetch site settings; fall back to hardcoded values if unavailable */
  let siteSettings: { phone?: string; address?: string; hours?: string } = {};
  try {
    siteSettings = (await getSiteSettings()) ?? {};
  } catch {
    /* getSiteSettings unavailable — fallback values used below */
  }

  const phone   = siteSettings?.phone   ?? "+855 12 345 678";
  const address = siteSettings?.address ?? "Wat Bo Road, Sala Kamreuk, Siem Reap, Cambodia";
  const hours   = siteSettings?.hours   ?? "Daily 10:00 AM – 10:00 PM";

  return (
    <div className="bg-[#FAF7F2] text-[#2C2C2C]">

      {/* ══════════════════════════════════════════
          1. HERO — Generous Height Luxury Ken Burns
      ══════════════════════════════════════════ */}
      <PageHero
        image="/images/defaults/spa_therapist.jpg"
        badge="✦ Ancient Heritage & Skilled Touch"
        scriptTag="Our Story"
        title="Healing Rooted"
        titleAccent="in Tradition"
        description="Founded on the timeless philosophy of Khmer healing wisdom. We invite you to slow down, breathe deeply, and reconnect with your inner stillness."
        heightClass="h-screen min-h-[750px] lg:min-h-[820px]"
        actions={{
          primary: { label: "Book a Ritual", href: "/book" },
          secondary: { label: "Our Treatments", href: "/treatments" },
        }}
      />

      {/* ══════════════════════════════════════════
          2. PULL QUOTE
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-16">
        <FadeIn direction="up" delay={0.1}>
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
            {/* Ornament — left */}
            <div className="flex items-center gap-4 w-full justify-center">
              <div className="flex-1 max-w-[80px] h-px bg-[#C9A84C]/50" />
              <svg
                className="w-5 h-5 text-[#C9A84C]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l1.8 5.5H19l-4.6 3.4 1.8 5.5L12 13l-4.2 3.4 1.8-5.5L5 7.5h5.2z" />
              </svg>
              <div className="flex-1 max-w-[80px] h-px bg-[#C9A84C]/50" />
            </div>

            <blockquote
              className="font-serif italic text-[#4A5240] text-2xl md:text-4xl leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Teuk (ទឹក) means <em>water</em> in Khmer — the source of all life, the
              foundation of all healing.
            </blockquote>

            {/* Ornament — right */}
            <div className="flex items-center gap-4 w-full justify-center">
              <div className="flex-1 max-w-[80px] h-px bg-[#C9A84C]/50" />
              <svg
                className="w-5 h-5 text-[#C9A84C]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l1.8 5.5H19l-4.6 3.4 1.8 5.5L12 13l-4.2 3.4 1.8-5.5L5 7.5h5.2z" />
              </svg>
              <div className="flex-1 max-w-[80px] h-px bg-[#C9A84C]/50" />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════════════
          3. STORY — 2-col grid
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-16 xl:px-32 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* LEFT — Text */}
          <FadeIn direction="left" delay={0.1}>
            <div className="flex flex-col gap-6">
              <p
                className="text-xs font-medium tracking-[0.35em] uppercase text-[#C9A84C]"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                The Founding
              </p>
              <h2
                className="font-serif text-3xl md:text-4xl text-[#4A5240] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                A Vision Born from
                <br />
                <span className="italic font-light">Cambodia&apos;s Heart</span>
              </h2>

              <p
                className="text-[#2C2C2C]/70 leading-relaxed"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Teuk Massage &amp; Spa was founded in 2014 by Cambodian wellness practitioner
                Sophea Meas, who had spent over a decade studying the ancient healing traditions
                of the Khmer people under master therapists in Phnom Penh and the remote
                villages of Battambang. Returning to her home in Siem Reap, Sophea dreamed of
                creating a space where the wisdom of her teachers could be honoured and shared.
              </p>
              <p
                className="text-[#2C2C2C]/70 leading-relaxed"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Cambodian healing traditions are among Southeast Asia's most sophisticated —
                drawing from Ayurvedic influences, Buddhist mindfulness, and a uniquely Khmer
                understanding of the body's energy channels. Our treatments are not merely
                relaxing; they are rituals designed to restore harmony between body, breath,
                and spirit, honouring the patient work of generations who came before us.
              </p>
              <p
                className="text-[#2C2C2C]/70 leading-relaxed"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Every member of our team undergoes a minimum of 200 hours of hands-on training
                before ever treating a guest. We hold monthly knowledge circles where senior
                therapists share techniques, herb lore, and the quieter arts of presence and
                listening that cannot be found in any textbook — only passed heart to heart.
              </p>
            </div>
          </FadeIn>

          {/* RIGHT — Image with gold offset frame */}
          <FadeIn direction="right" delay={0.2}>
            <div className="relative">
              {/* Gold decorative frame behind image */}
              <div className="absolute -top-4 -right-4 w-full h-full rounded-2xl border border-[#C9A84C]/60" />
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/defaults/spa_herbs.jpg"
                  alt="Cambodian herbs prepared for our treatments"
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. VALUES — 3 Cards
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5F0E8]">
        <div className="px-6 md:px-16 xl:px-32 max-w-screen-xl mx-auto">

          <FadeIn direction="up" delay={0.05}>
            <div className="text-center mb-14">
              <p
                className="text-xs font-medium tracking-[0.35em] uppercase text-[#C9A84C] mb-4"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                What We Stand For
              </p>
              <h2
                className="font-serif text-3xl md:text-4xl text-[#2C2C2C]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Our{" "}
                <span className="italic font-light text-[#4A5240]">Guiding Values</span>
              </h2>
              <div className="w-12 h-px bg-[#C9A84C] mx-auto mt-5" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 — Ancient Wisdom */}
            <FadeIn direction="up" delay={0.1}>
              <div className="bg-[#E8E4DC] rounded-2xl p-8 flex flex-col items-center text-center gap-5 hover:shadow-lg transition-shadow duration-300">
                {/* Lotus SVG */}
                <svg
                  className="w-12 h-12 text-[#C9A84C]"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M24 38c0 0-14-8-14-20a14 14 0 0 1 14-4 14 14 0 0 1 14 4c0 12-14 20-14 20z" />
                  <path d="M10 18c-4-2-7-6-7-10 4 0 8 2 11 6" />
                  <path d="M38 18c4-2 7-6 7-10-4 0-8 2-11 6" />
                  <path d="M24 14v24" />
                  <path d="M17 20c0-4 3.5-8 7-8" />
                  <path d="M31 20c0-4-3.5-8-7-8" />
                </svg>
                <h3
                  className="font-serif text-xl text-[#4A5240]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Ancient Wisdom
                </h3>
                <p
                  className="text-sm text-[#2C2C2C]/65 leading-relaxed"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  We are custodians of Khmer healing traditions that span centuries. Every
                  technique, every herb, every ritual gesture carries the weight and grace
                  of a living lineage.
                </p>
              </div>
            </FadeIn>

            {/* Card 2 — Pure Ingredients */}
            <FadeIn direction="up" delay={0.18}>
              <div className="bg-[#E8E4DC] rounded-2xl p-8 flex flex-col items-center text-center gap-5 hover:shadow-lg transition-shadow duration-300">
                {/* Leaf SVG */}
                <svg
                  className="w-12 h-12 text-[#C9A84C]"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 40c4-16 16-24 30-26C38 28 28 38 8 40z" />
                  <path d="M8 40l14-14" />
                  <path d="M22 26c2-4 5-8 10-10" />
                </svg>
                <h3
                  className="font-serif text-xl text-[#4A5240]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Pure Ingredients
                </h3>
                <p
                  className="text-sm text-[#2C2C2C]/65 leading-relaxed"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  From lemongrass harvested at dawn to cold-pressed jasmine oil — every
                  ingredient is locally sourced, wildcrafted or organically grown, and
                  prepared fresh each morning without synthetic additives.
                </p>
              </div>
            </FadeIn>

            {/* Card 3 — Skilled Hands */}
            <FadeIn direction="up" delay={0.26}>
              <div className="bg-[#E8E4DC] rounded-2xl p-8 flex flex-col items-center text-center gap-5 hover:shadow-lg transition-shadow duration-300">
                {/* Hands SVG */}
                <svg
                  className="w-12 h-12 text-[#C9A84C]"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 28V16a3 3 0 0 1 6 0v8" />
                  <path d="M18 24V13a3 3 0 0 1 6 0v11" />
                  <path d="M24 24v-9a3 3 0 0 1 6 0v9" />
                  <path d="M30 24v-6a3 3 0 0 1 6 0v10c0 6-4 10-10 10h-4a10 10 0 0 1-10-10v-4" />
                </svg>
                <h3
                  className="font-serif text-xl text-[#4A5240]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Skilled Hands
                </h3>
                <p
                  className="text-sm text-[#2C2C2C]/65 leading-relaxed"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Our therapists complete 200+ hours of intensive training and ongoing
                  mentorship. Their hands carry both technical mastery and something rarer:
                  the quiet intuition born of genuine care.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. FULL-WIDTH IMAGE BANNER
      ══════════════════════════════════════════ */}
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden flex items-center justify-center">
        <Image
          src="/images/defaults/massage_treatment.jpg"
          alt="A therapist performing a Teuk signature treatment"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#2C2C2C]/65" />

        <FadeIn direction="up" delay={0.1}>
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center gap-4">
            {/* Decorative ornament */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-px bg-[#C9A84C]/70" />
              <svg className="w-4 h-4 text-[#C9A84C]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l1.8 5.5H19l-4.6 3.4 1.8 5.5L12 13l-4.2 3.4 1.8-5.5L5 7.5h5.2z" />
              </svg>
              <div className="w-8 h-px bg-[#C9A84C]/70" />
            </div>
            <blockquote
              className="font-serif italic text-2xl md:text-4xl text-white leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              "To heal is to listen — with the hands, with the breath, with the whole
              heart."
            </blockquote>
            <div className="w-10 h-px bg-[#C9A84C] mt-2" />
            <p
              className="text-xs tracking-widest uppercase text-[#C9A84C]"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              — Sophea Meas, Founder
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════════════
          6. LOCATION TEASER
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-[#4A5240]">
        <div className="px-6 md:px-16 xl:px-32 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* LEFT — Contact info */}
            <FadeIn direction="left" delay={0.1}>
              <div className="flex flex-col gap-6">
                <p
                  className="text-xs font-medium tracking-[0.35em] uppercase text-[#C9A84C]"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Find Us
                </p>
                <h2
                  className="font-serif text-3xl md:text-4xl text-[#FAF7F2] leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Visit Our{" "}
                  <span className="italic font-light">Sanctuary</span>
                </h2>
                <div className="w-10 h-px bg-[#C9A84C]" />

                <div className="flex flex-col gap-5 mt-2">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
                    </svg>
                    <div>
                      <p
                        className="text-xs tracking-widest uppercase text-[#FAF7F2]/50 mb-1"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        Address
                      </p>
                      <p
                        className="text-[#FAF7F2]/80 text-sm leading-relaxed"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" />
                    </svg>
                    <div>
                      <p
                        className="text-xs tracking-widest uppercase text-[#FAF7F2]/50 mb-1"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        Phone
                      </p>
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="text-[#FAF7F2]/80 text-sm hover:text-[#C9A84C] transition-colors"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {phone}
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                    <div>
                      <p
                        className="text-xs tracking-widest uppercase text-[#FAF7F2]/50 mb-1"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        Hours
                      </p>
                      <p
                        className="text-[#FAF7F2]/80 text-sm"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {hours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* RIGHT — CTA to /contact */}
            <FadeIn direction="right" delay={0.2}>
              <div className="flex flex-col gap-6 md:pl-8 md:border-l md:border-[#FAF7F2]/10">
                <p
                  className="font-serif italic text-xl md:text-2xl text-[#FAF7F2]/80 leading-relaxed"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  We would love to welcome you. Whether you are visiting Siem Reap for a day
                  or a season, our doors — and our healing hands — are open.
                </p>
                <div className="w-10 h-px bg-[#C9A84C]/50" />
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 text-sm tracking-widest uppercase text-[#C9A84C] w-fit border-b border-[#C9A84C]/40 pb-0.5 hover:border-[#C9A84C] transition-colors duration-300"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Get in Touch
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>

                {/* Quick book pill */}
                <Link
                  href="/book"
                  className="mt-2 inline-flex w-fit rounded-full bg-[#C9A84C] px-8 py-3 text-sm font-medium tracking-widest uppercase text-[#2C2C2C] transition-all duration-300 hover:bg-[#b8963e] hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.35)]"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Book a Treatment
                </Link>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

    </div>
  );
}
