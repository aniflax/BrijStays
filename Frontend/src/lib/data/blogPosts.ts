import { collection, type BlogPost, type StrapiEntity } from "./types";
import { img, stayImages } from "./images";

export const blogPostEntities: StrapiEntity<BlogPost>[] = [
  {
    id: 1,
    attributes: {
      slug: "2-day-spiritual-itinerary-vrindavan",
      title: "The Ultimate 2-Day Spiritual Itinerary for Vrindavan",
      excerpt:
        "Mangala Aarti at ISKCON, Banke Bihari by early afternoon, and the light show at Prem Mandir to close the day — a calm two-day rhythm for your retreat.",
      category: "Guides",
      publishedAt: "2026-08-10",
      readingTime: "5 min read",
      coverImage: stayImages["nest-in-the-forest"]?.hero ?? img.hero2,
      coverAlt: "Boutique stay near ISKCON in Vrindavan",
      author: "Brij Stays",
      body: [
        {
          type: "paragraph",
          text: "Visiting Vrindavan for a weekend retreat? Start your morning with the serene Mangala Aarti at ISKCON Temple. Proceed to Banke Bihari Temple by early afternoon, and wrap up with the breathtaking light show at Prem Mandir in the evening. Between temple visits, indulge in authentic Mathura pedas near Nidhivan and enjoy a peaceful evening back at your boutique stay.",
        },
        { type: "heading", text: "Day one — ISKCON to Prem Mandir" },
        {
          type: "paragraph",
          text: "Begin early with the Mangala Aarti at ISKCON Vrindavan. The temple is at its quietest and most atmospheric before sunrise. From there, the morning is ideal for the quieter lanes and ghats around Nidhivan, where you will find the local sweet shops that make the town famous.",
        },
        {
          type: "paragraph",
          text: "In the evening, make your way to Prem Mandir. The light-and-water show after sunset is one of the most memorable sights in Vrindavan, and the gardens around the temple are worth arriving early for.",
        },
        { type: "heading", text: "Day two — Banke Bihari and the town" },
        {
          type: "paragraph",
          text: "Head to Banke Bihari Temple by early afternoon to avoid the longest queues. The darshan windows are limited and the temple closes during the afternoon, so plan around the opening hours posted at the entrance.",
        },
        {
          type: "paragraph",
          text: "Spend the rest of the day at your own pace — a long lunch at a pure-vegetarian restaurant, some shopping in the bazaars, and an early night before your journey home.",
        },
        {
          type: "quote",
          text: "The best itineraries leave room for the unexpected — a chai stop, a longer darshan, a conversation with a fellow traveller.",
        },
      ],
    },
  },
  {
    id: 2,
    attributes: {
      slug: "temples-near-your-stay-vrindavan",
      title: "The Temples Near Your Stay: ISKCON, Prem Mandir & Banke Bihari",
      excerpt:
        "Most of our stays sit minutes from Vrindavan's three great temples — here is what to expect at each one.",
      category: "Temple Guides",
      publishedAt: "2026-08-03",
      readingTime: "4 min read",
      coverImage: img.hero1,
      coverAlt: "Temple town of Vrindavan at dusk",
      author: "Brij Stays",
      body: [
        {
          type: "paragraph",
          text: "Vrindavan's spiritual life revolves around a handful of temples, and nearly every Brij Stays property is within walking distance or a short drive of the main three.",
        },
        { type: "heading", text: "ISKCON Vrindavan (Krishna-Balarama Mandir)" },
        {
          type: "paragraph",
          text: "ISKCON's Vrindavan temple is famous for its Mangala Aarti before sunrise, its peaceful gardens, and the samadhi of A.C. Bhaktivedanta Swami Prabhupada. Guest houses and restaurants on site make it a natural anchor for your day.",
        },
        { type: "heading", text: "Prem Mandir" },
        {
          type: "paragraph",
          text: "Built in white marble, Prem Mandir is best known for the evening light-and-water show on the life of Lord Krishna. The complex is immaculately maintained and wheelchair-friendly in parts — confirm entry timings at the gate.",
        },
        { type: "heading", text: "Banke Bihari Temple" },
        {
          type: "paragraph",
          text: "One of the most venerated shrines in Vrindavan, Banke Bihari holds a limited number of darshan windows each day and closes in the afternoon. Go early, dress modestly, and expect a lively, devotional crowd.",
        },
        {
          type: "paragraph",
          text: "Ask your host about the day's timings when you check in — aartis and closures change with the season, and we keep current information for our guests.",
        },
      ],
    },
  },
  {
    id: 3,
    attributes: {
      slug: "first-time-vrindavan-what-to-know",
      title: "First Time in Vrindavan? What to Know Before You Visit",
      excerpt:
        "Temple etiquette, getting around, food and the rhythms of the town — practical notes for a smooth first visit.",
      category: "Travel Guides",
      publishedAt: "2026-07-22",
      readingTime: "6 min read",
      coverImage: img.hero3,
      coverAlt: "Vrindavan streets and temple spires",
      author: "Brij Stays",
      body: [
        {
          type: "paragraph",
          text: "Vrindavan is a town that runs on its own clock — temple timings, bazaar hours and the seasons all shape the day. A little preparation makes a first visit genuinely restful.",
        },
        { type: "heading", text: "Getting here" },
        {
          type: "paragraph",
          text: "Mathura Junction is the nearest major railhead, about 30–40 minutes from central Vrindavan by taxi or auto. The Yamuna Expressway connects Vrindavan to the NCR for those driving. Most of our guests arrange a pickup through us.",
        },
        { type: "heading", text: "Temple etiquette" },
        {
          type: "paragraph",
          text: "Dress modestly — shoulders and knees covered — and remove shoes before entering temple courtyards. Photography is restricted inside most sanctums. Mobile phones should be silent or switched off during darshan.",
        },
        { type: "heading", text: "Food and water" },
        {
          type: "paragraph",
          text: "Vrindavan is famously pure-vegetarian, and the temple prasad is part of the experience. Stick to bottled or filtered water, and you will find no shortage of excellent local sweet shops — the Mathura peda is the classic souvenir.",
        },
        { type: "heading", text: "The rhythm of the town" },
        {
          type: "paragraph",
          text: "Streets around the main temples are car-restricted at certain hours for crowd control, so plan to walk the last stretch. Evenings after the aartis are the liveliest time; early mornings are the calmest.",
        },
        {
          type: "quote",
          text: "Come with an open day and a closed itinerary — Vrindavan rewards the unhurried traveller.",
        },
      ],
    },
  },
];

export const blogPosts = collection(blogPostEntities);
export const blogPostList = blogPostEntities.map((e) => e.attributes);

export function getBlogPost(slug: string) {
  return blogPostList.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3) {
  return blogPostList.filter((p) => p.slug !== slug).slice(0, limit);
}
