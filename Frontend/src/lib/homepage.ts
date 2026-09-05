// Homepage section content fetched from Strapi collections: the moving
// gallery marquee strip, the "Brij Stays Standard" image grid, guest reviews,
// and Instagram videos. All reads run through server functions on the Worker.
// Falls back to the bundled static content when Strapi is unreachable.

import { createServerFn } from "@tanstack/react-start";
import { STRAPI_URL, resolveMediaUrl } from "./site";
import { readEdgeCache, writeEdgeCache } from "./server-cache";
import type { GalleryImage, InstagramVideo, Testimonial } from "./data/types";

const FETCH_TIMEOUT_MS = 15_000;
const CACHE_TTL_MS = 10 * 60 * 1000;
const EDGE_CACHE_TTL_SECONDS = 10 * 60;
const MAX_ATTEMPTS = 2;

const MEDIA_ALT_FIELDS =
  "populate[image][fields][0]=url&populate[image][fields][1]=alternativeText";

type StrapiMediaDoc = { url?: string | null; alternativeText?: string | null } | null;

type StrapiImageEntry = {
  id: number;
  documentId: string;
  image?: StrapiMediaDoc;
  alt?: string | null;
  order?: number | null;
};

type StrapiReviewEntry = {
  id: number;
  documentId: string;
  quote?: string | null;
  name?: string | null;
  project?: string | null;
  location?: string | null;
  order?: number | null;
};

type StrapiInstagramEntry = {
  id: number;
  documentId: string;
  url?: string | null;
  caption?: string | null;
  order?: number | null;
};

function resolveEntryImages(entries: StrapiImageEntry[] | undefined): GalleryImage[] {
  return (entries ?? [])
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((entry, index) => {
      const url = resolveMediaUrl(entry.image);
      const alt =
        entry.alt?.trim() ||
        entry.image?.alternativeText?.trim() ||
        (entry.image?.url?.split("/").pop()?.split(".")[0] ?? `Image ${index + 1}`);
      return url ? { src: url, alt } : null;
    })
    .filter((entry): entry is GalleryImage => Boolean(entry));
}

/** Builds the standard Instagram iframe embed URL from a post/reel URL. */
export function instagramEmbedUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  let path: string;
  try {
    const url = new URL(trimmed);
    path = url.pathname;
  } catch {
    path = trimmed.replace(/^https?:\/\/[^/]+/i, "");
  }
  if (!path) return "";
  const clean = path.replace(/\/+$/, "").replace(/\/(embed|embed\/)$/, "");
  return `https://www.instagram.com${clean}/embed/`;
}

/**
 * Builds a cover-image URL for an Instagram post/reel. Instagram serves the
 * image at `https://www.instagram.com/p/<shortcode>/media/?size=l` with a 302
 * redirect to its CDN, but browsers frequently fail to load that cross-domain
 * request (Instagram hotlink/cookie/referrer handling varies by network and
 * device). The cover therefore points at the site's own `/api/ig-cover`
 * proxy, which fetches the image server-side and serves it from our domain.
 */
export function instagramThumbnailUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  let path: string;
  try {
    path = new URL(trimmed).pathname;
  } catch {
    path = trimmed.replace(/^https?:\/\/[^/]+/i, "");
  }
  // Path is like /reel/<code>/ or /p/<code>/
  const segments = path.split("/").filter(Boolean);
  const shortcode = segments[segments.length - 1];
  if (!shortcode) return "";
  const instagramMediaUrl = `https://www.instagram.com/p/${shortcode}/media/?size=l`;
  return `/api/ig-cover?url=${encodeURIComponent(instagramMediaUrl)}`;
}

function sortEntries<T extends { order?: number | null }>(entries: T[] | undefined): T[] {
  return [...(entries ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// ---------------------------------------------------------------------------
// Gallery marquee strip
// ---------------------------------------------------------------------------

export const fetchGalleryImagesFromCms = createServerFn()
  .validator((data: { force?: boolean } | undefined) => data)
  .handler(async ({ data }) => {
    const force = data?.force === true;
    if (!force) {
      const edge = await readEdgeCache<GalleryImage[]>("gallery-images");
      if (edge) return edge;
      const now = Date.now();
      if (galleryCache && now - galleryCacheAt < CACHE_TTL_MS) return galleryCache;
    }

    let images: GalleryImage[] | null = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        let res: Response;
        try {
          res = await fetch(
            `${STRAPI_URL}/api/gallery-images?sort[0]=order:asc&${MEDIA_ALT_FIELDS}`,
            {
              headers: { Accept: "application/json" },
              signal: controller.signal,
            },
          );
        } finally {
          clearTimeout(timer);
        }
        if (!res.ok) throw new Error(`Strapi responded with ${res.status}`);
        const json = (await res.json()) as { data?: StrapiImageEntry[] };
        images = resolveEntryImages(json.data);
        break;
      } catch (err) {
        console.error("[homepage] Failed to fetch gallery images from Strapi:", err);
      }
    }

    const result = images ?? [];
    galleryCache = result;
    galleryCacheAt = Date.now();
    await writeEdgeCache("gallery-images", result, EDGE_CACHE_TTL_SECONDS);
    return result;
  });

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  return fetchGalleryImagesFromCms();
}

// ---------------------------------------------------------------------------
// Brij Stays Standard image grid
// ---------------------------------------------------------------------------

export const fetchStandardImagesFromCms = createServerFn()
  .validator((data: { force?: boolean } | undefined) => data)
  .handler(async ({ data }) => {
    const force = data?.force === true;
    if (!force) {
      const edge = await readEdgeCache<GalleryImage[]>("standard-images");
      if (edge) return edge;
      const now = Date.now();
      if (standardCache && now - standardCacheAt < CACHE_TTL_MS) return standardCache;
    }

    let images: GalleryImage[] | null = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        let res: Response;
        try {
          res = await fetch(
            `${STRAPI_URL}/api/standard-images?sort[0]=order:asc&${MEDIA_ALT_FIELDS}`,
            {
              headers: { Accept: "application/json" },
              signal: controller.signal,
            },
          );
        } finally {
          clearTimeout(timer);
        }
        if (!res.ok) throw new Error(`Strapi responded with ${res.status}`);
        const json = (await res.json()) as { data?: StrapiImageEntry[] };
        images = resolveEntryImages(json.data);
        break;
      } catch (err) {
        console.error("[homepage] Failed to fetch standard images from Strapi:", err);
      }
    }

    const result = images ?? [];
    standardCache = result;
    standardCacheAt = Date.now();
    await writeEdgeCache("standard-images", result, EDGE_CACHE_TTL_SECONDS);
    return result;
  });

export async function fetchStandardImages(): Promise<GalleryImage[]> {
  return fetchStandardImagesFromCms();
}

// ---------------------------------------------------------------------------
// Guest reviews
// ---------------------------------------------------------------------------

export const fetchReviewsFromCms = createServerFn()
  .validator((data: { force?: boolean } | undefined) => data)
  .handler(async ({ data }) => {
    const force = data?.force === true;
    if (!force) {
      const edge = await readEdgeCache<Testimonial[]>("reviews");
      if (edge) return edge;
      const now = Date.now();
      if (reviewsCache && now - reviewsCacheAt < CACHE_TTL_MS) return reviewsCache;
    }

    let reviews: Testimonial[] | null = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        let res: Response;
        try {
          res = await fetch(`${STRAPI_URL}/api/reviews?sort[0]=order:asc`, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }
        if (!res.ok) throw new Error(`Strapi responded with ${res.status}`);
        const json = (await res.json()) as { data?: StrapiReviewEntry[] };
        reviews = sortEntries(json.data).map((entry) => ({
          quote: entry.quote ?? "",
          name: entry.name ?? "",
          project: entry.project ?? "",
          location: entry.location ?? "",
        }));
        break;
      } catch (err) {
        console.error("[homepage] Failed to fetch reviews from Strapi:", err);
      }
    }

    const result = reviews ?? [];
    reviewsCache = result;
    reviewsCacheAt = Date.now();
    await writeEdgeCache("reviews", result, EDGE_CACHE_TTL_SECONDS);
    return result;
  });

export async function fetchReviews(): Promise<Testimonial[]> {
  return fetchReviewsFromCms();
}

// ---------------------------------------------------------------------------
// Instagram videos
// ---------------------------------------------------------------------------

export const fetchInstagramVideosFromCms = createServerFn()
  .validator((data: { force?: boolean } | undefined) => data)
  .handler(async ({ data }) => {
    const force = data?.force === true;
    if (!force) {
      const edge = await readEdgeCache<InstagramVideo[]>("instagram-videos");
      if (edge) return edge;
      const now = Date.now();
      if (videosCache && now - videosCacheAt < CACHE_TTL_MS) return videosCache;
    }

    let videos: InstagramVideo[] | null = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        let res: Response;
        try {
          res = await fetch(`${STRAPI_URL}/api/instagram-videos?sort[0]=order:asc`, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }
        if (!res.ok) throw new Error(`Strapi responded with ${res.status}`);
        const json = (await res.json()) as { data?: StrapiInstagramEntry[] };
        videos = sortEntries(json.data)
          .filter((entry) => entry.url)
          .map((entry) => ({
            url: entry.url ?? "",
            caption: entry.caption ?? "",
            embedUrl: instagramEmbedUrl(entry.url ?? ""),
            thumbnailUrl: instagramThumbnailUrl(entry.url ?? ""),
          }));
        break;
      } catch (err) {
        console.error("[homepage] Failed to fetch Instagram videos from Strapi:", err);
      }
    }

    const result = videos ?? [];
    videosCache = result;
    videosCacheAt = Date.now();
    await writeEdgeCache("instagram-videos", result, EDGE_CACHE_TTL_SECONDS);
    return result;
  });

export async function fetchInstagramVideos(): Promise<InstagramVideo[]> {
  return fetchInstagramVideosFromCms();
}

// ---------------------------------------------------------------------------
// Shared cache resets
// ---------------------------------------------------------------------------

let galleryCache: GalleryImage[] | null = null;
let galleryCacheAt = 0;
let standardCache: GalleryImage[] | null = null;
let standardCacheAt = 0;
let reviewsCache: Testimonial[] | null = null;
let reviewsCacheAt = 0;
let videosCache: InstagramVideo[] | null = null;
let videosCacheAt = 0;

/** Clears the in-process homepage section caches so the next reads refetch. */
export function resetHomepageCaches(): void {
  galleryCache = null;
  galleryCacheAt = 0;
  standardCache = null;
  standardCacheAt = 0;
  reviewsCache = null;
  reviewsCacheAt = 0;
  videosCache = null;
  videosCacheAt = 0;
}
