"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Send, MapPin } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith("/admin") || pathname.startsWith("/telegram")) {
    return null;
  }

  return (
    <footer className="bg-olive text-cream pt-16 pb-24 lg:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand Column */}
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
          <p className="text-sm opacity-80 mt-4 max-w-xs font-light leading-relaxed">
            Step inside, slow down, and let the day melt away. A sanctuary of calm in the heart of Siem Reap.
          </p>
          <div className="flex space-x-4 pt-4">
            <a href="#" className="hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="hover:text-gold transition-colors"><Send className="w-5 h-5" strokeWidth={1.5} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs tracking-widest uppercase font-medium text-gold mb-2">Explore</h4>
          <Link href="/treatments" className="text-sm opacity-80 hover:opacity-100 hover:text-gold transition-colors">Treatments</Link>
          <Link href="/packages" className="text-sm opacity-80 hover:opacity-100 hover:text-gold transition-colors">Packages</Link>
          <Link href="/gift-vouchers" className="text-sm opacity-80 hover:opacity-100 hover:text-gold transition-colors">Gift Vouchers</Link>
          <Link href="/about" className="text-sm opacity-80 hover:opacity-100 hover:text-gold transition-colors">Our Story</Link>
          <Link href="/gallery" className="text-sm opacity-80 hover:opacity-100 hover:text-gold transition-colors">Gallery</Link>
        </div>

        {/* Hours */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs tracking-widest uppercase font-medium text-gold mb-2">Opening Hours</h4>
          <p className="text-sm opacity-80 font-light">
            Monday – Sunday<br />
            10:00 AM – 10:00 PM
          </p>
          <p className="text-sm opacity-80 font-light mt-2">
            Last appointment at 8:30 PM
          </p>
        </div>

        {/* Contact */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs tracking-widest uppercase font-medium text-gold mb-2">Contact Us</h4>
          <p className="text-sm opacity-80 font-light">
            <a href="tel:+8551770835459" className="hover:text-gold transition-colors">017 70 83 54 59</a>
          </p>
          <p className="text-sm opacity-80 font-light">
            <a href="mailto:teukspa@gmail.com" className="hover:text-gold transition-colors">teukspa@gmail.com</a>
          </p>
          <div className="flex items-start space-x-2 mt-2 opacity-80 font-light">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gold" strokeWidth={1.5} />
            <p className="text-sm">
              Pakambor St, Monul I<br />
              Sangkat Svaydangkum<br />
              Siem Reap
            </p>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-sage/30 flex flex-col md:flex-row items-center justify-between text-xs opacity-60 font-light">
        <p>&copy; {currentYear} Teuk Massage & Spa. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/policy" className="hover:text-gold transition-colors">Booking Policy</Link>
          <Link href="/admin" className="hover:text-gold transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
