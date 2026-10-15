import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkBots() {
  const customerToken = process.env.TELEGRAM_CUSTOMER_BOT_TOKEN;
  const staffToken = process.env.TELEGRAM_STAFF_BOT_TOKEN;

  console.log('=== CUSTOMER BOT (@TeukSpaBookingBot) ===');
  if (customerToken) {
    const meRes = await fetch(`https://api.telegram.org/bot${customerToken}/getMe`).then(r => r.json());
    console.log('getMe:', meRes);
    const whRes = await fetch(`https://api.telegram.org/bot${customerToken}/getWebhookInfo`).then(r => r.json());
    console.log('getWebhookInfo:', JSON.stringify(whRes, null, 2));
  } else {
    console.log('CUSTOMER BOT TOKEN NOT FOUND');
  }

  console.log('\n=== STAFF BOT (@TeukSpaBot) ===');
  if (staffToken) {
    const meRes = await fetch(`https://api.telegram.org/bot${staffToken}/getMe`).then(r => r.json());
    console.log('getMe:', meRes);
    const whRes = await fetch(`https://api.telegram.org/bot${staffToken}/getWebhookInfo`).then(r => r.json());
    console.log('getWebhookInfo:', JSON.stringify(whRes, null, 2));
  } else {
    console.log('STAFF BOT TOKEN NOT FOUND');
  }
}

checkBots().catch(console.error);
