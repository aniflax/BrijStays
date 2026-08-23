import { collection, type StrapiEntity, type Testimonial } from "./types";

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
  {
    id: 2,
    attributes: {
      quote:
        "We visited eleven projects before this one. Elysian was the only place where the plan felt written for how we actually live.",
      name: "Aparna & Rohit Deshmukh",
      project: "Elysian — Vijay Nagar",
      location: "Indore",
    },
  },
  {
    id: 3,
    attributes: {
      quote:
        "The finishes still look new three monsoons later. You can feel where the money went — into the things you touch every day.",
      name: "Meher Qureshi",
      project: "Silverwood — Bicholi Mardana",
      location: "Indore",
    },
  },
  {
    id: 4,
    attributes: {
      quote:
        "I bought from Dubai without a single site visit. Weekly photographs, honest answers, no surprises at possession.",
      name: "Vikram Nair",
      project: "Meridian Heights — Super Corridor",
      location: "NRI buyer, Dubai",
    },
  },
  {
    id: 5,
    attributes: {
      quote:
        "What sold us was the courtyard. Our daughter has a place to run, and we know every family around it.",
      name: "Preeti Jain",
      project: "The Palms — Rau",
      location: "Indore",
    },
  },
];

export const testimonials = collection(testimonialEntities);
export const testimonialList = testimonialEntities.map((e) => e.attributes);
