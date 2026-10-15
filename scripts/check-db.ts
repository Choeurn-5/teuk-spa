import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
  const { adminDb } = await import('../src/lib/firebase/admin');
  try {
    await adminDb.collection('treatments').doc('auwkqOw8nHTehqwQs9sr').delete();
  } catch (e) {}
  const tSnap = await adminDb.collection('treatments').get();
  console.log('TREATMENTS COUNT:', tSnap.size);
  tSnap.docs.forEach(d => {
    const data = d.data();
    console.log(`[T] ${d.id}: "${data.name}" | image: ${data.imageUrl || '(none)'} | durations: ${JSON.stringify(data.durationOptions)}`);
  });

  const pSnap = await adminDb.collection('packages').get();
  console.log('PACKAGES COUNT:', pSnap.size);
  pSnap.docs.forEach(d => {
    const data = d.data();
    console.log(`[P] ${d.id}: "${data.name}" | image: ${data.imageUrl || '(none)'} | price: $${data.price} | mins: ${data.totalMinutes} | includes: ${JSON.stringify(data.includes)}`);
  });
  const settingsSnap = await adminDb.collection('siteSettings').doc('main').get();
  console.log('SiteSettings:', JSON.stringify(settingsSnap.data(), null, 2));
  process.exit(0);
}

check().catch((err) => {
  console.error(err);
  process.exit(1);
});
