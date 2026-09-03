// Strapi-shaped response helpers.
// A Strapi v4 REST collection response looks like:
// { data: [{ id, attributes: {...} }], meta: { pagination: {...} } }

export type StrapiEntity<T> = {
  id: number;
  attributes: T;
};

export type StrapiCollection<T> = {
  data: StrapiEntity<T>[];
  meta: {
    pagination: { page: number; pageSize: number; pageCount: number; total: number };
  };
};

export function collection<T>(items: StrapiEntity<T>[]): StrapiCollection<T> {
  return {
    data: items,
    meta: {
      pagination: {
        page: 1,
        pageSize: items.length,
        pageCount: 1,
        total: items.length,
      },
    },
  };
}

export type HeroSlide = {
  eyebrow: string;
  headline: string;
  subline: string;
  image: string;
  imageAlt: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export type InstagramVideo = {
  url: string;
  caption: string;
  /** Pre-built `https://www.instagram.com/<path>/embed/` iframe source. */
  embedUrl: string;
  /** Cover-image URL (Instagram redirects to the CDN JPEG). */
  thumbnailUrl: string;
};

export type Stay = {
  slug: string;
  name: string;
  /** Short title for cards (e.g. "Nest in the Forest"); name keeps the full listing title. */
  shortName: string;
  location: string;
  shortDescription: string;
  description: string[];
  highlights: string[];
  heroImage: string;
  heroAlt: string;
  gallery: { src: string; alt: string }[];
  guestCapacity: number;
  bedrooms: number;
  bathrooms: number;
  roomType: string;
  amenities: string[];
  airbnbUrl: string;
  rating: number;
  ratingCount: number;
  category: string;
  building?: string;
  featured: boolean;
  /** When true, the stay appears in the homepage featured grid. */
  showOnHomePage: boolean;
  mapQuery: string;
  coords: { lat: number; lng: number };
};

/**
 * Static fallback stay seed — the bundled local inventory. Photography
 * (heroImage/heroAlt/gallery) is attached from the per-property asset folders
 * after declaration, so those fields are omitted here.
 */
export type StaySeed = Omit<Stay, "heroImage" | "heroAlt" | "gallery">;

export type BlogPost = {
  /** Static fallback slug or the Strapi documentId for CMS-managed posts. */
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  coverImage: string;
  coverAlt: string;
  author: string;
  publishedAt: string;
  /** Closing line shown at the end of the article. */
  ending: string;
  /** When true, the post is shown big/featured on the media page. */
  imp: boolean;
  /** When true, the post is shown on the homepage. */
  showOnHomePage: boolean;
  /** Mirrors Strapi rich-text blocks output. */
  body: { type: "paragraph" | "heading" | "quote"; text: string }[];
};

export type Testimonial = {
  quote: string;
  name: string;
  project: string;
  location: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  bio: string[];
  photo?: string;
  signature?: string;
  quote?: string;
};
