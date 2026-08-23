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
        "A stay is not measured in nights — it is measured in how welcome a guest feels the moment they arrive.",
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
      quote:
        "Good hospitality is quiet — you feel it in how cared-for you are, not in what is claimed.",
      bio: [
        "Growing up in a traditional and hardworking family business environment in Delhi, Vineet Singhal learned the true meaning of perseverance, grounded values, and genuine hospitality long before stepping into the corporate world. Coming from a humble and deeply rooted family background, he was taught early on that true business success is built on trust, respect, and serving people with a warm heart.",
        "As a Chartered Accountant and an entrepreneur by upbringing, Vineet brings this profound sense of care and community into Brij Stays. His upbringing taught him that a space is never just about physical walls — it is about creating an environment where people feel welcomed, valued, and entirely at home.",
        "By blending his sharp financial acumen with a deeply ingrained passion for hosting and comforting guests, Vineet ensures that Brij Stays stays true to its core philosophy: providing authentic, warm, and memorable hospitality rooted in humility and care.",
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
