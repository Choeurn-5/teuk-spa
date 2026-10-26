import Image from 'next/image'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/content/getters'
import { FadeIn } from '@/components/ui/FadeIn'
import { HeroSlider, HeroSlideItem } from '@/components/ui/HeroSlider'

// ---------------------------------------------------------------------------
// Icon components (inline SVG — no extra dependency)
// ---------------------------------------------------------------------------
function MapPinIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 0 1 14 0C19 13.5 12 21 12 21z" />
      <circle cx="12" cy="8.5" r="2.5" />
    </svg>
  )
}

function ClockIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 15.5" />
    </svg>
  )
}

function PhoneIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Page Component (Async Server Component)
// ---------------------------------------------------------------------------
export default async function ContactPage() {
  // Fetch site settings (address, hours, phone, email, etc.)
  const settings = await getSiteSettings()

  // Derive contact values with graceful fallbacks
  const address   = settings?.address   || 'Pakambor St, Mondul 1, Svaydangkum, Siem Reap, Cambodia'
  const hours     = settings?.hours     || 'Daily · 10:00 AM – 10:00 PM'
  const phonePrimary = '092 835 459'
  const phoneSecondary = '070 835 459'
  const email     = settings?.email     || 'info@teukmassageandspa.com'
  const waNumber  = '85592835459'
  const tgNumber  = '85570835459'

  const contactSlides: HeroSlideItem[] = [
    {
      image: settings?.contactHero1 || "/images/contact-page/contact-hero-1.jpg",
      heading: "Warm Khmer",
      headingItalic: "Welcome & Care",
      primaryCta: { label: "Book An Appointment", href: "/book" },
    },
    {
      image: settings?.contactHero2 || "/images/contact-page/contact-hero-2.jpg",
      heading: "Spa Concierge",
      headingItalic: "& Dedicated Service",
      primaryCta: { label: "WhatsApp Concierge", href: `https://wa.me/${waNumber}` },
    },
    {
      image: settings?.contactHero3 || "/images/contact-page/contact-hero-3.jpg",
      heading: "We Welcome You",
      headingItalic: "In Central Siem Reap",
      primaryCta: { label: "Reserve Sanctuary Time", href: "/book" },
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2', color: '#2C2C2C' }}>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1 — HERO — Full Bleed Luxury Contact Slider                */}
      {/* ------------------------------------------------------------------ */}
      <HeroSlider slides={contactSlides} ariaLabel="Teuk Spa Contact & Location" />

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2 — MAIN GRID                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

          {/* ---- LEFT COLUMN ---- */}
          <div>
            {/* Heading */}
            <FadeIn delay={0.1} direction="left">
              <div className="mb-10">
                <p
                  className="font-script mb-1"
                  style={{ fontSize: '1.8rem', color: '#C9A84C', lineHeight: 1.1 }}
                >
                  We&apos;d love to hear from you
                </p>
                <h2
                  className="font-serif font-light tracking-[0.08em] uppercase"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 2.6rem)', color: '#4A5240' }}
                >
                  Get in Touch
                </h2>
                <div
                  className="mt-4 w-12 h-px"
                  style={{ backgroundColor: '#C9A84C' }}
                />
              </div>
            </FadeIn>

            {/* Contact Cards */}
            <div className="space-y-5">

              {/* Location */}
              <FadeIn delay={0.15} direction="left">
                <div
                  className="flex items-start gap-5 p-5 rounded-2xl transition-shadow duration-300 hover:shadow-md"
                  style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E4DC' }}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(74,82,64,0.12)' }}
                  >
                    <MapPinIcon className="w-5 h-5" style={{ color: '#4A5240' }} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-sans text-xs uppercase tracking-[0.18em] font-semibold mb-1"
                      style={{ color: '#C9A84C' }}
                    >
                      Location
                    </p>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: '#2C2C2C' }}>
                      {address}
                    </p>
                    <p
                      className="font-serif italic text-sm mt-1"
                      style={{ color: '#7A8C6E' }}
                    >
                      Tell your tuk-tuk: near the Old Market bridge
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* Hours */}
              <FadeIn delay={0.22} direction="left">
                <div
                  className="flex items-start gap-5 p-5 rounded-2xl transition-shadow duration-300 hover:shadow-md"
                  style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E4DC' }}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(74,82,64,0.12)' }}
                  >
                    <ClockIcon className="w-5 h-5" style={{ color: '#4A5240' }} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-sans text-xs uppercase tracking-[0.18em] font-semibold mb-1"
                      style={{ color: '#C9A84C' }}
                    >
                      Hours
                    </p>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: '#2C2C2C' }}>
                      {hours}
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* WhatsApp */}
              <FadeIn delay={0.29} direction="left">
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-5 p-5 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 block"
                  style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E4DC' }}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(74,82,64,0.12)' }}
                  >
                    <PhoneIcon className="w-5 h-5" style={{ color: '#4A5240' }} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-sans text-xs uppercase tracking-[0.18em] font-semibold mb-1"
                      style={{ color: '#C9A84C' }}
                    >
                      WhatsApp &amp; Phone
                    </p>
                    <p className="font-sans text-sm font-medium leading-relaxed" style={{ color: '#2C2C2C' }}>
                      {phonePrimary}
                    </p>
                    <p className="font-sans text-xs mt-0.5" style={{ color: '#7A8C6E' }}>
                      Tap to open WhatsApp
                    </p>
                  </div>
                </a>
              </FadeIn>

              {/* Direct Telegram */}
              <FadeIn delay={0.33} direction="left">
                <a
                  href={`https://t.me/+${tgNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-5 p-5 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 block"
                  style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E4DC' }}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(74,82,64,0.12)' }}
                  >
                    <PhoneIcon className="w-5 h-5" style={{ color: '#4A5240' }} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-sans text-xs uppercase tracking-[0.18em] font-semibold mb-1"
                      style={{ color: '#C9A84C' }}
                    >
                      Direct Telegram &amp; Phone
                    </p>
                    <p className="font-sans text-sm font-medium leading-relaxed" style={{ color: '#2C2C2C' }}>
                      {phoneSecondary}
                    </p>
                    <p className="font-sans text-xs mt-0.5" style={{ color: '#7A8C6E' }}>
                      Tap to message on Telegram
                    </p>
                  </div>
                </a>
              </FadeIn>

              {/* Email */}
              <FadeIn delay={0.36} direction="left">
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-5 p-5 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 block"
                  style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E4DC' }}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(74,82,64,0.12)' }}
                  >
                    <MailIcon className="w-5 h-5" style={{ color: '#4A5240' }} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-sans text-xs uppercase tracking-[0.18em] font-semibold mb-1"
                      style={{ color: '#C9A84C' }}
                    >
                      Email
                    </p>
                    <p className="font-sans text-sm leading-relaxed break-all" style={{ color: '#2C2C2C' }}>
                      {email}
                    </p>
                  </div>
                </a>
              </FadeIn>
            </div>

            {/* Action Buttons */}
            <FadeIn delay={0.44} direction="left">
              <div className="mt-10 flex flex-wrap gap-3">
                {/* WhatsApp Us */}
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 hover:opacity-90 hover:scale-105"
                  style={{ backgroundColor: '#25D366', color: '#FAF7F2' }}
                >
                  <PhoneIcon className="w-3.5 h-3.5" />
                  WhatsApp
                </a>

                {/* Direct Telegram */}
                <a
                  href={`https://t.me/+${tgNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 hover:opacity-90 hover:scale-105"
                  style={{ backgroundColor: '#229ED9', color: '#FAF7F2' }}
                >
                  <PhoneIcon className="w-3.5 h-3.5" />
                  Telegram
                </a>

                {/* Call Now */}
                <a
                  href={`tel:${phonePrimary}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-sans text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 hover:bg-olive/10"
                  style={{
                    border: '1.5px solid #4A5240',
                    color: '#4A5240',
                  }}
                >
                  <PhoneIcon className="w-3.5 h-3.5" />
                  Call Now
                </a>
              </div>
            </FadeIn>
          </div>

          {/* ---- RIGHT COLUMN ---- */}
          <div className="space-y-6">

            {/* Image Card */}
            <FadeIn delay={0.2} direction="right">
              <div className="relative rounded-3xl overflow-hidden h-72">
                <Image
                  src="/images/defaults/spa_therapist.jpg"
                  alt="Our welcoming team at Teuk Massage & Spa"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Gradient overlay text */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-7"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(44,44,44,0.80) 0%, rgba(74,82,64,0.30) 55%, transparent 100%)',
                  }}
                >
                  <p
                    className="font-script mb-1"
                    style={{ fontSize: '1.6rem', color: '#C9A84C', lineHeight: 1.1 }}
                  >
                    Warmly awaiting you
                  </p>
                  <p
                    className="font-serif italic font-light text-base"
                    style={{ color: '#FAF7F2' }}
                  >
                    Our therapists are ready to restore your calm
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Find Us Card */}
            <FadeIn delay={0.32} direction="right">
              <div
                className="rounded-3xl p-8 flex flex-col items-center text-center"
                style={{ backgroundColor: '#E8E4DC' }}
              >
                {/* Large map pin in mist bg circle */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ backgroundColor: '#E8E4DC', boxShadow: 'inset 0 2px 6px rgba(44,44,44,0.10)' }}
                >
                  <MapPinIcon
                    className="w-9 h-9"
                    style={{ color: '#4A5240' }}
                  />
                </div>

                <h3
                  className="font-serif font-light tracking-[0.08em] uppercase mb-3"
                  style={{ fontSize: '1.35rem', color: '#4A5240' }}
                >
                  Find Us
                </h3>

                <p
                  className="font-sans text-sm leading-relaxed mb-4 max-w-xs"
                  style={{ color: '#2C2C2C' }}
                >
                  {address}
                </p>

                {/* Map placeholder */}
                <div
                  className="w-full rounded-2xl flex items-center justify-center py-10 px-4"
                  style={{
                    backgroundColor: '#F5F0E8',
                    border: '1.5px dashed #C9A84C',
                  }}
                >
                  <div className="text-center">
                    <MapPinIcon
                      className="w-8 h-8 mx-auto mb-2 opacity-40"
                      style={{ color: '#4A5240' }}
                    />
                    <p
                      className="font-sans text-xs uppercase tracking-[0.15em]"
                      style={{ color: '#7A8C6E' }}
                    >
                      Google Maps embed coming soon
                    </p>
                  </div>
                </div>

                {/* Directions Link */}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 font-sans text-sm uppercase tracking-[0.15em] transition-opacity duration-200 hover:opacity-70"
                  style={{ color: '#4A5240', fontWeight: 500 }}
                >
                  <span>Open in Google Maps</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </FadeIn>

            {/* Ambient detail card */}
            <FadeIn delay={0.44} direction="right">
              <div
                className="rounded-2xl px-7 py-6 flex items-center gap-5"
                style={{ backgroundColor: '#4A5240' }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(201,168,76,0.18)' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                    style={{ color: '#C9A84C' }}
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2C4 17.5 12 22 12 22z" />
                    <path d="M12 8v4l2 2" />
                  </svg>
                </div>
                <p
                  className="font-serif italic font-light text-sm leading-relaxed"
                  style={{ color: '#FAF7F2' }}
                >
                  Walk-ins welcome — or book ahead to guarantee your preferred treatment time.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3 — BOTTOM STRIP                                            */}
      {/* ------------------------------------------------------------------ */}
      <section
        className="relative py-20 px-6 overflow-hidden"
        style={{ backgroundColor: '#4A5240' }}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FAF7F2' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn delay={0.1} direction="up">
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-10" style={{ backgroundColor: 'rgba(201,168,76,0.5)' }} />
              <span className="font-script text-xl" style={{ color: '#C9A84C' }}>✦</span>
              <div className="h-px w-10" style={{ backgroundColor: 'rgba(201,168,76,0.5)' }} />
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            <p
              className="font-serif font-light leading-snug mb-3"
              style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', color: '#FAF7F2' }}
            >
              Ready to escape?
              <span
                className="mx-3 opacity-40"
                aria-hidden="true"
              >·</span>
              Book your treatment online in 2 minutes.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} direction="up">
            <p
              className="font-sans font-light text-sm mb-10"
              style={{ color: '#E8E4DC', opacity: 0.8 }}
            >
              No phone calls needed — instant confirmation, zero fuss.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} direction="up">
            <Link
              href="/book"
              className="inline-flex items-center gap-3 px-12 py-4 rounded-full font-sans text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: '#C9A84C', color: '#2C2C2C' }}
            >
              Book Now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </FadeIn>

          <FadeIn delay={0.5} direction="up">
            <div className="flex items-center justify-center gap-4 mt-10">
              <div className="h-px w-10" style={{ backgroundColor: 'rgba(201,168,76,0.5)' }} />
              <span className="font-script text-xl" style={{ color: '#C9A84C' }}>✦</span>
              <div className="h-px w-10" style={{ backgroundColor: 'rgba(201,168,76,0.5)' }} />
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  )
}
