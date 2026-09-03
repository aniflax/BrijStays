/**
 * Seeds the FAQ collection on the deployed Strapi backend.
 *
 * Uses a full-access Content API token (created via the admin API by the
 * caller) so entries can be created through the standard /api/faqs endpoint.
 * Idempotent: skips questions that already exist.
 *
 * Usage:
 *   STRAPI_BASE_URL=https://admin.brijstays.in \
 *   STRAPI_API_TOKEN=<full access token> \
 *   node backend/scripts/seed-faqs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE = (process.env.STRAPI_BASE_URL || 'https://admin.brijstays.in').replace(/\/+$/, '');
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) {
  console.error('Missing STRAPI_API_TOKEN env var.');
  process.exit(1);
}

// Read the same seed content the frontend falls back to, so CMS == static.
const faqsSeed = [
  {
    question: 'Where exactly is Brij Stays located?',
    answer:
      'Our stays are in Vrindavan, Mathura district — a short walk or drive from ISKCON Vrindavan, Prem Mandir and Banke Bihari Temple. The exact address of each stay is shared on its listing page and confirmed over WhatsApp when you book.',
  },
  {
    question: 'How do I check availability and book a stay?',
    answer:
      'Availability and rates are confirmed directly on WhatsApp — there is no online booking engine, so you always speak with a real host. Send us your dates, the number of guests and your stay type, and we will reply with availability, pricing and booking details.',
  },
  {
    question: 'Is there a minimum stay duration?',
    answer:
      'No. You can book a single night, a weekend darshan trip, or a long-term stay of weeks or months. Daily, weekly and monthly rates are available — message us on WhatsApp and we will share the best rate for your dates.',
  },
  {
    question: 'Do the rooms have Wi-Fi and modern amenities?',
    answer:
      'Yes. Every stay includes high-speed Wi-Fi, hygienic fully furnished rooms, modern interiors and thoughtful daily essentials. Housekeeping is provided, and hosts are available around the clock for local guidance.',
  },
  {
    question: 'Are the stays verified and how are they rated?',
    answer:
      'Each Brij Stays property is listed and verified on Airbnb with real guest ratings and review counts, which you can see on every stay listing. We host personally and keep the same standard of care across all our properties.',
  },
  {
    question: 'Can you help with temple visits and local guidance?',
    answer:
      'Absolutely. Our hosts are local to Vrindavan and happy to help with temple timings, darshan schedules, getting around, and recommendations for meals and shopping — just ask on WhatsApp during your stay.',
  },
];

async function api(pathname, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    throw new Error(`${method} ${pathname} -> ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

async function main() {
  const existing = await api('/api/faqs?pagination[pageSize]=100');
  const existingQuestions = new Set(
    (existing?.data ?? []).map((f) => (f.question ?? '').trim().toLowerCase()),
  );

  let created = 0;
  let skipped = 0;
  for (let i = 0; i < faqsSeed.length; i++) {
    const faq = faqsSeed[i];
    if (existingQuestions.has(faq.question.trim().toLowerCase())) {
      console.log(`skip (exists): ${faq.question}`);
      skipped++;
      continue;
    }
    await api('/api/faqs', {
      method: 'POST',
      body: { data: { question: faq.question, answer: faq.answer, order: i } },
    });
    console.log(`created: ${faq.question}`);
    created++;
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
