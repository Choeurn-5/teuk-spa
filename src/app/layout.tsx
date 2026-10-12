import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pinyon",
});

export const metadata: Metadata = {
  title: "Teuk Massage & Spa | Siem Reap",
  description: "Relax. Restore. Renew. Natural, traditional treatments in Siem Reap.",
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${jost.variable} ${pinyon.variable}`}>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col selection:bg-sage selection:text-cream">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <MobileBottomBar />
      </body>
    </html>
  );
}
