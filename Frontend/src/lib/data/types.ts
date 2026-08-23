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

export type Stay = {
  slug: string;
  name: string;
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
  mapQuery: string;
  coords: { lat: number; lng: number };
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  coverImage: string;
  coverAlt: string;
  author: string;
  /** Mirrors Strapi rich-text blocks output. */
  body: { type: "paragraph" | "heading" | "quote"; text: string }[];
};

export type Testimonial = {
  quote: string;
  name: string;
  project: string;
  location: string;
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
