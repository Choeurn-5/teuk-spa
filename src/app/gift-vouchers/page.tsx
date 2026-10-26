import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { Sparkles, Phone, Send, ArrowRight, Clock } from "lucide-react";
import { getSiteSettings } from "@/lib/content/getters";

export const metadata = {
  title: "Gift Vouchers | Teuk Massage & Spa",
  description: "Bespoke gift certificates for Teuk Massage & Spa in Siem Reap. Coming Soon.",
};

export default async function GiftVouchersPage() {
  const settings = (await getSiteSettings()) || {};

  return (
    <div className="flex flex-col w-full bg-[#FAF7F2] text-[#141612] min-h-screen">
      {/* ─── 1. HERO SECTION ─── */}
      <PageHero
        image={settings.heroImage4 || "/images/defaults/spa_package.jpg"}
        badge="✦ Teuk Sanctuary · Siem Reap"
        scriptTag="The Art of Thoughtful Gifting"
        title="Gift"
        titleAccent="Vouchers"
        description="Bestow the blessing of tranquil stillness, natural healing, and restored harmony."
        heightClass="h-[65vh] min-h-[500px] lg:min-h-[580px]"
        actions={{
          primary: { label: "Explore Treatments", href: "/treatments" },
          secondary: { label: "Book a Session", href: "/book" },
        }}
      />

      {/* ─── 2. COMING SOON LETTER SECTION ─── */}
      <section className="px-6 py-20 md:py-28 max-w-4xl mx-auto w-full text-center">
        <FadeIn direction="up" delay={0.1}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#4A5240]/10 border border-[#4A5240]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#4A5240] font-medium font-sans">
              Exclusive Sanctuary Offering
            </span>
          </div>

          {/* Heading */}
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#4A5240] mb-4 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Coming Soon
          </h2>

          <p
            className="text-2xl md:text-3xl text-[#C9A84C] font-normal mb-10 italic"
            style={{ fontFamily: "'Pinyon Script', cursive" }}
          >
            A gentle ritual of giving is being crafted for you
          </p>

          {/* Luxury Letter Card Frame */}
          <div className="relative bg-white/90 backdrop-blur-sm border border-[#C9A84C]/30 rounded-3xl p-8 md:p-14 shadow-lg shadow-black/5 text-left mb-12">
            {/* Decorative Corner Accents */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#C9A84C]/40 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C9A84C]/40 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C9A84C]/40 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C9A84C]/40 rounded-br-lg pointer-events-none" />

            <div className="space-y-6 text-[#2C2C2C]/80 text-base md:text-lg leading-relaxed font-sans">
              <p className="font-serif text-2xl text-[#4A5240] italic">
                Dear Valued Guest,
              </p>

              <p>
                We are currently curating an exquisite collection of digital and handcrafted physical gift certificates for <strong>Teuk Massage & Spa</strong>. Our online voucher studio will soon allow you to customize personalized treatment rituals and bespoke gift cards seamlessly.
              </p>

              <p>
                In the meantime, if you would like to arrange a bespoke gift voucher for a loved one, birthday, anniversary, or special occasion, our sanctuary reception team is delighted to prepare it for you directly.
              </p>

              <div className="pt-6 border-t border-[#4A5240]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-lg text-[#4A5240] font-medium">Teuk Massage & Spa</p>
                  <p className="text-xs text-[#2C2C2C]/60 uppercase tracking-widest font-sans">
                    Siem Reap, Kingdom of Cambodia
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#C9A84C] uppercase tracking-wider bg-[#FAF7F2] px-4 py-2 rounded-full border border-[#C9A84C]/20">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Online Studio Launching Soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiries Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://t.me/+85570835459"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#4A5240] text-[#FAF7F2] text-sm tracking-wider uppercase font-medium hover:bg-[#C9A84C] transition-all duration-300 shadow-md shadow-[#4A5240]/15"
            >
              <Send className="w-4 h-4" />
              <span>Inquire via Telegram (070 835 459)</span>
            </a>

            <a
              href="tel:+85592835459"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white border border-[#4A5240]/30 text-[#4A5240] text-sm tracking-wider uppercase font-medium hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              <span>Call Reception (092 835 459)</span>
            </a>

            <Link
              href="/treatments"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-[#4A5240] text-sm tracking-wider uppercase font-medium hover:text-[#C9A84C] transition-all duration-300"
            >
              <span>Explore Treatments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
