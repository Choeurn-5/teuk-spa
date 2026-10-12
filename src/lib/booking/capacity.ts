import { adminDb } from "../firebase/admin";
import { format, addMinutes, isBefore, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export interface BookingSlot {
  time: string; // HH:mm
  available: boolean;
}

/**
 * Calculates available slots for a specific date and service.
 */
export async function getAvailableSlots(
  dateStr: string, // YYYY-MM-DD
  durationMinutes: number,
  guests: number
): Promise<BookingSlot[]> {
  const timezone = "Asia/Phnom_Penh";
  
  // 1. Fetch Rules
  const rulesDoc = await adminDb.collection("bookingRules").doc("public").get();
  const rules = rulesDoc.data();
  if (!rules) return [];

  // 2. Fetch Day Load (Capacity currently booked for this specific day)
  const dayLoadDoc = await adminDb.collection("dayLoad").doc(dateStr).get();
  const dayLoad = dayLoadDoc.exists ? dayLoadDoc.data()?.intervals || {} : {};

  const slots: BookingSlot[] = [];
  
  // Basic settings
  const openTime = "10:00"; // Simplification for now (would read from rules.weeklyHours)
  const closeTime = "22:00";
  const interval = rules.slotIntervalMinutes || 30;
  const buffer = rules.bufferMinutes || 15;
  const maxCapacity = rules.therapistsOnDuty || 3;

  // 3. Generate all possible intervals for the day
  let currentTime = parseTimeToMinutes(openTime);
  const closingTimeMinutes = parseTimeToMinutes(closeTime);
  
  // We need to know current time in Cambodia to enforce minNotice
  const nowInCambodia = toZonedTime(new Date(), timezone);
  const minNoticeMinutes = rules.minNoticeMinutes || 120;
  const targetDate = new Date(`${dateStr}T00:00:00`);

  while (currentTime + durationMinutes <= closingTimeMinutes) {
    const timeString = formatMinutesToTime(currentTime);
    
    // Total intervals this booking will span (duration + buffer)
    const intervalsNeeded = Math.ceil((durationMinutes + buffer) / interval);
    
    let isAvailable = true;

    // Check if it violates min notice
    const slotDateInCambodia = toZonedTime(new Date(`${dateStr}T${timeString}:00`), timezone);
    const minutesUntilSlot = (slotDateInCambodia.getTime() - nowInCambodia.getTime()) / 60000;
    
    if (minutesUntilSlot < minNoticeMinutes) {
      isAvailable = false;
    } else {
      // Check capacity for EVERY 30-min block this booking touches
      for (let i = 0; i < intervalsNeeded; i++) {
        const checkTimeStr = formatMinutesToTime(currentTime + (i * interval));
        const currentUsage = dayLoad[checkTimeStr] || 0;
        
        // If adding our guests exceeds total therapists/rooms, this slot is invalid
        if (currentUsage + guests > maxCapacity) {
          isAvailable = false;
          break;
        }
      }
    }

    slots.push({
      time: timeString,
      available: isAvailable
    });

    currentTime += interval;
  }

  return slots;
}

// Helpers
function parseTimeToMinutes(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function formatMinutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}
