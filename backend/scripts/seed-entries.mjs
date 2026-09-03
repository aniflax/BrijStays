/**
 * Creates CMS entries for the new content types via the Strapi Content API
 * using a Full Access API token (created in admin → Settings → API Tokens).
 *
 * Reads:
 *  - seed-manifest.json (media file ids uploaded by seed-home-content.mjs)
 *  - Frontend/src/lib/data/stays.ts + testimonials.ts (via manual snapshot below)
 *
 * Run with:
 *   STRAPI_API_TOKEN=<full access token> node backend/scripts/seed-entries.mjs
 *
 * Idempotent: skips entries whose unique slug / first-text already exists.
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

const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'seed-manifest.json'), 'utf8'),
);

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

async function findExisting(collection, matchField, value) {
  try {
    const data = await api(`/api/${collection}?pagination[pageSize]=100&filters[${matchField}][$eq]=${encodeURIComponent(value)}`);
    return (data?.data ?? [])[0] ?? null;
  } catch {
    return null;
  }
}

async function createEntry(collection, payload) {
  const json = await api(`/api/${collection}`, { method: 'POST', body: { data: payload } });
  return json.data;
}

// ---------------------------------------------------------------------------
// Media file lookup helpers
// ---------------------------------------------------------------------------
const mediaById = {};
for (const m of [...manifest.galleryImages, ...manifest.standardImages]) {
  mediaById[m.fileId] = m;
}
for (const stay of manifest.stays) {
  mediaById[stay.heroFileId] = stay;
  for (const g of stay.gallery) mediaById[g.fileId] = g;
}
if (manifest.moreThanAStayImage) mediaById[manifest.moreThanAStayImage.fileId] = manifest.moreThanAStayImage;

function heroFileId(slug) {
  return manifest.stays.find((s) => s.slug === slug)?.heroFileId;
}
function galleryFileIds(slug) {
  return manifest.stays.find((s) => s.slug === slug)?.gallery.map((g) => g.fileId) ?? [];
}
function marqueeFileIds() {
  return manifest.galleryImages.map((g) => g.fileId);
}
function standardFileIds() {
  return manifest.standardImages.map((g) => g.fileId);
}

// ---------------------------------------------------------------------------
// Seed data (snapshot from Frontend/src/lib/data/stays.ts + testimonials.ts)
// ---------------------------------------------------------------------------
const staysSeed = [
  {
    slug: 'nest-in-the-forest',
    name: 'Nest in the Forest — 1 min to ISKCON & Prem Mandir',
    shortName: 'Nest in the Forest',
    category: 'Boutique Stay',
    building: 'Hari Krishna Residency',
    shortDescription:
      'A unique, family-friendly boutique stay one minute from ISKCON and Prem Mandir, tucked into a quiet, leafy corner of Vrindavan.',
    description: [
      'Nest in the Forest is a unique and family-friendly place set in the heart of Vrindavan, just one minute from ISKCON Temple and Prem Mandir. It is an easy base for temple visits, with the main attractions of the town within a short walk.',
      'The stay is designed to feel calm and personal — comfortable rooms, warm interiors and the kind of attentive hosting that makes a pilgrimage effortless.',
    ].join('\n\n'),
    highlights: [
      '1 minute from ISKCON Temple',
      '1 minute from Prem Mandir',
      'Family-friendly stay',
      'Central Vrindavan location',
    ].join('\n'),
    amenities: [
      'Prime central location',
      '24/7 guest support',
      'High-speed Wi-Fi',
      'Hygienic, furnished room',
      'Flexible check-in',
      'Local travel guidance',
    ].join('\n'),
    airbnbUrl: 'https://www.airbnb.co.in/rooms/1694091085781085697',
    mapQuery: 'ISKCON Vrindavan, Uttar Pradesh',
    specs: [
        { label: 'Room type', value: 'Private room' },
        { label: 'Guests', value: '2' },
        { label: 'Bedrooms', value: '1' },
        { label: 'Bathrooms', value: '1' },
        { label: 'AC', value: 'Yes' },
    ],
    rating: 4.0,
    ratingCount: 1,
    latitude: 27.57585,
    longitude: 77.69041,
    order: 1,
    featured: true,
    showOnHomePage: true,
  },
  {
    slug: 'red-velvet-studio',
    name: 'Red Velvet Studio — next to ISKCON & Prem Mandir',
    shortName: 'Red Velvet Studio',
    category: 'Studio',
    building: 'Hari Krishna Residency',
    shortDescription:
      'A super-central designer studio literally next door to ISKCON, with bold black-and-white walls, plush burgundy styling and a kitchenette.',
    description: [
      'Super central, main Vrindavan. This studio is literally next door to ISKCON, walking steps from Prem Mandir, and five minutes from Banke Bihari.',
      'Experience modern comfort in this elegantly designed studio room featuring bold black-and-white striped wall accents, a plush upholstered bed, stylish burgundy décor, a cozy seating area, and a functional kitchenette. Bright natural light and contemporary interiors create a warm, luxurious, and inviting atmosphere.',
    ].join('\n\n'),
    highlights: [
      'Next door to ISKCON Temple',
      'Walking steps from Prem Mandir',
      '5 minutes from Banke Bihari',
      'Designer studio with kitchenette',
    ].join('\n'),
    amenities: [
      'Super-central location',
      'Kitchenette',
      'High-speed Wi-Fi',
      '24/7 guest support',
      'Flexible check-in',
      'Local travel guidance',
    ].join('\n'),
    airbnbUrl: 'https://www.airbnb.co.in/rooms/1694085953625668285',
    mapQuery: 'ISKCON Vrindavan, Uttar Pradesh',
    specs: [
        { label: 'Room type', value: 'Studio' },
        { label: 'Guests', value: '2' },
        { label: 'Bedrooms', value: '1' },
        { label: 'Bathrooms', value: '1' },
        { label: 'AC', value: 'Yes' },
    ],
    rating: 5.0,
    ratingCount: 2,
    latitude: 27.57771,
    longitude: 77.69,
    order: 2,
    featured: true,
    showOnHomePage: true,
  },
  {
    slug: 'shyam-rang-palace',
    name: 'Shyam Rang Palace — next to ISKCON & Prem Mandir',
    shortName: 'Shyam Rang Palace',
    category: 'Heritage Apartment',
    building: 'Hari Krishna Residency',
    shortDescription:
      'A hand-painted heritage apartment next to ISKCON — Jodhpur colours, Jaipur pots and a tranquil rooftop garden.',
    description: [
      'Take it easy at this unique and tranquil getaway, super central in main Vrindavan — literally next door to ISKCON, walking steps from Prem Mandir, and five minutes from Banke Bihari.',
      'Stay at an unbelievably gorgeous, hand-painted apartment that leaves you breathless with its finesse — from the Jodhpur colours on the walls to the elegant Jaipur pots and pristine flowers across the roof, it makes you forget time.',
    ].join('\n\n'),
    highlights: [
      'Next door to ISKCON Temple',
      'Walking steps from Prem Mandir',
      'Hand-painted heritage interiors',
      'Tranquil rooftop garden',
    ].join('\n'),
    amenities: [
      'Super-central location',
      'Rooftop garden',
      'High-speed Wi-Fi',
      '24/7 guest support',
      'Flexible check-in',
      'Local travel guidance',
    ].join('\n'),
    airbnbUrl: 'https://www.airbnb.co.in/rooms/1429472757418114108',
    mapQuery: 'ISKCON Vrindavan, Uttar Pradesh',
    specs: [
        { label: 'Room type', value: 'Entire apartment' },
        { label: 'Guests', value: '2' },
        { label: 'Bedrooms', value: '1' },
        { label: 'Bathrooms', value: '1' },
        { label: 'AC', value: 'Yes' },
    ],
    rating: 4.91,
    ratingCount: 32,
    latitude: 27.57146,
    longitude: 77.67774,
    order: 3,
    featured: true,
    showOnHomePage: true,
  },
  {
    slug: 'anand-van',
    name: 'Anand-Van: Cute Clay 1BHK w/ Sunrise & Sunset Balcony',
    shortName: 'Anand-Van',
    category: '1 BHK Apartment',
    building: '',
    shortDescription:
      'A terracotta-inspired 1BHK on the 13th floor with two balconies — one for sunrise, one for sunset — plus skyline views across Vrindavan.',
    description: [
      '3 km (10 min) from Prem Mandir, 3.5 km (12 min) from ISKCON and 4 km (15 min) from Banke Bihari.',
      'Experience a chic home on the 13th floor offering terracotta-inspired charm and stunning skyline views, with 24×7 lifts, high-speed internet and snacks. Relax on two balconies — one for sunrise and one for sunset — sip coffee in the cozy living space, or cook in the well-equipped kitchen. With its prime location and stylish comforts, this hideaway promises an unforgettable escape.',
    ].join('\n\n'),
    highlights: [
      'Sunrise & sunset balconies',
      '13th-floor skyline views',
      '10 min from Prem Mandir',
      '12 min from ISKCON',
    ].join('\n'),
    amenities: [
      'Two balconies',
      'Well-equipped kitchen',
      '24×7 lifts',
      'High-speed Wi-Fi',
      'Skyline views',
      '24/7 guest support',
    ].join('\n'),
    airbnbUrl: 'https://www.airbnb.co.in/rooms/1142535842156771470',
    mapQuery: 'Prem Mandir, Vrindavan, Uttar Pradesh',
    specs: [
        { label: 'Room type', value: '1 BHK apartment' },
        { label: 'Guests', value: '2' },
        { label: 'Bedrooms', value: '1' },
        { label: 'Bathrooms', value: '1' },
        { label: 'AC', value: 'Yes' },
    ],
    rating: 4.98,
    ratingCount: 43,
    latitude: 27.56357,
    longitude: 77.65873,
    order: 4,
    featured: true,
    showOnHomePage: true,
  },
  {
    slug: 'all-things-pichwai',
    name: 'All things Pichwai — Arthouse with stunning balcony',
    shortName: 'All things Pichwai',
    category: 'Arthouse Studio',
    building: '',
    shortDescription:
      'A Pichwai-themed studio with elegant fittings, art-filled interiors and a charming sit-out balcony, minutes from the prime temples.',
    description: [
      'Peaceful, pretty and artsy. Less than 3 km (10 min) from Prem Mandir, 3.5 km (12 min) from ISKCON and 4.5 km (15 min) from Banke Bihari.',
      'Step into a world of art and tranquility at this Pichwai-themed studio. Beautiful elegant fittings, stunning interiors, and a charming sit-out balcony perfect for relaxation. Enjoy easy access to prime temples, immersing yourself in the spiritual essence of Vrindavan, with an abundance of modern amenities for a comfortable and memorable stay.',
    ].join('\n\n'),
    highlights: [
      'Pichwai art interiors',
      'Sit-out balcony',
      '10 min from Prem Mandir',
      '12 min from ISKCON',
    ].join('\n'),
    amenities: [
      'Art-filled interiors',
      'Sit-out balcony',
      'High-speed Wi-Fi',
      'Modern amenities',
      '24/7 guest support',
      'Flexible check-in',
    ].join('\n'),
    airbnbUrl: 'https://www.airbnb.co.in/rooms/1205714535489622168',
    mapQuery: 'Prem Mandir, Vrindavan, Uttar Pradesh',
    specs: [
        { label: 'Room type', value: 'Studio' },
        { label: 'Guests', value: '3' },
        { label: 'Bedrooms', value: '1' },
        { label: 'Bathrooms', value: '1' },
        { label: 'AC', value: 'Yes' },
    ],
    rating: 4.97,
    ratingCount: 98,
    latitude: 27.57375,
    longitude: 77.65487,
    order: 5,
    featured: true,
    showOnHomePage: true,
  },
  {
    slug: 'artistic-haven-shantivan',
    name: 'Artistic Haven: ShantiVan Retreat by Prime Temples',
    shortName: 'Artistic Haven: ShantiVan',
    category: 'Designer Suite',
    building: '',
    shortDescription:
      'Urban luxury on the 15th floor — a stylish retreat with skyline vistas, two balconies and sparkling-clean corners by the prime temples.',
    description: [
      '3 km (10 min) from Prem Mandir, 3.5 km (12 min) from ISKCON and 4 km (15 min) from Banke Bihari.',
      'Experience urban luxury in Vrindavan. This stylish retreat on the 15th floor boasts great aesthetics, sparkling-clean corners and breathtaking skyline vistas, with 24×7 lifts, high-speed internet and well-stocked supplies. Relax on two balconies, enjoy coffee in the cozy living area, or whip up a meal in the well-appointed kitchen. Retreat to the comfort of the bedroom or take long showers — welcome home.',
    ].join('\n\n'),
    highlights: [
      '15th-floor skyline vistas',
      'Two balconies',
      '10 min from Prem Mandir',
      '12 min from ISKCON',
    ].join('\n'),
    amenities: [
      'Two balconies',
      'Well-appointed kitchen',
      '24×7 lifts',
      'High-speed Wi-Fi',
      'Skyline views',
      '24/7 guest support',
    ].join('\n'),
    airbnbUrl: 'https://www.airbnb.co.in/rooms/1142555542700079169',
    mapQuery: 'Prem Mandir, Vrindavan, Uttar Pradesh',
    specs: [
        { label: 'Room type', value: 'Entire apartment' },
        { label: 'Guests', value: '2' },
        { label: 'Bedrooms', value: '1' },
        { label: 'Bathrooms', value: '1' },
        { label: 'AC', value: 'Yes' },
    ],
    rating: 4.99,
    ratingCount: 76,
    latitude: 27.56312,
    longitude: 77.66011,
    order: 6,
    featured: true,
    showOnHomePage: true,
  },
  {
    slug: 'royal-indian-odyssey',
    name: 'The Royal Indian Odyssey — Majestic Luxury Suite',
    shortName: 'The Royal Indian Odyssey',
    category: 'Luxury Suite',
    building: '',
    shortDescription:
      "Vrindavan's stunning luxury suite — tasteful colours, Rajasthan-inspired décor and a box-style bed on the 11th floor with breathtaking views.",
    description: [
      "Vrindavan's stunning luxurious suite — tasteful colours, corners and more. Prime location: Prem Mandir 3 km (10 min), ISKCON Temple 3.5 km (12 min), Banke Bihari Temple 4 km (15 min).",
      "Why stay here: a luxurious box-style bed for ultimate comfort, interiors inspired by Rajasthan's folklore and vibrant culture, 24×7 lifts, high-speed Wi-Fi and fully stocked amenities. Discover a unique blend of urban luxury and Indian heritage in this 11th-floor designer suite with breathtaking views. Welcome home.",
    ].join('\n\n'),
    highlights: [
      'Rajasthan-inspired design',
      'Luxurious box-style bed',
      '10 min from Prem Mandir',
      '12 min from ISKCON',
    ].join('\n'),
    amenities: [
      'Designer suite',
      'Fully stocked amenities',
      '24×7 lifts',
      'High-speed Wi-Fi',
      'Skyline views',
      '24/7 guest support',
    ].join('\n'),
    airbnbUrl: 'https://www.airbnb.co.in/rooms/1350462335119442515',
    mapQuery: 'Prem Mandir, Vrindavan, Uttar Pradesh',
    specs: [
        { label: 'Room type', value: 'Luxury suite' },
        { label: 'Guests', value: '2' },
        { label: 'Bedrooms', value: '1' },
        { label: 'Bathrooms', value: '1' },
        { label: 'AC', value: 'Yes' },
    ],
    rating: 4.88,
    ratingCount: 40,
    latitude: 27.56152,
    longitude: 77.65564,
    order: 7,
    featured: true,
    showOnHomePage: true,
  },
  {
    slug: 'yoga-cafe',
    name: 'The Yoga Cafe — wellness stay',
    shortName: 'The Yoga Cafe',
    category: 'Wellness Stay',
    building: '',
    shortDescription:
      'A stylish 10th-floor wellness stay with terracotta charm, skyline views, 24×7 lifts and high-speed internet — fun for the whole family.',
    description: [
      'Have fun with the whole family at this stylish place. 3 km (10 min) from Prem Mandir, 3.5 km (12 min) from ISKCON and 4 km (15 min) from Banke Bihari.',
      'Experience a chic home on the 10th floor offering terracotta-inspired charm and stunning skyline views, with 24×7 lifts, high-speed internet and snacks. With its prime location and stylish comforts, this hideaway promises an unforgettable escape.',
    ].join('\n\n'),
    highlights: [
      '10th-floor skyline views',
      'Wellness-focused stay',
      '10 min from Prem Mandir',
      '12 min from ISKCON',
    ].join('\n'),
    amenities: [
      'High-speed Wi-Fi',
      '24×7 lifts',
      'Skyline views',
      'Family-friendly',
      '24/7 guest support',
      'Flexible check-in',
    ].join('\n'),
    airbnbUrl: 'https://www.airbnb.co.in/rooms/1337256608803515268',
    mapQuery: 'Prem Mandir, Vrindavan, Uttar Pradesh',
    specs: [
        { label: 'Room type', value: 'Entire apartment' },
        { label: 'Guests', value: '2' },
        { label: 'Bedrooms', value: '1' },
        { label: 'Bathrooms', value: '1' },
        { label: 'AC', value: 'Yes' },
    ],
    rating: 4.89,
    ratingCount: 19,
    latitude: 27.56591,
    longitude: 77.66043,
    order: 8,
    featured: true,
    showOnHomePage: true,
  },
];

const reviewsSeed = [
  {
    quote:
      "Staying at Brij Stays' Hari Krishna Residency made our family pilgrimage effortless! Being literally steps away from ISKCON saved us so much time and travel hassle. The room was sparkling clean, modern, and comfortable. Having direct WhatsApp contact with the host for quick local guidance was the cherry on top!",
    name: 'R. Sharma',
    project: 'Hari Krishna Residency',
    location: 'Verified Airbnb Guest',
    order: 1,
  },
  {
    quote:
      'Rated 4 out of 5 by 1 verified guest on Airbnb.',
    name: 'Verified Airbnb Guests',
    project: 'Nest in the Forest — 1 min to ISKCON & Prem Mandir',
    location: 'Airbnb',
    order: 2,
  },
  {
    quote: 'Rated 5 out of 5 by 2 verified guests on Airbnb.',
    name: 'Verified Airbnb Guests',
    project: 'Red Velvet Studio — next to ISKCON & Prem Mandir',
    location: 'Airbnb',
    order: 3,
  },
  {
    quote: 'Rated 4.91 out of 5 by 32 verified guests on Airbnb.',
    name: 'Verified Airbnb Guests',
    project: 'Shyam Rang Palace — next to ISKCON & Prem Mandir',
    location: 'Airbnb',
    order: 4,
  },
  {
    quote: 'Rated 4.98 out of 5 by 43 verified guests on Airbnb.',
    name: 'Verified Airbnb Guests',
    project: 'Anand-Van: Cute Clay 1BHK w/ Sunrise & Sunset Balcony',
    location: 'Airbnb',
    order: 5,
  },
  {
    quote: 'Rated 4.97 out of 5 by 98 verified guests on Airbnb.',
    name: 'Verified Airbnb Guests',
    project: 'All things Pichwai — Arthouse with stunning balcony',
    location: 'Airbnb',
    order: 6,
  },
  {
    quote: 'Rated 4.99 out of 5 by 76 verified guests on Airbnb.',
    name: 'Verified Airbnb Guests',
    project: 'Artistic Haven: ShantiVan Retreat by Prime Temples',
    location: 'Airbnb',
    order: 7,
  },
  {
    quote: 'Rated 4.88 out of 5 by 40 verified guests on Airbnb.',
    name: 'Verified Airbnb Guests',
    project: 'The Royal Indian Odyssey — Majestic Luxury Suite',
    location: 'Airbnb',
    order: 8,
  },
  {
    quote: 'Rated 4.89 out of 5 by 19 verified guests on Airbnb.',
    name: 'Verified Airbnb Guests',
    project: 'The Yoga Cafe — wellness stay',
    location: 'Airbnb',
    order: 9,
  },
];

// ---------------------------------------------------------------------------
// Entry creation
// ---------------------------------------------------------------------------
async function main() {
  const results = { stays: 0, galleryImages: 0, standardImages: 0, reviews: 0, skipped: [] };

  // Stays
  for (const seed of staysSeed) {
    const existing = await findExisting('stays', 'slug', seed.slug);
    if (existing) {
      results.skipped.push(`stay:${seed.slug}`);
      continue;
    }
    const heroIdVal = heroFileId(seed.slug);
    const galleryIds = galleryFileIds(seed.slug);
    if (!heroIdVal) {
      console.error(`!! No uploaded hero for ${seed.slug} — skipping`);
      continue;
    }
    const created = await createEntry('stays', {
      ...seed,
      heroImage: heroIdVal,
      gallery: galleryIds,
    });
    results.stays++;
    console.log(`+ stay ${created.documentId} ${seed.slug}`);
  }

  // Gallery images (marquee) — reuse uploaded marquee file ids.
  // Guard: if the collection already has any entries, skip (avoids dupes).
  const galleryCount = (await api('/api/gallery-images?pagination[pageSize]=1')).meta?.pagination?.total ?? 0;
  if (galleryCount > 0) {
    results.skipped.push(`gallery-images:already has ${galleryCount}`);
  } else {
    for (const media of marqueeFileIds()) {
      const name = mediaById[media].name;
      await createEntry('gallery-images', { image: media, alt: name, order: 0 });
      results.galleryImages++;
      console.log(`+ gallery-image file ${media} (${name})`);
    }
  }

  // Standard images
  const standardCount = (await api('/api/standard-images?pagination[pageSize]=1')).meta?.pagination?.total ?? 0;
  if (standardCount > 0) {
    results.skipped.push(`standard-images:already has ${standardCount}`);
  } else {
    for (const media of standardFileIds()) {
      const name = mediaById[media].name;
      await createEntry('standard-images', { image: media, alt: name, order: 0 });
      results.standardImages++;
      console.log(`+ standard-image file ${media} (${name})`);
    }
  }

  // Reviews
  for (const seed of reviewsSeed) {
    const existing = await findExisting('reviews', 'project', seed.project);
    if (existing) {
      results.skipped.push(`review:${seed.project}`);
      continue;
    }
    await createEntry('reviews', seed);
    results.reviews++;
    console.log(`+ review ${seed.project}`);
  }

  console.log('\n--- SUMMARY ---');
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
