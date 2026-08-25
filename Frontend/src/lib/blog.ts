// Blog data fetched from the Strapi "Blogs" collection type.
// Falls back to the bundled static posts when the backend is unreachable.

import { STRAPI_URL, resolveMediaUrl } from "./site";
import type { StrapiMedia } from "./site";
import { blogPostList } from "./data/blogPosts";
import type { BlogPost } from "./data/types";

const FETCH_TIMEOUT_MS = 15_000;
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 2;

type StrapiBlockChild = { text?: string };

type StrapiBlock = {
  type: string;
  level?: number;
  children?: StrapiBlockChild[] | (StrapiBlockChild & { children?: StrapiBlockChild[] })[];
};

type StrapiBlogAttributes = {
  Type?: string | null;
  ReadingTime?: string | null;
  Title?: string | null;
  shortTag?: string | null;
  date?: string | null;
  Blog?: StrapiBlock[] | null;
  Ending?: string | null;
  image?: { url?: string | null; alternativeText?: string | null } | null;
  imp?: boolean | null;
  showOnhomePage?: boolean | null;
};

type StrapiBlogEntity = {
  id: number;
  documentId: string;
  attributes: StrapiBlogAttributes;
};

function blockText(children: StrapiBlockChild[] = []): string {
  return children.map((c) => c.text ?? "").join("");
}

/** Flattens Strapi rich-text blocks into the frontend's simple block shape. */
function normalizeBlocks(blocks: StrapiBlock[] | null | undefined): BlogPost["body"] {
  if (!Array.isArray(blocks)) return [];
  return blocks.flatMap((block): BlogPost["body"] => {
    if (block.type === "list" && Array.isArray(block.children)) {
      return block.children
        .map((item) => {
          const text = blockText(
            "children" in item ? (item.children as StrapiBlockChild[]) : [],
          ).trim();
          return text ? [{ type: "paragraph" as const, text }] : [];
        })
        .flat();
    }
    if (block.type === "paragraph" || block.type === "heading" || block.type === "quote") {
      const text = blockText(block.children as StrapiBlockChild[]).trim();
      return text ? [{ type: block.type, text }] : [];
    }
    return [];
  });
}

function normalizeBlog(entity: StrapiBlogEntity): BlogPost {
  const a = entity.attributes;
  const body = normalizeBlocks(a.Blog);
  const firstParagraph = body.find((b) => b.type === "paragraph")?.text ?? "";
  return {
    slug: entity.documentId,
    title: a.Title ?? "Untitled",
    excerpt: firstParagraph,
    category: a.Type ?? "",
    readingTime: a.ReadingTime ?? "",
    coverImage: resolveMediaUrl(a.image as StrapiMedia),
    coverAlt: a.image?.alternativeText ?? a.Title ?? "",
    author: a.shortTag ?? "",
    publishedAt: a.date ?? "",
    ending: a.Ending ?? "",
    imp: Boolean(a.imp),
    showOnHomePage: Boolean(a.showOnhomePage),
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
      const json = (await res.json()) as { data?: StrapiBlogEntity[] };
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