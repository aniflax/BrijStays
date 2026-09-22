/**
 * Cache helpers for server-side CMS fetches. On Cloudflare Workers the data is
 * kept in the per-region Cache API (shared across isolates), with the module
 * cache in each process as a secondary layer. Every failure is swallowed — a
 * cache miss simply means the CMS is fetched again.
 */

type EdgeCache = {
  match: (request: RequestInfo | URL) => Promise<Response | undefined>;
  put: (request: RequestInfo | URL, response: Response) => Promise<void>;
};

type EdgeCacheStorage = { default?: EdgeCache };

const CACHE_ORIGIN = "https://brijstays.in";

// How long the last successfully fetched copy stays readable. This copy is only
// ever used when a CMS request fails, and a slightly old phone number or stay
// list beats a blank one, so it is kept far longer than the fresh window.
const LAST_GOOD_TTL_SECONDS = 7 * 24 * 60 * 60;

function edgeCache(): EdgeCache | null {
  const storage = (globalThis as { caches?: EdgeCacheStorage }).caches;
  return storage?.default ?? null;
}

async function matchJson<T>(cache: EdgeCache, url: string): Promise<T | null> {
  try {
    const response = await cache.match(url);
    if (!response || !response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function jsonResponse<T>(value: T, ttlSeconds: number): Response {
  return new Response(JSON.stringify(value), {
    headers: {
      "content-type": "application/json",
      "cache-control": `public, max-age=${ttlSeconds}`,
    },
  });
}

export async function readEdgeCache<T>(key: string): Promise<T | null> {
  const cache = edgeCache();
  if (!cache) return null;
  return matchJson<T>(cache, `${CACHE_ORIGIN}/_cache/${key}`);
}

/**
 * Reads the last successfully fetched value for a key, however old it is. Used
 * when the CMS cannot be reached so the site keeps showing real content instead
 * of rendering empty sections.
 */
export async function readLastGoodCache<T>(key: string): Promise<T | null> {
  const cache = edgeCache();
  if (!cache) return null;
  return matchJson<T>(cache, `${CACHE_ORIGIN}/_cache/${key}/last-good`);
}

export async function writeEdgeCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  const cache = edgeCache();
  if (!cache) return;
  try {
    // Two entries per key: the fresh window used by normal reads, and a durable
    // copy that survives it so a failed refresh still has something to serve.
    await cache.put(`${CACHE_ORIGIN}/_cache/${key}`, jsonResponse(value, ttlSeconds));
    await cache.put(
      `${CACHE_ORIGIN}/_cache/${key}/last-good`,
      jsonResponse(value, LAST_GOOD_TTL_SECONDS),
    );
  } catch {
    // ignore — the module cache and direct fetches still work.
  }
}
