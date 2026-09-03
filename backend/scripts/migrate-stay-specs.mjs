/**
 * One-off migration: backfills the repeatable `specs` component on existing
 * Strapi stays (which were created before the specs field existed, using the
 * old fixed guestCapacity/bedrooms/bathrooms/roomType fields).
 *
 * Usage:
 *   STRAPI_BASE_URL=https://admin.brijstays.in \
 *   STRAPI_API_TOKEN=<full access token> \
 *   node backend/scripts/migrate-stay-specs.mjs
 *
 * Idempotent: skips stays that already have specs.
 */
const BASE = (process.env.STRAPI_BASE_URL || 'https://admin.brijstays.in').replace(/\/+$/, '');
const TOKEN = process.env.STRAPI_API_TOKEN;
if (!TOKEN) {
  console.error('Missing STRAPI_API_TOKEN env var.');
  process.exit(1);
}

// Spec rows per stay slug, mirroring the frontend static fallback data.
const SPECS_BY_SLUG = {
  'nest-in-the-forest': [
    { label: 'Room type', value: 'Private room' },
    { label: 'Guests', value: '2' },
    { label: 'Bedrooms', value: '1' },
    { label: 'Bathrooms', value: '1' },
    { label: 'AC', value: 'Yes' },
  ],
  'red-velvet-studio': [
    { label: 'Room type', value: 'Studio' },
    { label: 'Guests', value: '2' },
    { label: 'Bedrooms', value: '1' },
    { label: 'Bathrooms', value: '1' },
    { label: 'AC', value: 'Yes' },
  ],
  'shyam-rang-palace': [
    { label: 'Room type', value: 'Entire apartment' },
    { label: 'Guests', value: '2' },
    { label: 'Bedrooms', value: '1' },
    { label: 'Bathrooms', value: '1' },
    { label: 'AC', value: 'Yes' },
  ],
  'anand-van': [
    { label: 'Room type', value: '1 BHK apartment' },
    { label: 'Guests', value: '2' },
    { label: 'Bedrooms', value: '1' },
    { label: 'Bathrooms', value: '1' },
    { label: 'AC', value: 'Yes' },
  ],
  'all-things-pichwai': [
    { label: 'Room type', value: 'Studio' },
    { label: 'Guests', value: '3' },
    { label: 'Bedrooms', value: '1' },
    { label: 'Bathrooms', value: '1' },
    { label: 'AC', value: 'Yes' },
  ],
  'artistic-haven-shantivan': [
    { label: 'Room type', value: 'Entire apartment' },
    { label: 'Guests', value: '2' },
    { label: 'Bedrooms', value: '1' },
    { label: 'Bathrooms', value: '1' },
    { label: 'AC', value: 'Yes' },
  ],
  'royal-indian-odyssey': [
    { label: 'Room type', value: 'Luxury suite' },
    { label: 'Guests', value: '2' },
    { label: 'Bedrooms', value: '1' },
    { label: 'Bathrooms', value: '1' },
    { label: 'AC', value: 'Yes' },
  ],
  'yoga-cafe': [
    { label: 'Room type', value: 'Entire apartment' },
    { label: 'Guests', value: '2' },
    { label: 'Bedrooms', value: '1' },
    { label: 'Bathrooms', value: '1' },
    { label: 'AC', value: 'Yes' },
  ],
};

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
  const list = await api('/api/stays?pagination[pageSize]=100&populate[specs][fields][0]=label&populate[specs][fields][1]=value');
  const stays = list?.data ?? [];
  let updated = 0;
  let skipped = 0;
  for (const stay of stays) {
    const slug = stay.slug;
    const specs = SPECS_BY_SLUG[slug];
    if (!specs) {
      console.log(`skip (no mapping): ${slug}`);
      skipped++;
      continue;
    }
    if (Array.isArray(stay.specs) && stay.specs.length > 0) {
      console.log(`skip (has specs): ${slug}`);
      skipped++;
      continue;
    }
    await api(`/api/stays/${stay.documentId}`, {
      method: 'PUT',
      body: { data: { specs } },
    });
    console.log(`updated: ${slug} (${specs.length} specs)`);
    updated++;
  }
  console.log(`\nDone. Updated ${updated}, skipped ${skipped}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
