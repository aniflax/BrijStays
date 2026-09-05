// FAQ section content fetched from Strapi's FAQ collection and shown on the
// homepage above the footer. Reads run through a server function on the
// Worker (never the browser) and fall back to the bundled static FAQs when
// Strapi is unreachable or returns no entries.

import { createServerFn } from "@tanstack/react-start";
import { STRAPI_URL } from "./site";
import { readEdgeCache, writeEdgeCache } from "./server-cache";
import type { Faq } from "./data/types";

const FETCH_TIMEOUT_MS = 15_000;
const CACHE_TTL_MS = 10 * 60 * 1000;
const EDGE_CACHE_TTL_SECONDS = 10 * 60;
const MAX_ATTEMPTS = 2;

type StrapiFaqEntry = {
  id: number;
  documentId: string;
  question?: string | null;
  answer?: string | null;
  order?: number | null;
};

function sortEntries<T extends { order?: number | null }>(entries: T[] | undefined): T[] {
  return [...(entries ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export const fetchFaqsFromCms = createServerFn()
  .validator((data: { force?: boolean } | undefined) => data)
  .handler(async ({ data }) => {
    const force = data?.force === true;
    if (!force) {
      const edge = await readEdgeCache<Faq[]>("faqs");
      if (edge) return edge;
      const now = Date.now();
      if (faqsCache && now - faqsCacheAt < CACHE_TTL_MS) return faqsCache;
    }

    let faqs: Faq[] | null = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        let res: Response;
        try {
          res = await fetch(`${STRAPI_URL}/api/faqs?sort[0]=order:asc&pagination[pageSize]=100`, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }
        if (!res.ok) throw new Error(`Strapi responded with ${res.status}`);
        const json = (await res.json()) as { data?: StrapiFaqEntry[] };
        const entries = sortEntries(json.data).filter(
          (entry) => entry.question?.trim() && entry.answer?.trim(),
        );
        if (entries.length > 0) {
          faqs = entries.map((entry) => ({
            question: entry.question ?? "",
            answer: entry.answer ?? "",
          }));
        }
        break;
      } catch (err) {
        console.error("[faq] Failed to fetch FAQs from Strapi:", err);
      }
    }

    // Only CMS content is used; the section renders nothing when Strapi is
    // unreachable or has no entries.
    const result = faqs ?? [];
    faqsCache = result;
    faqsCacheAt = Date.now();
    await writeEdgeCache("faqs", result, EDGE_CACHE_TTL_SECONDS);
    return result;
  });

export async function fetchFaqs(): Promise<Faq[]> {
  return fetchFaqsFromCms();
}

let faqsCache: Faq[] | null = null;
let faqsCacheAt = 0;

/** Clears the in-process FAQ cache so the next read refetches. */
export function resetFaqCache(): void {
  faqsCache = null;
  faqsCacheAt = 0;
}
