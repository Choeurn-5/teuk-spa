import { generateBookingPdfBuffer } from "../invoice/generatePdfInvoice";

/**
 * Telegram Bot Notification Helper for Teuk Massage & Spa
 */

function escapeHtml(str: string = ""): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function cleanWaNumber(phone: string = ""): string {
  // Strip non-digit characters, handle country code
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return `855${digits.slice(1)}`; // Cambodia default if local 0XX format
  }
  return digits;
}

export async function sendTelegramMessage(
  text: string,
  parseMode: "HTML" | null = "HTML",
  customChatId?: string | number,
  customToken?: string
): Promise<boolean> {
  const token = customToken || process.env.TELEGRAM_STAFF_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = customChatId || process.env.TELEGRAM_STAFF_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("⚠️ Telegram message skipped: token or chatId not configured.");
    return false;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const payload: Record<string, any> = {
      chat_id: chatId,
      text: text,
    };
    if (parseMode) {
      payload.parse_mode = parseMode;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Telegram API error (${response.status}):`, errorText);

      // Fallback: If HTML formatting failed (e.g. invalid entities), retry as plain text without parse_mode
      if (parseMode === "HTML") {
        console.warn("Retrying Telegram notification as plain text fallback...");
        const plainText = text.replace(/<[^>]*>/g, ""); // strip HTML tags
        const fallbackRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: plainText }),
        });
        return fallbackRes.ok;
      }
      return false;
    }

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error("Network error communicating with Telegram API:", error);
    return false;
  }
}

/**
 * Send personalized booking confirmation & PDF invoice to the guest via Customer Bot (@TeukSpaBookingBot)
 */
export async function sendGuestBookingConfirmation(data: BookingAlertPayload): Promise<boolean> {
  if (!data.telegramUser?.id) return false;

  const customerToken = process.env.TELEGRAM_CUSTOMER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  if (!customerToken) return false;

  const total = (data.price ?? 0) * (data.guests || 1);

  const guestMsg = [
    `🌿 <b>TEUK MASSAGE & SPA — RESERVATION CONFIRMATION</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Dear <b>${escapeHtml(data.guestName)}</b>,`,
    `Your private sanctuary ritual has been reserved with our front desk!`,
    ``,
    `📋 <b>Booking Reference:</b> <code>${escapeHtml(data.reference)}</code>`,
    `✨ <b>Ritual:</b> <b>${escapeHtml(data.serviceName)}</b>`,
    `⏱ <b>Duration:</b> ${data.durationMinutes} Minutes`,
    `📅 <b>Date:</b> ${data.date}`,
    `⏰ <b>Appointment Time:</b> <b>${data.time}</b>`,
    `👥 <b>Party Size:</b> ${data.guests} Guest${data.guests > 1 ? "s" : ""}`,
    `💵 <b>Total:</b> <b>$${total}</b> <i>(Pay at Spa upon arrival)</i>`,
    ``,
    data.notes ? `📝 <i>Special request noted: ${escapeHtml(data.notes)}</i>\n` : null,
    `📍 <b>Location:</b> Siem Reap, Cambodia (Near Pub Street area)`,
    `🚗 <b>Google Maps:</b> <a href="https://maps.google.com/?q=Teuk+Massage+Spa+Siem+Reap">Open in Maps</a>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🍵 Complimentary warm herbal foot soak & organic herbal tea will be served upon your arrival.`,
    `💬 Need to adjust your time? Reply directly here or message us on WhatsApp: +855 17 708 35459.`,
  ]
    .filter(Boolean)
    .join("\n");

  // 1. Send the instant greeting message
  await sendTelegramMessage(guestMsg, "HTML", data.telegramUser.id, customerToken);

  // 2. Generate and send the official PDF Invoice document
  try {
    const pdfBuffer = await generateBookingPdfBuffer({
      reference: data.reference,
      guestName: data.guestName,
      phone: data.phone,
      email: data.email,
      hotel: data.hotel,
      notes: data.notes,
      serviceName: data.serviceName,
      durationMinutes: data.durationMinutes,
      date: data.date,
      time: data.time,
      guests: data.guests,
      price: data.price,
      telegramUsername: data.telegramUser?.username,
    });

    const formData = new FormData();
    formData.append("chat_id", String(data.telegramUser.id));
    formData.append(
      "document",
      new Blob([pdfBuffer as any], { type: "application/pdf" }),
      `Teuk_Spa_Invoice_${data.reference}.pdf`
    );
    formData.append(
      "caption",
      `📄 <b>Official Reservation Invoice (${escapeHtml(data.reference)})</b>\n\nAttached is your digital receipt. No prepayment required — pay at the spa upon arrival.`
    );
    formData.append("parse_mode", "HTML");

    await fetch(`https://api.telegram.org/bot${customerToken}/sendDocument`, {
      method: "POST",
      body: formData,
    });
  } catch (pdfErr) {
    console.error("Failed to generate or send PDF invoice to guest:", pdfErr);
  }

  return true;
}

export interface BookingAlertPayload {
  bookingId?: string;
  reference: string;
  guestName: string;
  phone: string;
  email?: string | null;
  hotel?: string | null;
  notes?: string | null;
  serviceName: string;
  durationMinutes: number;
  date: string;
  time: string;
  guests: number;
  price?: number | null;
  source?: string;
  telegramUser?: {
    id?: number | string;
    username?: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

export async function sendBookingAlert(data: BookingAlertPayload): Promise<boolean> {
  const token = process.env.TELEGRAM_STAFF_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_STAFF_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("⚠️ Staff alert skipped: token or chatId not configured.");
    return false;
  }

  const wa = cleanWaNumber(data.phone);
  const total = (data.price ?? 0) * (data.guests || 1);
  const isTma = data.source === "telegram" || !!data.telegramUser;

  const tgHandle = data.telegramUser?.username 
    ? `@${data.telegramUser.username}` 
    : data.telegramUser?.id 
    ? `ID: ${data.telegramUser.id}` 
    : null;

  const message = [
    `🛎 <b>NEW BOOKING RESERVATION</b>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📋 <b>Ref:</b> <code>${escapeHtml(data.reference)}</code>`,
    isTma ? `📲 <b>Source:</b> ⚡️ Telegram Mini App` : `🌐 <b>Source:</b> Web Booking`,
    `👤 <b>Guest:</b> <b>${escapeHtml(data.guestName)}</b>`,
    tgHandle ? `✈️ <b>Telegram:</b> ${data.telegramUser?.username ? `<a href="https://t.me/${data.telegramUser.username}">${escapeHtml(tgHandle)}</a>` : escapeHtml(tgHandle)}` : null,
    `📱 <b>Phone:</b> <code>${escapeHtml(data.phone)}</code>`,
    wa ? `💬 <b>WhatsApp:</b> <a href="https://wa.me/${wa}">Open Chat (${data.phone})</a>` : null,
    data.email ? `✉️ <b>Email:</b> ${escapeHtml(data.email)}` : null,
    data.hotel ? `🏨 <b>Hotel/Room:</b> ${escapeHtml(data.hotel)}` : null,
    ``,
    `🌿 <b>Service:</b> ${escapeHtml(data.serviceName)}`,
    `⏱ <b>Duration:</b> ${data.durationMinutes} mins`,
    `📅 <b>Date:</b> ${data.date}`,
    `⏰ <b>Time:</b> ${data.time}`,
    `👥 <b>Guests:</b> ${data.guests} Guest${data.guests > 1 ? "s" : ""}`,
    `💰 <b>Total Est:</b> $${total} <i>(Pay at Spa)</i>`,
    data.notes ? `\n📝 <b>Guest Notes:</b>\n<i>${escapeHtml(data.notes)}</i>` : null,
    `━━━━━━━━━━━━━━━━━━━━`,
    data.bookingId 
      ? `⚡️ <i>Action: Tap below to Confirm or Decline directly:</i>` 
      : `⚡️ <i>Action: Open Admin Portal to Confirm or Reschedule</i>`,
  ]
    .filter(Boolean)
    .join("\n");

  const inlineKeyboard: any[][] = [];

  if (data.bookingId) {
    inlineKeyboard.push([
      { text: "✅ Confirm Booking", callback_data: `confirm:${data.bookingId}` },
      { text: "❌ Decline", callback_data: `decline:${data.bookingId}` },
    ]);
  }

  const linksRow: any[] = [];
  if (wa) {
    linksRow.push({ text: "💬 WhatsApp", url: `https://wa.me/${wa}` });
  }
  if (data.telegramUser?.username) {
    linksRow.push({ text: "✈️ Telegram", url: `https://t.me/${data.telegramUser.username}` });
  }
  if (linksRow.length > 0) {
    inlineKeyboard.push(linksRow);
  }

  const payload: any = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML",
    reply_markup: inlineKeyboard.length > 0 ? { inline_keyboard: inlineKeyboard } : undefined,
  };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to send staff alert with action buttons:", err);
    return false;
  }
}

/**
 * Send cancellation / declined notification to guest via Customer Bot (@TeukSpaBookingBot)
 */
export async function sendGuestBookingCancellation(
  data: BookingAlertPayload,
  reason: "declined" | "cancelled" = "cancelled"
): Promise<boolean> {
  if (!data.telegramUser?.id) return false;

  const customerToken = process.env.TELEGRAM_CUSTOMER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  if (!customerToken) return false;

  const msg = [
    `🌿 <b>TEUK MASSAGE & SPA — RESERVATION UPDATE</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Dear <b>${escapeHtml(data.guestName)}</b>,`,
    ``,
    reason === "declined"
      ? `We regret to inform you that we are unable to accept your reservation request <code>${escapeHtml(data.reference)}</code> for <b>${escapeHtml(data.serviceName)}</b> on <b>${data.date} at ${data.time}</b> because our treatment suites are fully occupied during this time.`
      : `Your reservation <code>${escapeHtml(data.reference)}</code> for <b>${escapeHtml(data.serviceName)}</b> on <b>${data.date} at ${data.time}</b> has been cancelled.`,
    ``,
    `🍵 We warmly invite you to select another date or contact our front desk directly:`,
    `💬 WhatsApp: +855 17 708 35459`,
    `🌿 You can book a new ritual anytime by tapping the <b>"Book Ritual"</b> button below.`,
  ].join("\n");

  return await sendTelegramMessage(msg, "HTML", data.telegramUser.id, customerToken);
}

export interface VoucherAlertPayload {
  code: string;
  senderName: string;
  recipientName: string;
  amount: number;
  phone?: string | null;
  email?: string | null;
  message?: string | null;
}

export async function sendVoucherAlert(data: VoucherAlertPayload): Promise<boolean> {
  const wa = data.phone ? cleanWaNumber(data.phone) : null;

  const msg = [
    `🎁 <b>NEW GIFT VOUCHER REQUEST</b>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🎟 <b>Code:</b> <code>${escapeHtml(data.code)}</code>`,
    `💵 <b>Amount:</b> <b>$${data.amount}</b>`,
    `👤 <b>From:</b> ${escapeHtml(data.senderName)}`,
    `💝 <b>To:</b> ${escapeHtml(data.recipientName)}`,
    data.phone ? `📱 <b>Phone:</b> <code>${escapeHtml(data.phone)}</code>` : null,
    wa ? `💬 <b>WhatsApp:</b> <a href="https://wa.me/${wa}">Chat with Buyer</a>` : null,
    data.email ? `✉️ <b>Email:</b> ${escapeHtml(data.email)}` : null,
    data.message ? `\n📝 <b>Dedication:</b>\n<i>${escapeHtml(data.message)}</i>` : null,
    `━━━━━━━━━━━━━━━━━━━━`,
    `⏳ <b>Status:</b> PENDING PAYMENT`,
    `⚡️ <i>Action: Confirm payment from customer, then activate in Admin!</i>`,
  ]
    .filter(Boolean)
    .join("\n");

  return await sendTelegramMessage(msg, "HTML");
}
