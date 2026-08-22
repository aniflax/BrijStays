import directorPhoto from "@/assets/director.jpg";
import { collection, type StrapiEntity, type TeamMember } from "./types";

export const teamMemberEntities: StrapiEntity<TeamMember>[] = [
  {
    id: 1,
    attributes: {
      name: "Keshav Aggarwal",
      role: "Founder",
      initials: "KA",
      signature: "Keshav Aggarwal",
      photo: directorPhoto,
      quote:
        "A home is not sold in an afternoon — it is chosen over months, and lived in for decades.",
      bio: [
        "Keshav founded Brij Stays with a simple conviction: build fewer homes, build them honestly, and build for the family who will live in them fifteen years from now.",
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
        "Vineet co-founded Brij Stays to bring the same disciplined attention to specification and care to every resident relationship we enter.",
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
  (m) => m.role === "Founder" || m.role === "Co-founder",
);
