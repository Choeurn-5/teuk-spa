"use server";

import { adminDb } from "../firebase/admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { sendVoucherAlert } from "@/lib/telegram/bot";

// Generate a random voucher code like TEUK-A8B9-C2D3
function generateVoucherCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 1, 0
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TEUK-${code.slice(0, 4)}-${code.slice(4)}`;
}

export async function requestGiftVoucher(formData: any) {
  try {
    const { senderName, recipientName, amount, email, phone, message } = formData;
    const code = generateVoucherCode();

    const voucherData = {
      code,
      senderName,
      recipientName,
      amount: Number(amount),
      email,
      phone,
      message,
      status: "pending_payment", // Admin must confirm payment before it is active
      source: "web_request",
      createdAt: FieldValue.serverTimestamp(),
    };

    await adminDb.collection("vouchers").add(voucherData);

    // Send Telegram Alert reliably
    try {
      await sendVoucherAlert({
        code,
        senderName,
        recipientName,
        amount: Number(amount),
        phone,
        email,
        message,
      });
    } catch (telegramErr) {
      console.error("Failed to send Telegram voucher alert:", telegramErr);
    }

    return { success: true, code };
  } catch (error: any) {
    console.error("Voucher request failed:", error);
    return { success: false, error: "Failed to submit request." };
  }
}

export async function adminIssueVoucher(
  amount: number,
  recipientName: string,
  extra?: {
    senderName?: string;
    phone?: string;
    email?: string;
    message?: string;
    ritualName?: string;
  }
) {
  try {
    const code = generateVoucherCode();
    
    // Set expiry to 6 months from now
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 6);

    const voucherData: any = {
      code,
      recipientName: recipientName.trim(),
      amount: Number(amount),
      senderName: extra?.senderName?.trim() || "Teuk Spa Management",
      phone: extra?.phone?.trim() || "",
      email: extra?.email?.trim() || "",
      message: extra?.message?.trim() || "",
      ritualName: extra?.ritualName || "",
      status: "active",
      source: "admin",
      expiryDate: Timestamp.fromDate(expiry),
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("vouchers").add(voucherData);
    revalidatePath("/admin/vouchers");
    
    return {
      success: true,
      code,
      voucher: {
        id: docRef.id,
        ...voucherData,
        createdAt: new Date().toISOString(),
        expiryDate: expiry.toISOString(),
      },
    };
  } catch (error: any) {
    console.error("adminIssueVoucher error:", error);
    return { success: false, error: "Failed to issue voucher." };
  }
}

export async function updateVoucherStatus(id: string, newStatus: "active" | "redeemed" | "cancelled") {
  try {
    // If activating a pending voucher, set expiry to 6 months
    const updateData: any = { status: newStatus };
    const now = new Date();
    let expiryIso: string | undefined;
    let redeemedIso: string | undefined;

    if (newStatus === "active") {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 6);
      updateData.expiryDate = Timestamp.fromDate(expiry);
      expiryIso = expiry.toISOString();
    }
    if (newStatus === "redeemed") {
      updateData.redeemedAt = FieldValue.serverTimestamp();
      redeemedIso = now.toISOString();
    }

    await adminDb.collection("vouchers").doc(id).update(updateData);
    revalidatePath("/admin/vouchers");
    
    return { success: true, expiryDate: expiryIso, redeemedAt: redeemedIso };
  } catch (error: any) {
    console.error("updateVoucherStatus error:", error);
    return { success: false, error: "Failed to update status." };
  }
}

export async function deleteVoucher(id: string) {
  try {
    await adminDb.collection("vouchers").doc(id).delete();
    revalidatePath("/admin/vouchers");
    return { success: true };
  } catch (error: any) {
    console.error("deleteVoucher error:", error);
    return { success: false, error: "Failed to delete voucher." };
  }
}

