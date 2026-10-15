require("dotenv").config({ path: ".env.local" });

const token = process.env.TELEGRAM_STAFF_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_STAFF_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const tunnelBase = process.env.NEXT_PUBLIC_APP_URL || "https://teuk-spa.vercel.app";
const tunnelUrl = `${tunnelBase}/telegram`;

if (!token || !chatId) {
  console.error("Missing TELEGRAM_STAFF_BOT_TOKEN or TELEGRAM_STAFF_CHAT_ID in .env.local");
  process.exit(1);
}

async function send() {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: "🌿 <b>Welcome to Teuk Massage & Spa Concierge</b>\n\nTap below to explore our healing rituals, check real-time availability, and reserve your sanctuary suite directly inside Telegram without any prepayment.",
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🌿 Open Spa Booking App",
            web_app: { url: tunnelUrl }
          }
        ],
        [
          {
            text: "🌐 Visit Official Website",
            url: tunnelBase
          }
        ]
      ]
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const json = await res.json();
  console.log("Send result:", JSON.stringify(json));
}

send();
