"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Send, MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith("/admin") || pathname.startsWith("/telegram")) {
    return null;
  }

  return (
    <footer className="bg-[#242A1F] text-[#FAF7F2] pt-16 pb-24 lg:pb-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        
        {/* ─── 1. Brand Column ─── */}
        <div className="flex flex-col space-y-4">
          <Link href="/" className="inline-flex flex-col items-start group">
            <Image
              src="/images/brand/logo.png"
              alt="Teuk Spa Beauty - ទឹកស្ប៉ា"
              width={160}
              height={118}
              className="h-12 w-auto object-contain brightness-100 group-hover:brightness-110 transition-all drop-shadow"
            />
          </Link>
          <p className="text-sm text-white/70 mt-2 max-w-xs font-light leading-relaxed">
            Step inside, slow down, and let the day melt away. An authentic sanctuary of ancient Khmer healing and water rituals in the heart of Siem Reap.
          </p>

          <div className="flex space-x-3 pt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a
              href="https://t.me/TeukSpaBookingBot"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram Concierge"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors"
            >
              <Send className="w-4 h-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>

        {/* ─── 2. Quick Links ─── */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-xs tracking-[0.25em] uppercase font-medium text-[#C9A84C] mb-2 font-mono">
            Explore
          </h4>
          <Link href="/treatments" className="text-sm text-white/75 hover:text-[#C9A84C] transition-colors">
            All Treatments
          </Link>
          <Link href="/packages" className="text-sm text-white/75 hover:text-[#C9A84C] transition-colors">
            Retreat Packages
          </Link>
          <Link href="/book" className="text-sm text-white/75 hover:text-[#C9A84C] transition-colors">
            Reserve Appointment
          </Link>
          <Link href="/gift-vouchers" className="text-sm text-white/75 hover:text-[#C9A84C] transition-colors">
            Gift Vouchers
          </Link>
          <Link href="/about" className="text-sm text-white/75 hover:text-[#C9A84C] transition-colors">
            Our Philosophy & Story
          </Link>
          <Link href="/gallery" className="text-sm text-white/75 hover:text-[#C9A84C] transition-colors">
            Photo Gallery
          </Link>
        </div>

        {/* ─── 3. Hours ─── */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-xs tracking-[0.25em] uppercase font-medium text-[#C9A84C] mb-2 font-mono">
            Opening Hours
          </h4>
          <div className="flex items-start gap-2.5 text-sm text-white/80 font-light">
            <Clock className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="font-medium text-white/95">Monday – Sunday</p>
              <p className="text-white/70 text-xs mt-0.5">9:00 AM – 12:00 AM Midnight</p>
              <p className="text-[#C9A84C]/90 text-[11px] mt-1 font-mono">Last booking: 11:00 PM</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/60 font-light leading-relaxed">
              ✦ Walk-ins welcome based on therapist availability. Advance reservation recommended for signature packages.
            </p>
          </div>
        </div>

        {/* ─── 4. Contact & Mini Google Map ─── */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-xs tracking-[0.25em] uppercase font-medium text-[#C9A84C] mb-2 font-mono">
            Find Us
          </h4>

          {/* Phone */}
          <div className="flex items-center gap-2 text-sm text-white/80 font-light">
            <Phone className="w-4 h-4 text-[#C9A84C] shrink-0" strokeWidth={1.75} />
            <a href="tel:+8551770835459" className="hover:text-[#C9A84C] transition-colors">
              +855 17 708 354
            </a>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-sm text-white/80 font-light">
            <Mail className="w-4 h-4 text-[#C9A84C] shrink-0" strokeWidth={1.75} />
            <a href="mailto:info@teukmassageandspa.com" className="hover:text-[#C9A84C] transition-colors text-xs sm:text-sm break-all">
              info@teukmassageandspa.com
            </a>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-xs text-white/70 font-light leading-relaxed">
            <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" strokeWidth={1.75} />
            <p>
              Pakambor St, Mondul 1, Svaydangkum, Siem Reap, Cambodia
            </p>
          </div>

          {/* Small Interactive Google Map */}
          <div className="pt-2">
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/15 shadow-md bg-black/30 group">
              <iframe
                src="https://maps.google.com/maps?q=Pakambor+Ave,+Siem+Reap,+Cambodia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Teuk Spa Siem Reap Location"
                className="w-full h-full opacity-85 group-hover:opacity-100 transition-opacity"
              />
              <a
                href="https://maps.google.com/?q=Pakambor+St,+Mondul+1,+Svaydangkum,+Siem+Reap,+Cambodia"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#181C15]/90 hover:bg-[#181C15] text-[10px] text-[#C9A84C] border border-[#C9A84C]/40 backdrop-blur-md shadow transition-all hover:scale-105"
              >
                <span>Directions</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Bottom Bar: Copyright ─── */}
      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 font-light gap-4">
        <p>&copy; {currentYear} Teuk Massage & Spa. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          <Link href="/policy" className="hover:text-[#C9A84C] transition-colors">
            Booking Policy
          </Link>
          <span className="text-white/20">|</span>
          <Link href="/contact" className="hover:text-[#C9A84C] transition-colors">
            Contact & Directions
          </Link>
          <span className="text-white/20">|</span>
          <Link href="/admin/login" className="hover:text-[#C9A84C] transition-colors">
            Staff Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
