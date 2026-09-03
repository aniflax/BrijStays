// Site-wide contact & social information.
// Email, phone, WhatsApp, and social links are fetched from the Strapi backend
// ("Personal Informations" single type). The remaining site details, including
// business hours, stay defined here in the frontend.
// CMS reads run through a server function so they always happen on the Worker
// (never the browser) — client-side navigation works without backend CORS.

import { createServerFn } from "@tanstack/react-start";
import { readEdgeCache, writeEdgeCache } from "./server-cache";

export type SiteSocial = { label: string; href: string; icon: string };

export type Site = {
  name: string;
  tagline: string;
  mission: string;
  address: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsapp: string;
  hours: string;
  gst: string;
  socials: SiteSocial[];
  founderImage: string;
  coFounderImage: string;
};

export const STATIC_SITE = {
  name: "Brij Stays",
  tagline: "Premium stays in Vrindavan",
  mission: "Premium, comfortable and curated boutique stays in Vrindavan.",
  address:
    "Krishna Castle Group Housing-5, Omaxe Eternity, Vrindavan, Mathura, Uttar Pradesh – 281121",
  hours: "Monday – Sunday: 24/7 Operations",
  gst: "GST · Non-GST",
} as const;

/** Where the Google Map previews point. */
export const MAP_QUERY =
  "Krishna Castle Group Housing-5, Omaxe Eternity, Vrindavan, Mathura, Uttar Pradesh – 281121";

/** Raw shape of the Strapi "Personal Informations" single type. */
export type StrapiMedia = {
  url?: string | null;
  data?: { attributes?: { url?: string | null } | null } | null;
} | null;

export type PersonalInformation = {
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  founder?: StrapiMedia;
  coFounder?: StrapiMedia;
};

export const enquiryTypes = [
  "Stay Booking",
  "Corporate / Bulk Booking",
  "Long-term Stay",
  "Group Booking",
  "Other",
] as const;

/**
 * Builds a usable WhatsApp deep-link from a Strapi value that may be stored as
 * a full URL or as a bare phone number (e.g. "919800126777" or "+91 98001 26777").
 * Falls back to the site phone number when no WhatsApp value is provided.
 */
export function buildWhatsAppHref(value: string | null | undefined, phone: string): string {
  const raw = (value ?? "").trim();
  if (/^https?:\/\//i.test(raw) || /^wa\.me\//i.test(raw)) {
    return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  }
  const digits = raw.replace(/\D/g, "");
  const number = digits || phone.replace(/\D/g, "");
  return number ? `https://wa.me/${number}` : "";
}

/**
 * Extracts the numeric WhatsApp number from a wa.me deep-link (e.g.
 * `https://wa.me/918826287015` → `918826287015`). Empty when the CMS hasn't
 * provided one.
 */
export function waNumberFromHref(href: string): string {
  const match = href.match(/wa\.me\/([^?#]+)/);
  return (match?.[1] ?? "").replace(/\D/g, "");
}

export function normalizeSite(info: PersonalInformation | null | undefined): Site {
  const i = info ?? {};
  const phone = i.phone ?? "";
  const instagram = i.instagram ?? "";
  return {
    ...STATIC_SITE,
    email: i.email ?? "",
    phoneDisplay: phone,
    phoneHref: phone ? `tel:+${phone.replace(/\D/g, "")}` : "",
    whatsapp: buildWhatsAppHref(i.whatsapp, phone),
    hours: STATIC_SITE.hours,
    gst: STATIC_SITE.gst,
    socials: [
      ...(instagram ? [{ label: "Instagram", href: instagram, icon: "Instagram" as const }] : []),
      ...(i.facebook ? [{ label: "Facebook", href: i.facebook, icon: "Facebook" as const }] : []),
      ...(i.youtube ? [{ label: "YouTube", href: i.youtube, icon: "Youtube" as const }] : []),
      ...(i.linkedin ? [{ label: "LinkedIn", href: i.linkedin, icon: "Linkedin" as const }] : []),
      ...(i.twitter ? [{ label: "Twitter", href: i.twitter, icon: "Twitter" as const }] : []),
    ],
    founderImage: resolveMediaUrl(i.founder),
    coFounderImage: resolveMediaUrl(i.coFounder),
  };
}

/**
 * Resolves a Strapi media object to an absolute URL. Handles both the flat
 * Strapi v5 shape (`{ url }`) and the older wrapped shape (`{ data.attributes.url }`).
 * Relative upload paths are prefixed with the backend URL so they work in dev too.
 */
export function resolveMediaUrl(media: StrapiMedia | undefined): string {
  const url = media?.url ?? media?.data?.attributes?.url;
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = STRAPI_URL.replace(/\/+$/, "");
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

export const EMPTY_SITE: Site = {
  ...STATIC_SITE,
  email: "",
  phoneDisplay: "",
  phoneHref: "",
  whatsapp: "",
  hours: STATIC_SITE.hours,
  gst: STATIC_SITE.gst,
  socials: [],
  founderImage: "",
  coFounderImage: "",
};

export type WhatsAppExtras = {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  requirements?: string;
};

/**
 * Builds a wa.me deep link with a pre-filled inquiry message for a specific
 * property. Structured so check-in / check-out / guest count / requirements
 * can be appended later without rebuilding the component.
 */
export function buildStayWhatsAppHref(title: string, number = "", extras?: WhatsAppExtras): string {
  if (!number) return "";
  let message = `Hi Brij Stays, I am interested in booking the "${title}". Please share the availability, pricing, and booking details.`;
  const lines: string[] = [];
  if (extras?.checkIn) lines.push(`Check-in: ${extras.checkIn}`);
  if (extras?.checkOut) lines.push(`Check-out: ${extras.checkOut}`);
  if (extras?.guests) lines.push(`Guests: ${extras.guests}`);
  if (extras?.requirements) lines.push(`Requirements: ${extras.requirements}`);
  if (lines.length) message = `${message}\n\n${lines.join("\n")}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// Public Strapi/Render base URL. Use the Cloudflare Worker runtime variable
// STRAPI_URL to override this; the fallback only applies when that is absent.
const PRODUCTION_STRAPI_URL = "https://admin.brijstays.in";

/**
 * Sanitizes a raw backend URL value from env vars so common mistakes (trailing
 * slashes, a `/api` path, a missing `https://` scheme, whitespace) don't break
 * the fetch. Returns undefined for values that can't produce a usable URL.
 */
function normalizeBackendUrl(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  let url = raw.trim();
  if (!url) return undefined;
  url = url.replace(/\/+$/, "").replace(/\/api(\/.*)?$/, "");
  if (!url) return undefined;
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    return new URL(url).toString().replace(/\/+$/, "");
  } catch {
    return undefined;
  }
}

function resolveStrapiUrl(): string {
  // Runtime env (Cloudflare Worker vars / Render-provided): STRAPI_URL
  // Build-time env (Vite): VITE_STRAPI_URL
  // Dev fallback: local backend. Production fallback: the deployed backend.
  const runtimeUrl = normalizeBackendUrl(
    typeof process !== "undefined" ? process.env?.["STRAPI_URL"] : undefined,
  );
  const buildUrl = normalizeBackendUrl(import.meta.env?.["VITE_STRAPI_URL"]);
  const fallback = import.meta.env.DEV ? "http://localhost:1337" : PRODUCTION_STRAPI_URL;
  // In production only trust an explicit HTTPS value; otherwise the known
  // backend URL is used so the site never falls back to empty contact data.
  if (import.meta.env.DEV) {
    return runtimeUrl ?? buildUrl ?? fallback;
  }
  const candidate = runtimeUrl ?? buildUrl;
  return candidate && /^https:\/\//.test(candidate) ? candidate : fallback;
}

export const STRAPI_URL = resolveStrapiUrl();

let cachedSite: Site | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;
const EDGE_CACHE_TTL_SECONDS = 10 * 60;
const FETCH_TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 2;

async function fetchSiteOnce(): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(`${STRAPI_URL}/api/personal-information?populate=*`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export const fetchSiteFromCms = createServerFn()
  .validator((data: { force?: boolean } | undefined) => data)
  .handler(async ({ data }) => {
    const force = data?.force === true;

    if (!force) {
      const edge = await readEdgeCache<Site>("site");
      if (edge) return edge;
      const now = Date.now();
      if (cachedSite && now - cachedAt < CACHE_TTL_MS) return cachedSite;
    }

    let site: Site | null = null;
    let lastError: unknown;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetchSiteOnce();
        if (!res.ok) throw new Error(`Strapi responded with ${res.status}`);
        const json = (await res.json()) as { data?: PersonalInformation };
        site = normalizeSite(json.data);
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!site) {
      console.error("[site] Failed to fetch personal information from Strapi:", lastError);
    }
    const result = site ?? EMPTY_SITE;
    cachedSite = result;
    cachedAt = Date.now();
    await writeEdgeCache("site", result, EDGE_CACHE_TTL_SECONDS);
    return result;
  });

/**
 * Fetches the "Personal Informations" single type from Strapi through a server
 * function. Falls back to an empty site (no hardcoded real data) if the backend
 * is unreachable, so pages still render.
 */
export async function fetchSite(force = false): Promise<Site> {
  return fetchSiteFromCms({ data: { force } });
}

/** Clears the in-process site cache so the next read refetches from Strapi. */
export function resetSiteCache(): void {
  cachedSite = null;
  cachedAt = 0;
}

export function mapEmbedFor(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=en&z=13&output=embed`;
}

export function mapLinkFor(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
