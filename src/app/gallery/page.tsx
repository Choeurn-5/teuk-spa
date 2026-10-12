import Image from 'next/image'
import Link from 'next/link'
import { adminDb } from '@/lib/firebase/admin'
import { FadeIn } from '@/components/ui/FadeIn'
import { PageHero } from '@/components/ui/PageHero'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface GalleryItem {
  src: string
  caption: string
}

// ---------------------------------------------------------------------------
// Static fallback showcase
// ---------------------------------------------------------------------------
const STATIC_GALLERY: GalleryItem[] = [
  { src: '/images/defaults/spa_hero.jpg',           caption: 'Our Treatment Sanctuary' },
  { src: '/images/defaults/aromatherapy.jpg',       caption: 'Aromatherapy Ritual' },
  { src: '/images/defaults/herbal_compress.jpg',    caption: 'Khmer Herbal Compress' },
  { src: '/images/defaults/massage_treatment.jpg',  caption: 'Hot Stone Therapy' },
  { src: '/images/defaults/spa_herbs.jpg',          caption: 'Natural Ingredients' },
  { src: '/images/defaults/spa_therapist.jpg',      caption: 'Our Skilled Team' },
  { src: '/images/defaults/spa_package.jpg',        caption: 'The Full Journey' },
  { src: '/images/defaults/aromatherapy.jpg',       caption: 'Pure Relaxation' },
  { src: '/images/defaults/massage_treatment.jpg',  caption: 'Deep Tissue Therapy' },
]

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------
async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const snapshot = await adminDb
      .collection('gallery')
      .where('active', '==', true)
      .get()

    const docs = snapshot.docs.map(doc => {
      const d = doc.data()
      return {
        id: doc.id,
        imageUrl: d.imageUrl || '',
        caption: d.caption || '',
        order: d.order || 0,
      }
    })

    if (docs.length > 0) {
      return docs
        .sort((a, b) => a.order - b.order)
        .map(item => ({ src: item.imageUrl, caption: item.caption }))
    }
  } catch {
    // Fall through to static fallback on error
  }

  return STATIC_GALLERY
}

// ---------------------------------------------------------------------------
// Grid span helpers
// ---------------------------------------------------------------------------
function getGridClass(index: number): string {
  if (index === 0) return 'col-span-2 row-span-2'
  if (index === 3 || index === 6) return 'col-span-2'
  return 'col-span-1 row-span-1'
}

function getAspectClass(index: number): string {
  if (index === 0) return 'aspect-square'
  if (index === 3 || index === 6) return 'aspect-video'
  return 'aspect-square'
}

// ---------------------------------------------------------------------------
// Page Component (Async Server Component)
// ---------------------------------------------------------------------------
export default async function GalleryPage() {
  const items = await getGalleryItems()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2', color: '#2C2C2C' }}>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1 — HERO — Generous Height Luxury Ken Burns               */}
      {/* ------------------------------------------------------------------ */}
      <PageHero
        image="/images/defaults/aromatherapy.jpg"
        badge="✦ Visual Atmosphere & Treatment Suites"
        scriptTag="A Glimpse into Stillness"
        title="Sanctuary"
        titleAccent="Gallery"
        description="Immerse yourself in our tranquil spaces. Natural clay, dark botanical woodwork, ambient candlelight, and organic herbal apothecary."
        heightClass="h-screen min-h-[750px] lg:min-h-[820px]"
        actions={{
          primary: { label: "Book an Appointment", href: "/book" },
          secondary: { label: "Our Treatments", href: "/treatments" },
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2 — PULL QUOTE                                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: '#FAF7F2' }}>
        <FadeIn delay={0.1} direction="up">
          <div className="max-w-2xl mx-auto">
            {/* Decorative flourish */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12" style={{ backgroundColor: '#C9A84C' }} />
              <span className="font-script text-2xl" style={{ color: '#C9A84C' }}>✦</span>
              <div className="h-px w-12" style={{ backgroundColor: '#C9A84C' }} />
            </div>

            <blockquote
              className="font-serif italic font-light leading-relaxed"
              style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)', color: '#4A5240' }}
            >
              "Every corner of Teuk is designed to quiet the mind — where ancient Khmer
              healing wisdom meets the serenity of Siem Reap's timeless beauty."
            </blockquote>

            <p className="mt-5 font-sans text-sm uppercase tracking-[0.2em]" style={{ color: '#7A8C6E' }}>
              — Teuk Massage &amp; Spa
            </p>

            {/* Decorative flourish bottom */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-12" style={{ backgroundColor: '#C9A84C' }} />
              <span className="font-script text-2xl" style={{ color: '#C9A84C' }}>✦</span>
              <div className="h-px w-12" style={{ backgroundColor: '#C9A84C' }} />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3 — MASONRY GRID                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="px-4 md:px-8 pb-16" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((item, index) => {
              const gridClass = getGridClass(index)
              const aspectClass = getAspectClass(index)
              const delay = 0.05 * (index + 1)

              return (
                <FadeIn key={index} delay={delay} direction="up" className={gridClass}>
                  <div
                    className={`relative overflow-hidden rounded-2xl group cursor-pointer ${aspectClass} w-full`}
                  >
                    <Image
                      src={item.src}
                      alt={item.caption}
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />

                    {/* Hover gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(44,44,44,0.82) 0%, rgba(74,82,64,0.3) 60%, transparent 100%)',
                      }}
                    >
                      <div className="p-4 md:p-6 w-full">
                        <p
                          className="font-serif italic font-light"
                          style={{
                            color: '#FAF7F2',
                            fontSize: index === 0 ? '1.35rem' : '1rem',
                            lineHeight: 1.3,
                          }}
                        >
                          {item.caption}
                        </p>
                        {index === 0 && (
                          <div
                            className="mt-2 w-8 h-px"
                            style={{ backgroundColor: '#C9A84C' }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Permanent subtle vignette on first/featured item */}
                    {index === 0 && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            'radial-gradient(ellipse at center, transparent 40%, rgba(44,44,44,0.3) 100%)',
                        }}
                      />
                    )}
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4 — BOTTOM CTA                                              */}
      {/* ------------------------------------------------------------------ */}
      <section
        className="relative py-20 px-6 overflow-hidden"
        style={{ backgroundColor: '#2C2C2C' }}
      >
        {/* Decorative background elements */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn delay={0.1} direction="up">
            {/* Script accent */}
            <p
              className="font-script mb-2"
              style={{ fontSize: '2.2rem', color: '#C9A84C', lineHeight: 1.1 }}
            >
              Share the Journey
            </p>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            <h2
              className="font-serif font-light tracking-[0.1em] uppercase mb-6"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#FAF7F2' }}
            >
              Add Your Memories
            </h2>
          </FadeIn>

          <FadeIn delay={0.3} direction="up">
            <div
              className="w-16 h-px mx-auto mb-8"
              style={{ background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }}
            />
          </FadeIn>

          <FadeIn delay={0.4} direction="up">
            <p
              className="font-sans font-light leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ fontSize: '1.05rem', color: '#E8E4DC' }}
            >
              Have you visited Teuk Massage &amp; Spa? We would love to feature your moments
              of serenity. Begin your journey with us and let us craft an unforgettable
              experience worthy of remembering.
            </p>
          </FadeIn>

          <FadeIn delay={0.5} direction="up">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-sans text-sm uppercase tracking-[0.18em] font-medium transition-all duration-300 hover:opacity-90 hover:scale-105"
                style={{ backgroundColor: '#C9A84C', color: '#2C2C2C' }}
              >
                <span>Book Your Visit</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-sans text-sm uppercase tracking-[0.18em] font-medium transition-all duration-300 hover:bg-white/10"
                style={{
                  border: '1px solid rgba(201,168,76,0.5)',
                  color: '#FAF7F2',
                }}
              >
                Explore Services
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  )
}
