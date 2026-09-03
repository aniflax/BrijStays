// Static fallback FAQ entries for the homepage FAQ section. When Strapi is
// unreachable or returns no entries, these keep the section populated. The
// same content is seeded into the Strapi FAQ collection so edits flow from CMS.

import type { Faq } from "./types";

export const faqList: Faq[] = [
  {
    question: "Where exactly is Brij Stays located?",
    answer:
      "Our stays are in Vrindavan, Mathura district — a short walk or drive from ISKCON Vrindavan, Prem Mandir and Banke Bihari Temple. The exact address of each stay is shared on its listing page and confirmed over WhatsApp when you book.",
  },
  {
    question: "How do I check availability and book a stay?",
    answer:
      "Availability and rates are confirmed directly on WhatsApp — there is no online booking engine, so you always speak with a real host. Send us your dates, the number of guests and your stay type, and we will reply with availability, pricing and booking details.",
  },
  {
    question: "Is there a minimum stay duration?",
    answer:
      "No. You can book a single night, a weekend darshan trip, or a long-term stay of weeks or months. Daily, weekly and monthly rates are available — message us on WhatsApp and we will share the best rate for your dates.",
  },
  {
    question: "Do the rooms have Wi-Fi and modern amenities?",
    answer:
      "Yes. Every stay includes high-speed Wi-Fi, hygienic fully furnished rooms, modern interiors and thoughtful daily essentials. Housekeeping is provided, and hosts are available around the clock for local guidance.",
  },
  {
    question: "Are the stays verified and how are they rated?",
    answer:
      "Each Brij Stays property is listed and verified on Airbnb with real guest ratings and review counts, which you can see on every stay listing. We host personally and keep the same standard of care across all our properties.",
  },
  {
    question: "Can you help with temple visits and local guidance?",
    answer:
      "Absolutely. Our hosts are local to Vrindavan and happy to help with temple timings, darshan schedules, getting around, and recommendations for meals and shopping — just ask on WhatsApp during your stay.",
  },
];
