"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Calendar } from "lucide-react";

export function MobileBottomBar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/telegram")) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#161813]/95 backdrop-blur-lg border-t border-[#C9A84C]/25 shadow-[0_-8px_20px_rgba(0,0,0,0.3)] lg:hidden">
      <div className="flex items-center justify-around h-16 px-2 pb-safe">
        <a 
          href="tel:+8551770835459" 
          className="flex flex-col items-center justify-center flex-1 h-full text-white/70 hover:text-[#C9A84C] transition-colors"
        >
          <Phone className="w-4 h-4 mb-1 text-[#C9A84C]" strokeWidth={1.5} />
          <span className="text-[9.5px] uppercase tracking-[0.2em] font-medium">Call</span>
        </a>
        
        <a 
          href="https://wa.me/8551770835459" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 h-full text-white/70 hover:text-[#C9A84C] transition-colors"
        >
          <MessageCircle className="w-4 h-4 mb-1 text-[#C9A84C]" strokeWidth={1.5} />
          <span className="text-[9.5px] uppercase tracking-[0.2em] font-medium">WhatsApp</span>
        </a>
        
        <Link 
          href="/book" 
          className="flex flex-col items-center justify-center flex-1 h-full text-[#DFC26D] hover:text-white transition-colors"
        >
          <Calendar className="w-4 h-4 mb-1 text-[#DFC26D]" strokeWidth={1.5} />
          <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold">Book</span>
        </Link>
      </div>
    </div>
  );
}
