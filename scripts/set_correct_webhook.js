require("dotenv").config({ path: ".env.local" });

const adminToken = process.env.TELEGRAM_STAFF_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const customerToken = process.env.TELEGRAM_CUSTOMER_BOT_TOKEN;

// Use www.teukmassageandspa.com to avoid 308 redirect from apex domain
const webhookUrl = "https://www.teukmassageandspa.com/api/telegram/webhook";
const appUrl = "https://www.teukmassageandspa.com/telegram";

async function updateWebhooks() {
  console.log("Updating webhooks to:", webhookUrl);

  // 1. Staff Bot
  const staffRes = await fetch(`https://api.telegram.org/bot${adminToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}&drop_pending_updates=false`);
  console.log("Staff bot webhook update:", await staffRes.json());

  // 2. Customer Bot
  const custRes = await fetch(`https://api.telegram.org/bot${customerToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}&drop_pending_updates=false`);
  console.log("Customer bot webhook update:", await custRes.json());

  // Check updated webhook info
  const staffInfo = await fetch(`https://api.telegram.org/bot${adminToken}/getWebhookInfo`).then(r => r.json());
  console.log("Staff bot updated info:", JSON.stringify(staffInfo, null, 2));

  const custInfo = await fetch(`https://api.telegram.org/bot${customerToken}/getWebhookInfo`).then(r => r.json());
  console.log("Customer bot updated info:", JSON.stringify(custInfo, null, 2));
}

updateWebhooks();
