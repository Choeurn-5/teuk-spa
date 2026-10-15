require("dotenv").config({ path: ".env.local" });

const adminToken = process.env.TELEGRAM_STAFF_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const customerToken = process.env.TELEGRAM_CUSTOMER_BOT_TOKEN;
const adminChatId = process.env.TELEGRAM_STAFF_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

const tunnelBase = (process.argv[2] || process.env.NEXT_PUBLIC_APP_URL || "https://teuk-spa.vercel.app").replace(/\/$/, "");
const appUrl = `${tunnelBase}/telegram`;
const webhookUrl = `${tunnelBase}/api/telegram/webhook`;
console.log(`Setting up bots with Base URL: ${tunnelBase}`);

if (!adminToken || !customerToken) {
  console.error("Missing TELEGRAM_STAFF_BOT_TOKEN or TELEGRAM_CUSTOMER_BOT_TOKEN in .env.local");
  process.exit(1);
}

async function setup() {
  console.log("=== 1. CONFIGURING ADMIN BOT (@TeukSpaBot) ===");
  // Reset admin menu button to default
  const resetAdminMb = await fetch(`https://api.telegram.org/bot${adminToken}/setChatMenuButton`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menu_button: { type: "default" } })
  });
  console.log("Admin default menu button reset:", await resetAdminMb.json());

  // Reset admin chat-specific menu button
  const resetAdminChatMb = await fetch(`https://api.telegram.org/bot${adminToken}/setChatMenuButton`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: adminChatId, menu_button: { type: "default" } })
  });
  console.log("Admin user chat menu button reset:", await resetAdminChatMb.json());

  // Set webhook for admin bot to receive inline button callback queries (confirm/decline)
  const setAdminWh = await fetch(`https://api.telegram.org/bot${adminToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
  console.log("Admin webhook set:", await setAdminWh.json());

  console.log("\n=== 2. CONFIGURING CUSTOMER BOT (@TeukSpaBookingBot) ===");
  // Set customer bot description
  await fetch(`https://api.telegram.org/bot${customerToken}/setMyDescription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: "Welcome to Teuk Massage & Spa in Siem Reap, Cambodia.\n\nReserve bespoke traditional Khmer rituals and natural botanical treatments directly in Telegram. No prepayment required."
    })
  });

  await fetch(`https://api.telegram.org/bot${customerToken}/setMyShortDescription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      short_description: "Official booking concierge for Teuk Massage & Spa 🌿"
    })
  });

  // Set default Menu Button on customer bot
  const setCustMb = await fetch(`https://api.telegram.org/bot${customerToken}/setChatMenuButton`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      menu_button: {
        type: "web_app",
        text: "Book Ritual 🌿",
        web_app: { url: appUrl }
      }
    })
  });
  console.log("Customer bot Menu Button set:", await setCustMb.json());

  // Set webhook for customer bot to handle /start and incoming messages
  const setCustWh = await fetch(`https://api.telegram.org/bot${customerToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
  console.log("Customer bot webhook set:", await setCustWh.json());

  console.log("\n✅ TWO-BOT ARCHITECTURE SETUP COMPLETE!");
}

setup();
