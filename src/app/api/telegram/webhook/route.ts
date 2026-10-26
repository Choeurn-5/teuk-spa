import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/booking/actions";

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const customerToken = process.env.TELEGRAM_CUSTOMER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
    const staffToken = process.env.TELEGRAM_STAFF_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

    // ─── 1. HANDLE INLINE BUTTON TAPS (CALLBACK QUERIES FROM ADMIN) ───
    if (update.callback_query) {
      const cb = update.callback_query;
      const cbId = cb.id;
      const data = String(cb.data || "");
      const staffChatId = cb.message?.chat?.id;
      const messageId = cb.message?.message_id;

      if (data.startsWith("confirm:") || data.startsWith("decline:")) {
        const [action, bookingId] = data.split(":");
        const newStatus = action === "confirm" ? "confirmed" : "declined";

        // 1. Immediately answer Telegram Callback Query popup to stop button spinner
        if (staffToken) {
          try {
            await fetch(`https://api.telegram.org/bot${staffToken}/answerCallbackQuery`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                callback_query_id: cbId,
                text:
                  action === "confirm"
                    ? "✨ Confirmed! Guest notified & PDF invoice sent."
                    : "✕ Declined. Time slot released.",
                show_alert: false,
              }),
            });
          } catch (e) {
            console.error("Failed to answer callback query:", e);
          }
        }

        // 2. Update status in Firestore (triggers guest invoice/cancellation & email)
        let result = null;
        try {
          result = await updateBookingStatus(bookingId, newStatus);
        } catch (err) {
          console.error("Failed to update booking status in Firestore:", err);
        }

        // 3. Update message buttons to show finalized action while retaining useful contact & dashboard links
        if (staffToken && staffChatId && messageId) {
          try {
            const originalKeyboard = cb.message?.reply_markup?.inline_keyboard || [];
            // Preserve the contact and portal rows (rows 1 and beyond)
            const retainedRows = originalKeyboard.length > 1 ? originalKeyboard.slice(1) : [];

            const statusRow = [
              {
                text:
                  action === "confirm"
                    ? "✨ Confirmed (Invoice Sent)"
                    : "🔴 Declined (Slot Released)",
                callback_data: "done",
              },
            ];

            await fetch(`https://api.telegram.org/bot${staffToken}/editMessageReplyMarkup`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: staffChatId,
                message_id: messageId,
                reply_markup: {
                  inline_keyboard: [statusRow, ...retainedRows],
                },
              }),
            });
          } catch (markupErr) {
            console.error("Failed to update message reply markup:", markupErr);
          }
        }

        return NextResponse.json({ ok: true, result });
      }

      if (data === "done") {
        if (staffToken) {
          try {
            await fetch(`https://api.telegram.org/bot${staffToken}/answerCallbackQuery`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                callback_query_id: cbId,
                text: "This reservation has already been finalized.",
                show_alert: false,
              }),
            });
          } catch (e) {
            console.error("Error answering done callback query:", e);
          }
        }
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ ok: true });
    }

    // ─── 2. HANDLE GUEST INCOMING MESSAGES (/start, /book) ───
    const message = update.message || update.edited_message;
    if (!message || !message.chat) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text || "";
    const firstName = message.from?.first_name || "Guest";

    const host = req.headers.get("host") || "";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const appUrl = `${proto}://${host}/telegram`;

    // Customer Bot reply to /start or text (only in private direct chats, not groups)
    if (
      message.chat.type === "private" &&
      customerToken &&
      (text.startsWith("/start") || text.startsWith("/book") || text.length > 0)
    ) {
      // Send welcome message with WebApp button
      await fetch(`https://api.telegram.org/bot${customerToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🌿 <b>Welcome to Teuk Massage & Spa, ${firstName}!</b>\n\nStep inside, slow down, and let the day melt away. Tap the button below to browse our healing rituals and reserve your appointment directly in Telegram:`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🌿 Open Spa Booking App",
                  web_app: { url: appUrl },
                },
              ],
              [
                {
                  text: "💬 Chat with Reception",
                  url: "https://wa.me/8551770835459",
                },
              ],
            ],
          },
        }),
      });

      // Ensure Menu Button is also set for this user's chat
      await fetch(`https://api.telegram.org/bot${customerToken}/setChatMenuButton`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          menu_button: {
            type: "web_app",
            text: "Book Ritual 🌿",
            web_app: { url: appUrl },
          },
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Telegram Webhook Error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
