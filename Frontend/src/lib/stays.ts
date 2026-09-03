// Stay inventory fetched from the Strapi "Stays" collection type. All CMS
// reads run through server functions so they always happen on the Worker
// (never the browser). Falls back to the bundled static stays when Strapi is
// unreachable so pages still render.

import { createServerFn } from "@tanstack/react-start";
import { STRAPI_URL, resolveMediaUrl } from "./site";
import { stayList } from "./data/stays";
import type { Stay } from "./data/types";
import { readEdgeCache, writeEdgeCache } from "./server-cache";

const FETCH_TIMEOUT_MS = 15_000;
const CACHE_TTL_MS = 10 * 60 * 1000;
const EDGE_CACHE_TTL_SECONDS = 10 * 60;
const MAX_ATTEMPTS = 2;

const STAYS_QUERY = [
  "sort[0]=order:asc",
  "fields[0]=name",
  "fields[1]=shortName",
  "fields[2]=slug",
  "fields[3]=category",
  "fields[4]=building",
  "fields[5]=shortDescription",
  "fields[6]=description",
  "fields[7]=highlights",
  "fields[8]=amenities",
  "fields[9]=airbnbUrl",
  "fields[10]=mapQuery",
  "fields[11]=rating",
  "fields[12]=ratingCount",
  "fields[13]=latitude",
  "fields[14]=longitude",
  "fields[15]=order",
  "fields[16]=featured",
  "fields[17]=showOnHomePage",
  "populate[specs][fields][0]=label",
  "populate[specs][fields][1]=value",
  "populate[heroImage][fields][0]=url",
  "populate[heroImage][fields][1]=alternativeText",
  "populate[gallery][fields][0]=url",
  "populate[gallery][fields][1]=alternativeText",
].join("&");

type StrapiMediaDocument = {
  url?: string | null;
  alternativeText?: string | null;
} | null;

type StrapiStayDocument = {
  id: number;
  documentId: string;
  name?: string | null;
  shortName?: string | null;
  slug?: string | null;
  category?: string | null;
  building?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  highlights?: string | null;
  amenities?: string | null;
  airbnbUrl?: string | null;
  mapQuery?: string | null;
  specs?: StrapiStaySpec[] | null;
  rating?: number | null;
  ratingCount?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  order?: number | null;
  featured?: boolean | null;
  showOnHomePage?: boolean | null;
  heroImage?: StrapiMediaDocument;
  gallery?: StrapiMediaDocument[] | StrapiMediaDocument;
};

type StrapiStaySpec = {
  id: number;
  label?: string | null;
  value?: string | null;
};

function splitLines(value: string | null | undefined): string[] {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function num(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function mediaAlt(media: StrapiMediaDocument | undefined, fallback: string): string {
  const alt = media?.alternativeText?.trim() ?? "";
  return alt || fallback;
}

/** Normalizes a Strapi v5 stay document (flat, no `attributes` wrapper). */
export function normalizeStay(doc: StrapiStayDocument): Stay {
  const name = doc.name ?? "Untitled stay";
  const shortName = doc.shortName ?? name;
  const rawGallery = Array.isArray(doc.gallery) ? doc.gallery : doc.gallery ? [doc.gallery] : [];
  const gallery = rawGallery
    .map((media) => ({
      src: resolveMediaUrl(media),
      alt: mediaAlt(media, shortName),
    }))
    .filter((g) => g.src);
  const heroImage = resolveMediaUrl(doc.heroImage);
  const heroAlt = mediaAlt(doc.heroImage, shortName);
  const description = splitLines(doc.description);
  const shortDescription = doc.shortDescription ?? "";
  return {
    slug: doc.slug?.trim() || doc.documentId || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    shortName,
    location: "Vrindavan, Uttar Pradesh",
    category: doc.category ?? "",
    building: doc.building ?? "",
    shortDescription,
    description: description.length ? description : [shortDescription],
    highlights: splitLines(doc.highlights),
    heroImage,
    heroAlt,
    gallery: gallery.length ? gallery : heroImage ? [{ src: heroImage, alt: heroAlt }] : [],
    specs: (doc.specs ?? [])
      .map((spec) => ({
        label: spec.label?.trim() ?? "",
        value: spec.value?.trim() ?? "",
      }))
      .filter((spec) => spec.label && spec.value),
    amenities: splitLines(doc.amenities),
    airbnbUrl: doc.airbnbUrl ?? "",
    rating: num(doc.rating),
    ratingCount: num(doc.ratingCount),
    featured: Boolean(doc.featured),
    showOnHomePage: Boolean(doc.showOnHomePage),
    mapQuery: doc.mapQuery ?? "",
    coords: {
      lat: num(doc.latitude),
      lng: num(doc.longitude),
    },
  };
}

let cachedStays: Stay[] | null = null;
let cachedAt = 0;

export const fetchStaysFromCms = createServerFn()
  .validator((data: { force?: boolean } | undefined) => data)
  .handler(async ({ data }) => {
    const force = data?.force === true;

    if (!force) {
      const edge = await readEdgeCache<Stay[]>("stays");
      if (edge) return edge;
      const now = Date.now();
      if (cachedStays && now - cachedAt < CACHE_TTL_MS) return cachedStays;
    }

    let stays: Stay[] | null = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        let res: Response;
        try {
          res = await fetch(`${STRAPI_URL}/api/stays?${STAYS_QUERY}`, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }
        if (!res.ok) throw new Error(`Strapi responded with ${res.status}`);
        const json = (await res.json()) as { data?: StrapiStayDocument[] };
        stays = (json.data ?? []).map(normalizeStay);
        break;
      } catch (err) {
        console.error("[stays] Failed to fetch stays from Strapi:", err);
      }
    }

    const result = stays ?? stayList;
    cachedStays = result;
    cachedAt = Date.now();
    await writeEdgeCache("stays", result, EDGE_CACHE_TTL_SECONDS);
    return result;
  });

export async function fetchStays(): Promise<Stay[]> {
  return fetchStaysFromCms();
}

export async function getStay(slug: string): Promise<Stay | undefined> {
  let stays = await fetchStaysFromCms();
  let found = stays.find((s) => s.slug === slug);
  if (!found) {
    stays = await fetchStaysFromCms({ data: { force: true } });
    found = stays.find((s) => s.slug === slug);
  }
  return found;
}

/** Clears the in-process stays cache so the next read refetches from Strapi. */
export function resetStaysCache(): void {
  cachedStays = null;
  cachedAt = 0;
}
