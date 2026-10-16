require("dotenv").config({ path: ".env.local" });

async function check() {
  const staff = process.env.TELEGRAM_STAFF_BOT_TOKEN;
  const cust = process.env.TELEGRAM_CUSTOMER_BOT_TOKEN;
  const sRes = await fetch(`https://api.telegram.org/bot${staff}/getWebhookInfo`).then(r => r.json());
  console.log("STAFF BOT WEBHOOK:", JSON.stringify(sRes, null, 2));
  const cRes = await fetch(`https://api.telegram.org/bot${cust}/getWebhookInfo`).then(r => r.json());
  console.log("CUSTOMER BOT WEBHOOK:", JSON.stringify(cRes, null, 2));
}

check();
