import { getPackages, getTreatments, getSiteSettings } from "@/lib/content/getters";
import { TelegramBookingClient } from "./TelegramBookingClient";

export const dynamic = "force-dynamic";

export default async function TelegramPage() {
  const [packages, treatments, settings] = await Promise.all([
    getPackages(),
    getTreatments(),
    getSiteSettings(),
  ]);

  return (
    <TelegramBookingClient
      packages={packages || []}
      treatments={treatments || []}
      settings={settings || null}
    />
  );
}
