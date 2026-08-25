// Blog data fetched from the Strapi "Blogs" collection type.
// Falls back to the bundled static posts when the backend is unreachable.

import { STRAPI_URL, resolveMediaUrl } from "./site";
import type { StrapiMedia } from "./site";
import { blogPostList } from "./data/blogPosts";
import type { BlogPost } from "./data/types";

const FETCH_TIMEOUT_MS = 15_000;
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 2;

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
function normalizeBlog(doc: StrapiBlogDocument): BlogPost {
  const body = markdownToBlocks(doc.Blog ?? "");
  const firstParagraph = body.find((b) => b.type === "paragraph")?.text ?? "";
  return {
    slug: doc.documentId,
    title: doc.Title ?? "Untitled",
    excerpt: firstParagraph,
    category: doc.Type ?? "",
    readingTime: doc.ReadingTime ?? "",
    coverImage: resolveMediaUrl(doc.image as StrapiMedia),
    coverAlt: doc.image?.alternativeText ?? doc.Title ?? "",
    author: doc.shortTag ?? "",
    publishedAt: doc.date ?? "",
    ending: doc.Ending ?? "",
    imp: Boolean(doc.imp),
    showOnHomePage: Boolean(doc.showOnhomePage),
    body,
  };
}

let cachedPosts: BlogPost[] | null = null;
let cachedAt = 0;

export async function fetchBlogPosts(force = false): Promise<BlogPost[]> {
  const now = Date.now();
  if (!force && cachedPosts && now - cachedAt < CACHE_TTL_MS) return cachedPosts;

  let posts: BlogPost[] | null = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      let res: Response;
      try {
        res = await fetch(`${STRAPI_URL}/api/blogs?populate=*&sort[0]=date:desc`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
      if (!res.ok) throw new Error(`Strapi responded with ${res.status}`);
      const json = (await res.json()) as { data?: StrapiBlogDocument[] };
      posts = (json.data ?? []).map(normalizeBlog);
      break;
    } catch (err) {
      console.error("[blog] Failed to fetch blogs from Strapi:", err);
    }
  }

  cachedPosts = posts ?? blogPostList;
  cachedAt = Date.now();
  return cachedPosts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  let posts = await fetchBlogPosts();
  let found = posts.find((p) => p.slug === slug);
  if (!found && cachedPosts) {
    posts = await fetchBlogPosts(true);
    found = posts.find((p) => p.slug === slug);
  }
  return found;
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const posts = await fetchBlogPosts();
  return posts.filter((p) => p.slug !== slug).slice(0, limit);
}
