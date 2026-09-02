/**
 * Bulk media upload + seed manifest for Brij Stays content types.
 *
 * Render's free tier has no shell, so this script runs OUTSIDE Strapi, on any
 * machine with network access, against the deployed admin. It uses the Strapi
 * admin login + upload REST endpoints (which accept an admin Bearer token) to
 * push all images to R2. Entry creation for the new content types
 * (stay / gallery-image / standard-image / review / instagram-video) is done in
 * the admin UI (the content-manager create endpoint is not JSON-accessible),
 * so this script writes backend/scripts/seed-manifest.json that maps each
 * content type to its entries and the uploaded file ids to attach.
 *
 * Usage:
 *   STRAPI_BASE_URL=https://admin.brijstays.in \
 *   STRAPI_ADMIN_EMAIL=you@example.com \
 *   STRAPI_ADMIN_PASSWORD='...' \
 *   node backend/scripts/seed-home-content.mjs
 *
 * Credentials are read from the environment only — never commit them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const assetsDir = path.join(repoRoot, 'Frontend/src/assets');
const staysAssetsDir = path.join(assetsDir, 'stays');

const BASE_URL = (process.env.STRAPI_BASE_URL || 'https://admin.brijstays.in').replace(/\/+$/, '');
const EMAIL = process.env.STRAPI_ADMIN_EMAIL;
const PASSWORD = process.env.STRAPI_ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error('Missing STRAPI_ADMIN_EMAIL / STRAPI_ADMIN_PASSWORD env vars.');
  process.exit(1);
}

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`${options.method || 'GET'} ${url} -> ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function login() {
  const body = await jsonFetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  return body.data.token;
}

async function uploadFile(token, filePath, { alternativeText, caption } = {}) {
  const stat = fs.statSync(filePath);
  const stream = Readable.toWeb(fs.createReadStream(filePath));
  const form = new FormData();
  form.append('files', new File([await streamToBuffer(stream)], path.basename(filePath), { type: 'application/octet-stream' }));
  form.append('fileInfo', JSON.stringify({ alternativeText: alternativeText || '', caption: caption || '' }));

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) throw new Error(`Upload ${filePath} -> ${res.status}: ${JSON.stringify(body)}`);
  return Array.isArray(body) ? body[0] : body;
}

async function streamToBuffer(webStream) {
  const chunks = [];
  const reader = webStream.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

function listStays() {
  const slugs = fs.readdirSync(staysAssetsDir).filter((dir) => fs.statSync(path.join(staysAssetsDir, dir)).isDirectory());
  return slugs.map((slug) => ({ slug }));
}

async function main() {
  console.log(`Logging in to ${BASE_URL} ...`);
  const token = await login();
  console.log('Login OK.');

  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    stays: [],
    galleryImages: [],
    standardImages: [],
    moreThanAStayImage: null,
  };

  // ---- Stay images (8 stays × hero + gallery) ----
  const stays = listStays();
  for (const stay of stays) {
    const stayDir = path.join(staysAssetsDir, stay.slug);
    const entries = fs.readdirSync(stayDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
    const heroFile = entries.find((f) => /^hero/i.test(f)) || entries[0];
    const galleryFiles = entries.filter((f) => f !== heroFile).sort();
    const stayRecord = { slug: stay.slug, heroFileId: null, heroUrl: null, gallery: [] };

    if (heroFile) {
      const heroPath = path.join(stayDir, heroFile);
      const up = await uploadFile(token, heroPath, { alternativeText: `${stay.slug} hero` });
      stayRecord.heroFileId = up.id;
      stayRecord.heroUrl = up.url;
      console.log(`  uploaded hero for ${stay.slug}: ${up.url}`);
    }
    for (const file of galleryFiles) {
      const galleryPath = path.join(stayDir, file);
      const up = await uploadFile(token, galleryPath, { alternativeText: `${stay.slug} gallery ${file}` });
      stayRecord.gallery.push({ fileId: up.id, url: up.url, name: file });
      console.log(`  uploaded gallery for ${stay.slug}: ${file}`);
    }
    manifest.stays.push(stayRecord);
  }

  // ---- Gallery marquee images (homepage marquee) ----
  // Reuse the interior-*.jpg and hero-*.jpg from assets.
  const marqueeCandidates = ['interior-1.jpg', 'interior-2.jpg', 'interior-3.jpg', 'interior-4.jpg', 'hero-1.jpg', 'hero-2.jpg', 'hero-3.jpg'];
  for (const name of marqueeCandidates) {
    const p = path.join(assetsDir, name);
    if (!fs.existsSync(p)) continue;
    const up = await uploadFile(token, p, { alternativeText: `Gallery marquee ${name}` });
    manifest.galleryImages.push({ fileId: up.id, url: up.url, name });
    console.log(`  uploaded marquee: ${name}`);
  }

  // ---- Brij Stays Standard images (interior-1..4) ----
  for (const name of ['interior-1.jpg', 'interior-2.jpg', 'interior-3.jpg', 'interior-4.jpg']) {
    const p = path.join(assetsDir, name);
    if (!fs.existsSync(p)) continue;
    const up = await uploadFile(token, p, { alternativeText: `Interior finish ${name}` });
    manifest.standardImages.push({ fileId: up.id, url: up.url, name });
    console.log(`  uploaded standard: ${name}`);
  }

  // ---- More Than a Stay image ----
  const morePath = path.join(assetsDir, 'more-than-a-stay.png');
  if (fs.existsSync(morePath)) {
    const up = await uploadFile(token, morePath, { alternativeText: 'More Than a Stay' });
    manifest.moreThanAStayImage = { fileId: up.id, url: up.url };
    console.log(`  uploaded more-than-a-stay: ${up.url}`);
  }

  const out = path.join(__dirname, 'seed-manifest.json');
  fs.writeFileSync(out, JSON.stringify(manifest, null, 2));
  console.log(`\nWrote manifest: ${out}`);
  console.log(`Stays: ${manifest.stays.length}, marquee: ${manifest.galleryImages.length}, standard: ${manifest.standardImages.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
