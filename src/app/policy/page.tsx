import { adminDb } from "@/lib/firebase/admin";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHero } from "@/components/ui/PageHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Policy | Teuk Massage & Spa",
  description: "Important information regarding booking, cancellations, and our spa etiquette.",
};

async function getPolicy() {
  const doc = await adminDb.collection("bookingRules").doc("public").get();
  return doc.exists ? doc.data() : null;
}

export default async function PolicyPage() {
  const rules: any = await getPolicy();

  return (
    <div className="flex flex-col w-full bg-cream min-h-screen">
      <PageHero
        image="/images/defaults/spa_hero.jpg"
        badge="✦ Sanctuary Guidelines & Guest Care"
        scriptTag="Sanctuary Etiquette"
        title="Booking"
        titleAccent="Policy"
        description="To preserve pure peace and seamless sanctuary journeys for every guest, please review our arrival etiquette and cancellation guidelines."
        heightClass="h-screen min-h-[750px] lg:min-h-[820px]"
        actions={{
          primary: { label: "Read Guidelines", href: "#policy-content" },
          secondary: { label: "Book an Appointment", href: "/book" },
        }}
      />

      <section id="policy-content" className="px-4 py-20 max-w-3xl mx-auto w-full">
        <FadeIn delay={0.1} className="bg-warm border border-mist p-8 md:p-12 rounded-2xl">
          <div className="prose prose-olive max-w-none text-ink/80 font-light leading-relaxed whitespace-pre-line">
            {rules?.policyText || "Our booking policy is currently being updated."}
          </div>

          <div className="mt-12 pt-8 border-t border-mist/50">
            <h3 className="font-serif text-2xl text-olive mb-4">Spa Etiquette</h3>
            <ul className="space-y-4 text-ink/80 font-light text-sm">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 mr-3 shrink-0" />
                <p><strong>Arrival Time:</strong> Please arrive at least 15 minutes prior to your scheduled appointment to allow time for consultation and a welcome drink.</p>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 mr-3 shrink-0" />
                <p><strong>Late Arrivals:</strong> If you are running late, we will hold your room for {rules?.lateHoldMinutes || 15} minutes. However, your treatment time may be shortened to ensure the next guest is not delayed.</p>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 mr-3 shrink-0" />
                <p><strong>Health Conditions:</strong> Please advise us of any health conditions, allergies, or injuries when making your booking.</p>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 mr-3 shrink-0" />
                <p><strong>Quiet Environment:</strong> To preserve the tranquil environment of the spa, we kindly ask that you turn your mobile phone to silent upon arrival.</p>
              </li>
            </ul>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
