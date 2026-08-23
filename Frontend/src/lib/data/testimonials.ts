import { collection, type StrapiEntity, type Testimonial } from "./types";
import { stayList } from "./stays";

// Testimonials are built from verified Airbnb aggregate ratings only — no
// fabricated review text, counts or badges. Each entry states the stay's
// verified rating and review count on Airbnb.
export const testimonialEntities: StrapiEntity<Testimonial>[] = stayList.map((stay, index) => ({
  id: index + 1,
  attributes: {
    quote: `Rated ${stay.rating.toFixed(2).replace(/\.?0+$/, "")} out of 5 by ${stay.ratingCount} verified guest${stay.ratingCount === 1 ? "" : "s"} on Airbnb.`,
    name: "Verified Airbnb Guests",
    project: stay.name,
    location: "Airbnb",
  },
}));

export const testimonials = collection(testimonialEntities);
export const testimonialList = testimonialEntities.map((e) => e.attributes);
