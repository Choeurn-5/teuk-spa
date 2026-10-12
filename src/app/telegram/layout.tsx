import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0F110C",
};

export const metadata: Metadata = {
  title: "Teuk Massage & Spa | Telegram Concierge",
  description: "Bespoke traditional Khmer rituals and luxury spa reservations directly in Telegram.",
};

export default function TelegramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0E100C] text-[#E8E2D5] font-sans antialiased selection:bg-[#C9A84C]/30 selection:text-[#E8E2D5]">
      {/* Telegram WebApp JavaScript SDK */}
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col pb-[env(safe-area-inset-bottom,20px)]">
        {children}
      </div>
    </div>
  );
}
