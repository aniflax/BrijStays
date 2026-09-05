// Hero search bar options (location, stay type and guest range dropdowns)
// fetched from the Strapi "Hero Search" single type. Reads run through a
// server function on the Worker (never the browser). Only CMS content is used;
// when Strapi is unreachable or has no entries the dropdowns are left empty.

import { createServerFn } from "@tanstack/react-start";
import { STRAPI_URL } from "./site";
import { readEdgeCache, writeEdgeCache } from "./server-cache";

const FETCH_TIMEOUT_MS = 15_000;
const CACHE_TTL_MS = 10 * 60 * 1000;
const EDGE_CACHE_TTL_SECONDS = 10 * 60;
const MAX_ATTEMPTS = 2;

/** A single repeatable option row (`{ value }`) from the hero-option component. */
export type HeroOption = {
  id?: number;
  value?: string | null;
};

export type HeroSearch = {
  heroLocations: string[];
  heroStayTypes: string[];
  heroGuestOptions: string[];
};

/** Raw shape of the Strapi "Hero Search" single type. */
export type StrapiHeroSearch = {
  heroLocations?: HeroOption[] | null;
  heroStayTypes?: HeroOption[] | null;
  heroGuestOptions?: HeroOption[] | null;
};

function optionValues(options: HeroOption[] | null | undefined): string[] {
  return (options ?? []).map((option) => option.value?.trim() ?? "").filter(Boolean);
}

export function normalizeHeroSearch(info: StrapiHeroSearch | null | undefined): HeroSearch {
  const i = info ?? {};
  return {
    heroLocations: optionValues(i.heroLocations),
    heroStayTypes: optionValues(i.heroStayTypes),
    heroGuestOptions: optionValues(i.heroGuestOptions),
  };
}

let cached: HeroSearch | null = null;
let cachedAt = 0;

export const fetchHeroSearchFromCms = createServerFn()
  .validator((data: { force?: boolean } | undefined) => data)
  .handler(async ({ data }) => {
    const force = data?.force === true;

    if (!force) {
      const edge = await readEdgeCache<HeroSearch>("hero-search");
      if (edge) return edge;
      const now = Date.now();
      if (cached && now - cachedAt < CACHE_TTL_MS) return cached;
    }

    let result: HeroSearch | null = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        let res: Response;
        try {
          res = await fetch(`${STRAPI_URL}/api/hero-search?populate=*`, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }
        if (!res.ok) throw new Error(`Strapi responded with ${res.status}`);
        const json = (await res.json()) as { data?: StrapiHeroSearch | null };
        result = normalizeHeroSearch(json.data);
        break;
      } catch (err) {
        console.error("[hero-search] Failed to fetch hero options from Strapi:", err);
      }
    }

    result = result ?? { heroLocations: [], heroStayTypes: [], heroGuestOptions: [] };
    cached = result;
    cachedAt = Date.now();
    await writeEdgeCache("hero-search", result, EDGE_CACHE_TTL_SECONDS);
    return result;
  });

export async function fetchHeroSearch(): Promise<HeroSearch> {
  return fetchHeroSearchFromCms();
}

/** Clears the in-process hero-search cache so the next read refetches. */
export function resetHeroSearchCache(): void {
  cached = null;
  cachedAt = 0;
}
