"use client";

import { Sparkles, Droplets, CheckCircle2, ShieldCheck, Heart, Printer } from "lucide-react";

export interface VoucherCertificateProps {
  code?: string;
  amount: string | number;
  recipientName: string;
  senderName: string;
  message?: string;
  ritualName?: string;
  occasion?: string;
  expiryDate?: string;
  isDark?: boolean;
}

export function LuxuryVoucherCertificate({
  code = "TEUK-GIFT-PREVIEW",
  amount,
  recipientName,
  senderName,
  message,
  ritualName,
  occasion,
  expiryDate = "6 Months from Activation",
  isDark = false,
}: VoucherCertificateProps) {
  const displayRecipient = recipientName?.trim() || "Someone Special";
  const displaySender = senderName?.trim() || "A Cherished Friend";
  const displayAmount = amount ? `$${amount}` : "$50";

  return (
    <div
      className={`relative w-full rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl transition-all duration-500 overflow-hidden border ${
        isDark
          ? "bg-[#141612] text-[#FAF7F2] border-[#C9A84C]/40"
          : "bg-[#FAF7F2] text-[#141612] border-[#C9A84C]/50"
      }`}
      style={{
        boxShadow: isDark
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(201, 168, 76, 0.08)"
          : "0 25px 50px -12px rgba(74, 82, 64, 0.15), inset 0 0 30px rgba(201, 168, 76, 0.06)",
      }}
    >
      {/* Decorative Guilloché Watermark Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #C9A84C 1.5px, transparent 1.5px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Outer & Inner Dual Gold Border */}
      <div className="absolute inset-3 sm:inset-4 rounded-2xl border border-[#C9A84C]/30 pointer-events-none" />
      <div className="absolute inset-4 sm:inset-5 rounded-xl border border-dashed border-[#C9A84C]/25 pointer-events-none" />

      {/* Four Ornate Corner Accents */}
      <div className="absolute top-5 left-5 text-[#C9A84C] text-xs pointer-events-none select-none">✦</div>
      <div className="absolute top-5 right-5 text-[#C9A84C] text-xs pointer-events-none select-none">✦</div>
      <div className="absolute bottom-5 left-5 text-[#C9A84C] text-xs pointer-events-none select-none">✦</div>
      <div className="absolute bottom-5 right-5 text-[#C9A84C] text-xs pointer-events-none select-none">✦</div>

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[360px] sm:min-h-[400px]">
        {/* Top Header */}
        <div className="text-center pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 mb-2">
            <Droplets className="w-3 h-3 text-[#C9A84C]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] font-jost font-medium">
              Sanctuary Gift Certificate
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-wide font-normal">
            Teuk Massage & Spa
          </h3>
          <div className="text-[11px] sm:text-xs text-[#C9A84C] font-khmer mt-0.5 tracking-wider">
            ទឹក ម៉ាស្សា និង ស្ប៉ា • Siem Reap, Angkor
          </div>

          {occasion && (
            <div className="mt-2 inline-block text-[11px] uppercase tracking-[0.2em] font-jost text-[#C9A84C]/90 font-medium">
              ✦ {occasion} ✦
            </div>
          )}
        </div>

        {/* Center Main Value / Experience */}
        <div className="my-6 text-center py-4 sm:py-6 border-t border-b border-[#C9A84C]/20">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C9A84C] font-jost font-medium mb-1">
            {ritualName ? "Dedicated Spa Experience" : "Sacred Sanctuary Value"}
          </div>

          <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#C9A84C] tracking-tight">
            {displayAmount}
          </div>

          {ritualName && (
            <div className="mt-1 font-serif italic text-base sm:text-lg opacity-90">
              {ritualName}
            </div>
          )}
        </div>

        {/* Presentation & Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left px-2 sm:px-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-jost font-medium">
              Presented To
            </div>
            <div className="font-serif text-lg sm:text-xl font-medium mt-0.5 truncate">
              {displayRecipient}
            </div>
          </div>

          <div className="sm:text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-jost font-medium">
              With Love From
            </div>
            <div className="font-serif text-lg sm:text-xl font-medium mt-0.5 truncate">
              {displaySender}
            </div>
          </div>
        </div>

        {/* Heartfelt Note */}
        {message && message.trim().length > 0 && (
          <div className="mt-4 px-4 py-2.5 rounded-xl bg-[#C9A84C]/5 border border-[#C9A84C]/15 text-center">
            <p className="font-serif italic text-xs sm:text-sm text-[#C9A84C] line-clamp-2">
              &ldquo;{message}&rdquo;
            </p>
          </div>
        )}

        {/* Bottom Voucher Code & Official Authenticity Seal */}
        <div className="mt-6 pt-4 border-t border-[#C9A84C]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Voucher Code Box */}
          <div className="flex items-center gap-2">
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-[0.2em] opacity-60 font-jost">
                Certificate Code
              </div>
              <div className="font-mono text-sm sm:text-base font-semibold tracking-widest text-[#C9A84C]">
                {code}
              </div>
            </div>
          </div>

          {/* Expiration Note */}
          <div className="text-center sm:text-right text-[10px] opacity-70 font-jost leading-tight">
            <div>Valid for 6 Months • All Modalities</div>
            <div className="text-[#C9A84C]">Redeemable at Siem Reap Sanctuary</div>
          </div>

          {/* Seal Emblem */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[9px] uppercase tracking-wider text-[#C9A84C] font-jost font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Official Seal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
