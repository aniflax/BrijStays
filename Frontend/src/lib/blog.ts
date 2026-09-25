// Blog data fetched from the Strapi "Blogs" collection type. All CMS reads run
// through a server function, so they always happen on the Worker (never the
// browser) — client-side navigation works without backend CORS and stays fast.
// Falls back to the bundled static posts when Strapi is unreachable.

import { createServerFn } from "@tanstack/react-start";
import { STRAPI_URL, resolveMediaUrl } from "./site";
import type { StrapiMedia } from "./site";
import type { BlogPost } from "./data/types";
import { readEdgeCache, readLastGoodCache, writeEdgeCache } from "./server-cache";

// SSR waits on this fetch before it can send any HTML, so it is deliberately
// short: a cold or overloaded backend must degrade quickly instead of holding
// the page open until the browser gives up.
const FETCH_TIMEOUT_MS = 3_000;
const CACHE_TTL_MS = 60 * 60 * 1000;
const EDGE_CACHE_TTL_SECONDS = 60 * 60;
const MAX_ATTEMPTS = 1;

const BLOGS_QUERY = [
  "sort[0]=date:desc",
  "fields[0]=Type",
  "fields[1]=ReadingTime",
  "fields[2]=Title",
  "fields[3]=shortTag",
  "fields[4]=date",
  "fields[5]=Blog",
  "fields[6]=Ending",
  "fields[7]=imp",
  "fields[8]=showOnhomePage",
  "populate[image][fields][0]=url",
  "populate[image][fields][1]=alternativeText",
].join("&");

type StrapiBlogDocument = {
  id: number;
  documentId: string;
  Type?: string | null;
  ReadingTime?: string | null;
  Title?: string | null;
  shortTag?: string | null;
  date?: string | null;
  Blog?: string | null;
  Ending?: string | null;
  image?: { url?: string | null; alternativeText?: string | null } | null;
  imp?: boolean | null;
  showOnhomePage?: boolean | null;
};

/** Removes bold/italic markdown markers, keeping the inner text. */
function stripMarkdown(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/_([^_]*)_/g, "$1");
}

/**
 * Converts Strapi's markdown richtext string into the frontend's simple block
 * shape. Blank lines separate blocks; `**...**` lines become headings and
 * `_..._` lines become pull quotes.
 */
function markdownToBlocks(markdown: string): BlogPost["body"] {
  const blocks: BlogPost["body"] = [];
  for (const raw of markdown.split(/\n\s*\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("**") && line.endsWith("**")) {
      blocks.push({ type: "heading", text: stripMarkdown(line.slice(2, -2)) });
    } else if (
      (line.startsWith("_") && line.endsWith("_")) ||
      (line.startsWith("*") && line.endsWith("*"))
    ) {
      blocks.push({ type: "quote", text: stripMarkdown(line.slice(1, -1)) });
    } else {
      blocks.push({ type: "paragraph", text: stripMarkdown(line) });
    }
  }
  return blocks;
}

/** Strapi v5 returns documents flat, without the v4 `attributes` wrapper. */
function slugify(text: string | null | undefined): string {
  const raw = (text ?? "").trim().toLowerCase();
  if (!raw) return "";
  return raw
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function normalizeBlog(doc: StrapiBlogDocument): BlogPost {
  const body = markdownToBlocks(doc.Blog ?? "");
  const firstParagraph = body.find((b) => b.type === "paragraph")?.text ?? "";
  // Prefer Title for slug (unique per post); fallback to documentId. Type is
  // not unique — three posts share "Information" and would collide.
  const base = slugify(doc.Title) || doc.documentId;
  // Deduplication is handled by deduplicateBySlug after mapping, but keep the
  // raw slug here; the caller will ensure uniqueness.
  let coverImage = resolveMediaUrl(doc.image as StrapiMedia);
  // Fix known CMS data error: the duplicate "The Ultimate 2-Day..." on
  // 2026-09-09 (documentId xeesq1eqguefdbpht0tmoz4l) was saved with a stay
  // screenshot instead of the itinerary infographic. Override to the correct
  // Vrindavan Blog image so homepage and media both show the right cover.
  const isItinerary = (doc.Title ?? "").trim() === "The Ultimate 2-Day Spiritual Itinerary for Vrindavan";
  const isWrongImage = coverImage.includes("Screenshot_2026_09_07_at_4_42_37_PM");
  if (isItinerary && isWrongImage) {
    coverImage = "https://cdn.brijstays.in/Vrindavan_Blog_6862edf3c9.png";
  }
  return {
    slug: base || doc.documentId,
    title: doc.Title ?? "Untitled",
    excerpt: firstParagraph,
    category: doc.Type ?? "",
    readingTime: doc.ReadingTime ?? "",
    coverImage,
    coverAlt: doc.image?.alternativeText ?? doc.Title ?? "",
    author: doc.shortTag ?? "",
    publishedAt: doc.date ?? "",
    ending: doc.Ending ?? "",
    imp: Boolean(doc.imp),
    showOnHomePage: Boolean(doc.showOnhomePage),
    body,
  };
}

/** Ensures slugs are unique when Strapi has duplicate Titles (e.g. two
 *  "The Ultimate 2-Day..." posts). Appends a short hash from documentId. */
function deduplicateBySlug(posts: BlogPost[], docs: StrapiBlogDocument[]): BlogPost[] {
  const seen = new Map<string, number>();
  return posts.map((post, i) => {
    const base = post.slug;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    if (count === 0) return post;
    // Append 4-char hash from documentId to make it unique, e.g.
    // "the-ultimate-..." + "-xees"
    const suffix = docs[i]?.documentId?.slice(0, 4) ?? String(count);
    return { ...post, slug: `${base}-${suffix}` };
  });
}

let cachedPosts: BlogPost[] | null = null;
let cachedAt = 0;

export const fetchBlogPostsFromCms = createServerFn()
  .validator((data: { force?: boolean } | undefined) => data)
  .handler(async ({ data }) => {
    const force = data?.force === true;

    if (!force) {
      const edge = await readEdgeCache<BlogPost[]>("blogs");
      if (edge) return edge;
      const now = Date.now();
      if (cachedPosts && now - cachedAt < CACHE_TTL_MS) return cachedPosts;
    }

    let posts: BlogPost[] | null = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        let res: Response;
        try {
          res = await fetch(`${STRAPI_URL}/api/blogs?${BLOGS_QUERY}`, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }
        if (!res.ok) throw new Error(`Strapi responded with ${res.status}`);
        const json = (await res.json()) as { data?: StrapiBlogDocument[] };
        const docs = json.data ?? [];
        const mapped = docs.map(normalizeBlog);
        posts = deduplicateBySlug(mapped, docs);
        break;
      } catch (err) {
        console.error("[blog] Failed to fetch blogs from Strapi:", err);
      }
    }

    if (!posts) {
      // Serve the newest copy that did load, without caching it, so the next
      // request retries Strapi instead of pinning empty content for the TTL.
      return (await readLastGoodCache<BlogPost[]>("blogs")) ?? [];
    }
    cachedPosts = posts;
    cachedAt = Date.now();
    await writeEdgeCache("blogs", posts, EDGE_CACHE_TTL_SECONDS);
    return posts;
  });

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return fetchBlogPostsFromCms();
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  let posts = await fetchBlogPostsFromCms();
  let found = posts.find((p) => p.slug === slug);
  if (!found) {
    posts = await fetchBlogPostsFromCms({ data: { force: true } });
    found = posts.find((p) => p.slug === slug);
  }
  return found;
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const posts = await fetchBlogPostsFromCms();
  return posts.filter((p) => p.slug !== slug).slice(0, limit);
}

/** Clears the in-process blog cache so the next read refetches from Strapi. */
export function resetBlogCache(): void {
  cachedPosts = null;
  cachedAt = 0;
}
