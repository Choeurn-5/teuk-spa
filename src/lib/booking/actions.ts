"use server";

import { adminDb } from "../firebase/admin";
import { getAvailableSlots } from "./capacity";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import {
  sendBookingAlert,
  sendGuestBookingConfirmation,
  sendGuestBookingCancellation,
} from "@/lib/telegram/bot";

export async function checkAvailableSlots(dateStr: string, durationMinutes: number, guests: number) {
  // Expose the capacity logic to the client securely
  return await getAvailableSlots(dateStr, durationMinutes, guests);
}

export async function submitBookingRequest(formData: any) {
  try {
    const { service, date, time, guests, guestDetails, durationMinutes, price, source, telegramUser } = formData;
    
    // Total intervals needed (duration + 15 min buffer)
    const interval = 30;
    const intervalsNeeded = Math.ceil((durationMinutes + 15) / interval);
    
    // Calculate intervals to block
    const [h, m] = time.split(":").map(Number);
    let startMinutes = h * 60 + m;
    const intervalsToBlock: string[] = [];
    
    for (let i = 0; i < intervalsNeeded; i++) {
      const hh = Math.floor(startMinutes / 60).toString().padStart(2, "0");
      const mm = (startMinutes % 60).toString().padStart(2, "0");
      intervalsToBlock.push(`${hh}:${mm}`);
      startMinutes += interval;
    }

    // 1. Run a Firestore Transaction to strictly prevent double booking!
    const bookingRef = await adminDb.runTransaction(async (transaction) => {
      const dayLoadRef = adminDb.collection("dayLoad").doc(date);
      const dayLoadDoc = await transaction.get(dayLoadRef);
      
      const currentLoad = dayLoadDoc.exists ? dayLoadDoc.data()?.intervals || {} : {};
      
      // Verify capacity again inside the transaction lock
      const maxCapacity = 3; // From rules
      for (const timeStr of intervalsToBlock) {
        if ((currentLoad[timeStr] || 0) + guests > maxCapacity) {
          throw new Error("Sorry, this time slot was just taken by someone else.");
        }
      }

      // 2. Generate TS-XXXX Reference Number
      const counterRef = adminDb.collection("counters").doc("booking");
      const counterDoc = await transaction.get(counterRef);
      const nextRefNum = counterDoc.exists ? counterDoc.data()?.next || 1000 : 1000;
      const reference = `TS-${nextRefNum}`;

      // 3. Update the Day Load
      const newLoad = { ...currentLoad };
      for (const timeStr of intervalsToBlock) {
        newLoad[timeStr] = (newLoad[timeStr] || 0) + guests;
      }
      
      transaction.set(dayLoadRef, { intervals: newLoad }, { merge: true });
      transaction.set(counterRef, { next: nextRefNum + 1 }, { merge: true });

      // 4. Create the Booking Document
      const newBookingRef = adminDb.collection("bookings").doc();
      const bookingData = {
        reference,
        status: "new",
        source: source || "web",
        telegramUser: telegramUser || null,
        serviceId: service.id,
        serviceName: service.name,
        durationMinutes,
        price,
        guests,
        date,
        time,
        guest: {
          name: guestDetails.name,
          phone: guestDetails.phone,
          email: guestDetails.email || null,
          hotel: guestDetails.hotel || null,
          notes: guestDetails.notes || null,
        },
        payment: { status: "unpaid", method: "pay_at_spa" },
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      transaction.set(newBookingRef, bookingData);
      
      // Also log the event
      const eventRef = newBookingRef.collection("events").doc();
      transaction.set(eventRef, {
        type: "created",
        by: source === "telegram" ? "telegram_user" : "guest",
        at: FieldValue.serverTimestamp()
      });

      return { reference, bookingId: newBookingRef.id };
    });

    const { reference, bookingId } = bookingRef;
    const alertPayload = {
      bookingId,
      reference,
      source: source || "web",
      telegramUser: telegramUser || null,
      guestName: guestDetails.name,
      phone: guestDetails.phone,
      email: guestDetails.email,
      hotel: guestDetails.hotel,
      notes: guestDetails.notes,
      serviceName: service.name,
      durationMinutes,
      date,
      time,
      guests,
      price,
    };

    // Send the Staff Alert with Confirm & Decline buttons to Staff Bot (@TeukSpaBot)
    try {
      await sendBookingAlert(alertPayload);
    } catch (telegramErr) {
      console.error("Failed to send Telegram staff alert:", reference, telegramErr);
    }

    revalidatePath("/admin/bookings");
    return { success: true, reference };

  } catch (error: any) {
    console.error("Booking transaction failed:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function updateBookingStatus(bookingId: string, newStatus: string) {
  try {
    const bookingRef = adminDb.collection("bookings").doc(bookingId);
    let finalBookingData: any = null;

    await adminDb.runTransaction(async (transaction) => {
      const doc = await transaction.get(bookingRef);
      if (!doc.exists) throw new Error("Booking not found");
      const bookingData = doc.data()!;
      finalBookingData = { id: doc.id, ...bookingData };

      // If we are declining or cancelling, we must release the capacity!
      if (newStatus === "declined" || newStatus === "cancelled") {
        const { date, time, durationMinutes, guests } = bookingData;
        const dayLoadRef = adminDb.collection("dayLoad").doc(date);
        const dayLoadDoc = await transaction.get(dayLoadRef);
        
        if (dayLoadDoc.exists) {
          const currentLoad = dayLoadDoc.data()?.intervals || {};
          const newLoad = { ...currentLoad };
          
          const interval = 30;
          const intervalsNeeded = Math.ceil((durationMinutes + 15) / interval);
          const [h, m] = time.split(":").map(Number);
          let startMinutes = h * 60 + m;
          
          for (let i = 0; i < intervalsNeeded; i++) {
            const hh = Math.floor(startMinutes / 60).toString().padStart(2, "0");
            const mm = (startMinutes % 60).toString().padStart(2, "0");
            const timeStr = `${hh}:${mm}`;
            
            // Release the capacity
            if (newLoad[timeStr] !== undefined) {
              newLoad[timeStr] = Math.max(0, newLoad[timeStr] - guests);
            }
            startMinutes += interval;
          }
          
          transaction.set(dayLoadRef, { intervals: newLoad }, { merge: true });
        }
      }

      // Update the booking status
      transaction.update(bookingRef, { 
        status: newStatus,
        updatedAt: FieldValue.serverTimestamp()
      });
      
      // Log the event
      const eventRef = bookingRef.collection("events").doc();
      transaction.set(eventRef, {
        type: newStatus,
        by: "admin",
        at: FieldValue.serverTimestamp()
      });
    });

    // Notify guest via Customer Bot if booked via Telegram
    if (finalBookingData?.telegramUser?.id) {
      const guestPayload = {
        bookingId,
        reference: finalBookingData.reference,
        source: finalBookingData.source || "telegram",
        telegramUser: finalBookingData.telegramUser,
        guestName: finalBookingData.guest?.name || "Guest",
        phone: finalBookingData.guest?.phone || "",
        email: finalBookingData.guest?.email,
        hotel: finalBookingData.guest?.hotel,
        notes: finalBookingData.guest?.notes,
        serviceName: finalBookingData.serviceName,
        durationMinutes: finalBookingData.durationMinutes,
        date: finalBookingData.date,
        time: finalBookingData.time,
        guests: finalBookingData.guests || 1,
        price: finalBookingData.price,
      };

      if (newStatus === "confirmed") {
        try {
          // Send official confirmation message + PDF invoice
          await sendGuestBookingConfirmation(guestPayload);
        } catch (err) {
          console.error("Failed to send guest confirmation on confirm:", err);
        }
      } else if (newStatus === "declined" || newStatus === "cancelled") {
        try {
          // Send polite decline / cancellation notification
          await sendGuestBookingCancellation(guestPayload, newStatus as any);
        } catch (err) {
          console.error("Failed to send guest cancellation on decline/cancel:", err);
        }
      }
    }

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update status:", error);
    return { success: false, error: error.message };
  }
}
