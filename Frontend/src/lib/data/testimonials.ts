import { collection, type StrapiEntity, type Testimonial } from "./types";
import { stayList } from "./stays";

// Testimonials start with a genuine guest review, followed by the verified
// Airbnb aggregate ratings for each stay — real counts and badges only, no
// fabricated text. Each rating entry states the stay's verified rating and
// review count on Airbnb.
export const testimonialEntities: StrapiEntity<Testimonial>[] = [
  {
    id: 1,
    attributes: {
      quote:
        "Staying at Brij Stays' Hari Krishna Residency made our family pilgrimage effortless! Being literally steps away from ISKCON saved us so much time and travel hassle. The room was sparkling clean, modern, and comfortable. Having direct WhatsApp contact with the host for quick local guidance was the cherry on top!",
      name: "R. Sharma",
      project: "Hari Krishna Residency",
      location: "Verified Airbnb Guest",
    },
  },
  ...stayList.map((stay, index) => ({
    id: index + 2,
    attributes: {
      quote: `Rated ${stay.rating.toFixed(2).replace(/\.?0+$/, "")} out of 5 by ${stay.ratingCount} verified guest${stay.ratingCount === 1 ? "" : "s"} on Airbnb.`,
      name: "Verified Airbnb Guests",
      project: stay.name,
      location: "Airbnb",
    },
  })),
];

export const testimonials = collection(testimonialEntities);
export const testimonialList = testimonialEntities.map((e) => e.attributes);
