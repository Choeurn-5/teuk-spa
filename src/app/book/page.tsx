import { getPackages, getTreatments } from "@/lib/content/getters";
import { BookingStepper } from "./BookingStepper";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHero } from "@/components/ui/PageHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment | Teuk Massage & Spa",
  description: "Request your moment of calm. We will confirm your booking within 30 minutes.",
};

export default async function BookPage() {
  const [packages, treatments] = await Promise.all([
    getPackages(),
    getTreatments()
  ]);

  return (
    <div className="flex flex-col w-full bg-cream min-h-screen">
      {/* ─── 1. HERO — Generous Height Luxury Ken Burns ─── */}
      <PageHero
        image="/images/defaults/massage_treatment.jpg"
        badge="✦ Instant Concierge Confirmation · No Prepayment Required"
        scriptTag="Your Sanctuary Awaits"
        title="Reserve Your"
        titleAccent="Ritual"
        description="Select your bespoke experience, choose a time that suits your rhythm, and let our dedicated therapists prepare your private treatment suite."
        heightClass="h-screen min-h-[750px] lg:min-h-[820px]"
        actions={{
          primary: { label: "Begin Reservation", href: "#booking-step" },
          secondary: { label: "View Treatments", href: "/treatments" },
        }}
      />

      <section id="booking-step" className="px-4 py-20 max-w-4xl mx-auto w-full">
        <FadeIn delay={0.1}>
          <BookingStepper packages={packages} treatments={treatments} />
        </FadeIn>
      </section>
    </div>
  );
}
