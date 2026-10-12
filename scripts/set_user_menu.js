require("dotenv").config({ path: ".env.local" });

const token = process.env.TELEGRAM_STAFF_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_STAFF_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const tunnelBase = process.env.NEXT_PUBLIC_APP_URL || "https://teuk-spas.vercel.app";
const tunnelUrl = `${tunnelBase}/telegram`;

if (!token || !chatId) {
  console.error("Missing TELEGRAM_STAFF_BOT_TOKEN or TELEGRAM_STAFF_CHAT_ID in .env.local");
  process.exit(1);
}

async function setMenu() {
  const url = `https://api.telegram.org/bot${token}/setChatMenuButton`;
  const body = {
    chat_id: chatId,
    menu_button: {
      type: "web_app",
      text: "Book Ritual 🌿",
      web_app: {
        url: tunnelUrl
      }
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const json = await res.json();
  console.log("Set menu button for user chat:", JSON.stringify(json));
}

setMenu();
