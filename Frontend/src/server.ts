import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { resetBlogCache, fetchBlogPosts } from "./lib/blog";
import { resetStaysCache, fetchStays } from "./lib/stays";
import { resetHomepageCaches } from "./lib/homepage";
import { resetSiteCache } from "./lib/site";
import { resetFaqCache } from "./lib/faq";
import { resetHeroSearchCache } from "./lib/hero-search";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Reads a secret from every source that exposes Worker bindings: the direct
 * `env` argument, Nitro's `globalThis.__env__` (set by the cloudflare-module
 * preset before dispatching to the SSR entry), and `process.env` (available
 * under nodejs_compat and in local development).
 */
function readSecret(env: unknown, key: string): string {
  const candidates = [
    env,
    (globalThis as { __env__?: Record<string, string | undefined> }).__env__,
    typeof process !== "undefined" ? process.env : undefined,
  ] as (Record<string, string | undefined> | undefined)[];
  for (const candidate of candidates) {
    const value = candidate?.[key];
    if (value) return value;
  }
  return "";
}

async function lookupZoneId(token: string, zone: string): Promise<string> {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${zone}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = (await res.json()) as { result?: { id?: string }[] };
  return json.result?.[0]?.id ?? "";
}

/**
 * Strapi webhook receiver. Strapi POSTs to /api/purge-cache whenever a
 * configured content type changes, and this clears the Cloudflare zone cache
 * (which also drops the `_cache/blogs` + `_cache/site` Cache API entries) plus
 * the in-process caches, so CMS edits appear on the site immediately. The
 * webhook only requires the `x-strapi-secret` header when `PURGE_SECRET` is
 * configured.
 */
async function handlePurgeWebhook(request: Request, env: unknown): Promise<Response | null> {
  const url = new URL(request.url);
  if (request.method !== "POST" || url.pathname !== "/api/purge-cache") return null;

  const secret = readSecret(env, "PURGE_SECRET");
  // PURGE_SECRET is optional: when it is not configured the webhook is open.
  // When it is configured, the request must present the matching secret.
  if (secret && request.headers.get("x-strapi-secret") !== secret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const apiToken = readSecret(env, "CF_API_TOKEN");
  let zoneId = readSecret(env, "CF_ZONE_ID");
  if (!zoneId) {
    const zone = readSecret(env, "CF_ZONE");
    if (zone) zoneId = await lookupZoneId(apiToken, zone);
  }
  if (!apiToken || !zoneId) {
    return new Response(JSON.stringify({ error: "Cloudflare credentials not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  resetBlogCache();
  resetSiteCache();
  resetStaysCache();
  resetHomepageCaches();
  resetFaqCache();
  resetHeroSearchCache();

  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ purge_everything: true }),
  });
  const json = await res.json();
  return new Response(JSON.stringify(json), {
    status: res.ok ? 200 : 502,
    headers: { "content-type": "application/json" },
  });
}

const SITE_URL = "https://brijstays.in";
const CANONICAL_HOST = "brijstays.in";
// A year with includeSubDomains + preload. Once stored the browser never
// attempts plain HTTP for this host (or any sub-domain), so the "not secure"
// warning cannot come back after the first HTTPS visit. The preload flag also
// allows submission to hstspreload.org for baked-in browser lists.
const HSTS_MAX_AGE = 31_536_000;
const HSTS_VALUE = `max-age=${HSTS_MAX_AGE}; includeSubDomains; preload`;

/**
 * True when the visitor reached us over HTTPS. Cloudflare terminates TLS at
 * the edge and forwards the original scheme in several places:
 *   1. `cf-visitor: {"scheme":"https"}`  — Cloudflare's own header
 *   2. `x-forwarded-proto: https`         — standard proxy header
 *   3. request URL protocol               — fallback when headers are absent
 */
function isSecureRequest(request: Request): boolean {
  const cfVisitor = request.headers.get("cf-visitor");
  if (cfVisitor) {
    try {
      const parsed = JSON.parse(cfVisitor) as { scheme?: string };
      if (parsed.scheme) return parsed.scheme === "https";
    } catch {
      // fall through to next check
    }
  }
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0]?.trim().toLowerCase() === "https";
  return new URL(request.url).protocol === "https:";
}

/**
 * Sends plain-HTTP and www requests to the canonical https://brijstays.in URL.
 * Cloudflare can enforce this at the edge (Always Use HTTPS), but doing it
 * here guarantees the upgrade even when that toggle is off — otherwise Chrome
 * on Android shows "This site doesn't support a secure connection" instead of
 * following a redirect.
 * Only safe read methods are redirected so the Strapi webhook is never touched.
 * The 301 itself already carries HSTS so the browser remembers the upgrade
 * without needing a second round-trip.
 */
function handleCanonicalRedirect(request: Request): Response | null {
  if (request.method !== "GET" && request.method !== "HEAD") return null;

  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const canonicalHost = host === `www.${CANONICAL_HOST}` ? CANONICAL_HOST : host;
  const needsHostFix = canonicalHost !== host;
  const needsSchemeFix = !isSecureRequest(request);
  if (!needsHostFix && !needsSchemeFix) return null;

  url.protocol = "https:";
  url.host = canonicalHost;
  // Build the redirect with HSTS already attached — withSecurityHeaders would
  // otherwise be skipped because we return early from handleRequest.
  return new Response(null, {
    status: 301,
    headers: {
      location: url.toString(),
      "strict-transport-security": HSTS_VALUE,
      "cache-control": "public, max-age=86400",
    },
  });
}

/**
 * Marks every HTTPS response as HTTPS-only and adds baseline hardening headers.
 * Cloudflare can add these at the edge, but sending them from the Worker
 * guarantees they are present even when that setting is off — which is what
 * stops the plain-HTTP warning from ever appearing again.
 */
function withSecurityHeaders(request: Request, response: Response): Response {
  if (!isSecureRequest(request)) return response;
  const headers = new Headers(response.headers);
  if (!headers.has("strict-transport-security")) {
    headers.set("strict-transport-security", HSTS_VALUE);
  }
  if (!headers.has("x-content-type-options")) {
    headers.set("x-content-type-options", "nosniff");
  }
  if (!headers.has("x-frame-options")) {
    headers.set("x-frame-options", "SAMEORIGIN");
  }
  if (!headers.has("referrer-policy")) {
    headers.set("referrer-policy", "strict-origin-when-cross-origin");
  }
  if (!headers.has("permissions-policy")) {
    headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  }
  // Avoid leaking HSTS state to non-HTTPS callers; otherwise return cloned response.
  const hadHsts = response.headers.has("strict-transport-security");
  const hasNew = headers.has("strict-transport-security");
  if (hadHsts && !hasNew) return response;
  // Only create a new Response when we actually added something.
  const added =
    headers.get("strict-transport-security") !== response.headers.get("strict-transport-security") ||
    headers.get("x-content-type-options") !== response.headers.get("x-content-type-options");
  if (!added) return response;
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const sitemapStaticPaths = [
  "",
  "/stays",
  "/about",
  "/director",
  "/contact",
  "/media",
  "/privacy-policy",
  "/terms-and-conditions",
];

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates the XML sitemap dynamically so stays and CMS blog posts stay in
 * sync with content. Includes the static routes, every stay detail page, and
 * every blog post (with the bundled fallback posts when Strapi is unreachable).
 */
async function buildSitemapXml(): Promise<string> {
  const lastmod = new Date().toISOString();
  const urls: string[] = [];
  const push = (path: string) =>
    urls.push(`  <url><loc>${SITE_URL}${path}</loc><lastmod>${lastmod}</lastmod></url>`);

  for (const path of sitemapStaticPaths) push(path);

  let stays: Awaited<ReturnType<typeof fetchStays>> = [];
  try {
    stays = await fetchStays();
  } catch {
    stays = [];
  }
  if (stays.length === 0) {
    const { stayList } = await import("./lib/data/stays");
    stays = stayList;
  }
  for (const stay of stays) push(`/stays/${xmlEscape(stay.slug)}`);

  let posts: Awaited<ReturnType<typeof fetchBlogPosts>> = [];
  try {
    posts = await fetchBlogPosts();
  } catch {
    posts = [];
  }
  if (posts.length === 0) {
    const { blogPostList } = await import("./lib/data/blogPosts");
    posts = blogPostList;
  }
  for (const post of posts) push(`/media/${xmlEscape(post.slug)}`);

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function handleSitemap(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (request.method !== "GET" || url.pathname !== "/sitemap.xml") return null;
  const xml = await buildSitemapXml();
  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}

/**
 * Instagram cover proxy. Browsers often fail to load Instagram's cover image
 * directly (hotlink/cookie/referrer blocks vary by network and device), so the
 * cover <img> points here instead of at instagram.com. The Worker fetches the
 * media URL server-side and returns the JPEG from our own domain, cached at
 * the Cloudflare edge so repeat views never touch Instagram again.
 */
async function handleInstagramCover(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (request.method !== "GET" || url.pathname !== "/api/ig-cover") return null;

  const target = url.searchParams.get("url");
  if (!target) return new Response("missing url", { status: 400 });

  // Only ever proxy Instagram media URLs — never let this become an open proxy.
  let instagramUrl: URL;
  try {
    instagramUrl = new URL(target);
  } catch {
    return new Response("invalid url", { status: 400 });
  }
  if (!/^https:$/.test(instagramUrl.protocol)) return new Response("invalid url", { status: 400 });
  const host = instagramUrl.hostname.replace(/^www\./, "");
  if (host !== "instagram.com" && !host.endsWith(".instagram.com")) {
    return new Response("forbidden", { status: 403 });
  }

  try {
    const upstream = await fetch(instagramUrl, {
      headers: {
        // Instagram's /media/ endpoint serves the JPEG to a plain GET.
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
        accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!upstream.ok) {
      return new Response(`upstream ${upstream.status}`, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=86400, s-maxage=86400",
        // The final CDN URL is a signed fbcdn.net URL that changes on each
        // fetch, so never store the redirect target — only the image bytes.
        "content-length": String(body.byteLength),
      },
    });
  } catch {
    return new Response("upstream error", { status: 502 });
  }
}

async function handleRequest(request: Request, env: unknown, ctx: unknown): Promise<Response> {
  const redirectResponse = handleCanonicalRedirect(request);
  if (redirectResponse) return redirectResponse;
  const sitemapResponse = await handleSitemap(request);
  if (sitemapResponse) return sitemapResponse;
  const purgeResponse = await handlePurgeWebhook(request, env);
  if (purgeResponse) return purgeResponse;
  const coverResponse = await handleInstagramCover(request);
  if (coverResponse) return coverResponse;
  try {
    const handler = await getServerEntry();
    const response = await handler.fetch(request, env, ctx);
    return await normalizeCatastrophicSsrResponse(response);
  } catch (error) {
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    return withSecurityHeaders(request, await handleRequest(request, env, ctx));
  },
};
