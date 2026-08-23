import directorPhoto from "@/assets/director.jpg";
import { collection, type StrapiEntity, type TeamMember } from "./types";

export const teamMemberEntities: StrapiEntity<TeamMember>[] = [
  {
    id: 1,
    attributes: {
      name: "Keshav Aggarwal",
      role: "Founder & Host",
      initials: "KA",
      signature: "Keshav Aggarwal",
      photo: directorPhoto,
      quote:
        "A home is not sold in an afternoon — it is chosen over months, and lived in for decades.",
      bio: [
        "Keshav Aggarwal is a Chartered Accountant turned hospitality entrepreneur and community leader. Based in Delhi, India, Keshav serves as an official member of the Airbnb Host Advisory Board (2023) and a Global Community Leader at Airbnb. Combining analytical rigor — honed through his background in finance and former role as Managing Partner at Arora Aggarwal and Associates — with a deep passion for guest experiences, he brings world-class standards to boutique hospitality.",
        "After marrying in Vrindavan in 2020, Keshav felt a strong personal calling to the spiritual region of Brij. Inspired by a meeting with Airbnb founder Brian Chesky in 2024, he founded Brij Stays to bridge warm, personal home-sharing with modern, high-quality stays. Today, he focuses on curating exceptional, comfortable, and thoughtful stay experiences for devotees, travelers, and global guests visiting Vrindavan.",
      ],
    },
  },
  {
    id: 2,
    attributes: {
      name: "Vineet Singhal",
      role: "Co-founder",
      initials: "VS",
      signature: "Vineet Singhal",
      photo: directorPhoto,
      quote: "Good details are quiet — you notice them in how a home feels, not in what it claims.",
      bio: [
        "Growing up in a traditional and hardworking family business environment in Delhi, Vineet Singhal learned the true meaning of perseverance, grounded values, and genuine hospitality long before stepping into the corporate world. Coming from a humble and deeply rooted family background, he was taught early on that true business success is built on trust, respect, and serving people with a warm heart.",
        "As a Chartered Accountant and an entrepreneur by upbringing, Vineet brings this profound sense of care and community into Brij Stays. His upbringing taught him that a space is never just about physical walls — it is about creating an environment where people feel welcomed, valued, and entirely at home.",
        "By blending his sharp financial acumen with a deeply ingrained passion for hosting and comforting guests, Vineet ensures that Brij Stays stays true to its core philosophy: providing authentic, warm, and memorable hospitality rooted in humility and care.",
      ],
    },
  },
  {
    id: 3,
    attributes: {
      name: "Ira Saxena",
      role: "Head of Design",
      initials: "IS",
      bio: [
        "Ira leads planning and interior specification across every Brij Stays residence, with a focus on daylight, cross-ventilation and materials that age gracefully in Central Indian weather.",
      ],
    },
  },
  {
    id: 4,
    attributes: {
      name: "Devang Rao",
      role: "Head of Construction",
      initials: "DR",
      bio: [
        "Devang runs site delivery and quality control, and has handed over more than nine hundred homes across Madhya Pradesh over two decades.",
      ],
    },
  },
  {
    id: 5,
    attributes: {
      name: "Naina Kulkarni",
      role: "Customer Relations",
      initials: "NK",
      bio: [
        "Naina looks after buyers from first site visit through registration, documentation and possession.",
      ],
    },
  },
];

export const teamMembers = collection(teamMemberEntities);
export const teamMemberList = teamMemberEntities.map((e) => e.attributes);
export const director = teamMemberList[0]!;
export const leadership = teamMemberList.filter(
  (m) => m.role.startsWith("Founder") || m.role === "Co-founder",
);
