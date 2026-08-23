// Brij Stays — verified Airbnb property inventory.
// All property facts (names, descriptions, guest capacity, ratings, coordinates)
// were sourced from each live Airbnb listing's public structured data.
import { stayImages } from "./images";
import { collection, type StrapiEntity, type Stay } from "./types";

export const stayEntities: StrapiEntity<Stay>[] = [
  {
    id: 1,
    attributes: {
      slug: "nest-in-the-forest",
      name: "Nest in the Forest — 1 min to ISKCON & Prem Mandir",
      location: "Vrindavan, Uttar Pradesh",
      category: "Boutique Stay",
      building: "Hari Krishna Residency",
      featured: true,
      shortDescription:
        "A unique, family-friendly boutique stay one minute from ISKCON and Prem Mandir, tucked into a quiet, leafy corner of Vrindavan.",
      description: [
        "Nest in the Forest is a unique and family-friendly place set in the heart of Vrindavan, just one minute from ISKCON Temple and Prem Mandir. It is an easy base for temple visits, with the main attractions of the town within a short walk.",
        "The stay is designed to feel calm and personal — comfortable rooms, warm interiors and the kind of attentive hosting that makes a pilgrimage effortless.",
      ],
      highlights: [
        "1 minute from ISKCON Temple",
        "1 minute from Prem Mandir",
        "Family-friendly stay",
        "Central Vrindavan location",
      ],
      roomType: "Private room",
      guestCapacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [
        "Prime central location",
        "24/7 guest support",
        "High-speed Wi-Fi",
        "Hygienic, furnished room",
        "Flexible check-in",
        "Local travel guidance",
      ],
      airbnbUrl: "https://www.airbnb.co.in/rooms/1694091085781085697",
      rating: 4.0,
      ratingCount: 1,
      mapQuery: "ISKCON Vrindavan, Uttar Pradesh",
      coords: { lat: 27.57585, lng: 77.69041 },
    },
  },
  {
    id: 2,
    attributes: {
      slug: "red-velvet-studio",
      name: "Red Velvet Studio — next to ISKCON & Prem Mandir",
      location: "Vrindavan, Uttar Pradesh",
      category: "Studio",
      building: "Hari Krishna Residency",
      featured: true,
      shortDescription:
        "A super-central designer studio literally next door to ISKCON, with bold black-and-white walls, plush burgundy styling and a kitchenette.",
      description: [
        "Super central, main Vrindavan. This studio is literally next door to ISKCON, walking steps from Prem Mandir, and five minutes from Banke Bihari.",
        "Experience modern comfort in this elegantly designed studio room featuring bold black-and-white striped wall accents, a plush upholstered bed, stylish burgundy décor, a cozy seating area, and a functional kitchenette. Bright natural light and contemporary interiors create a warm, luxurious, and inviting atmosphere.",
      ],
      highlights: [
        "Next door to ISKCON Temple",
        "Walking steps from Prem Mandir",
        "5 minutes from Banke Bihari",
        "Designer studio with kitchenette",
      ],
      roomType: "Studio",
      guestCapacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [
        "Super-central location",
        "Kitchenette",
        "High-speed Wi-Fi",
        "24/7 guest support",
        "Flexible check-in",
        "Local travel guidance",
      ],
      airbnbUrl: "https://www.airbnb.co.in/rooms/1694085953625668285",
      rating: 5.0,
      ratingCount: 2,
      mapQuery: "ISKCON Vrindavan, Uttar Pradesh",
      coords: { lat: 27.57771, lng: 77.69 },
    },
  },
  {
    id: 3,
    attributes: {
      slug: "shyam-rang-palace",
      name: "Shyam Rang Palace — next to ISKCON & Prem Mandir",
      location: "Vrindavan, Uttar Pradesh",
      category: "Heritage Apartment",
      building: "Hari Krishna Residency",
      featured: true,
      shortDescription:
        "A hand-painted heritage apartment next to ISKCON — Jodhpur colours, Jaipur pots and a tranquil rooftop garden.",
      description: [
        "Take it easy at this unique and tranquil getaway, super central in main Vrindavan — literally next door to ISKCON, walking steps from Prem Mandir, and five minutes from Banke Bihari.",
        "Stay at an unbelievably gorgeous, hand-painted apartment that leaves you breathless with its finesse — from the Jodhpur colours on the walls to the elegant Jaipur pots and pristine flowers across the roof, it makes you forget time.",
      ],
      highlights: [
        "Next door to ISKCON Temple",
        "Walking steps from Prem Mandir",
        "Hand-painted heritage interiors",
        "Tranquil rooftop garden",
      ],
      roomType: "Entire apartment",
      guestCapacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [
        "Super-central location",
        "Rooftop garden",
        "High-speed Wi-Fi",
        "24/7 guest support",
        "Flexible check-in",
        "Local travel guidance",
      ],
      airbnbUrl: "https://www.airbnb.co.in/rooms/1429472757418114108",
      rating: 4.91,
      ratingCount: 32,
      mapQuery: "ISKCON Vrindavan, Uttar Pradesh",
      coords: { lat: 27.57146, lng: 77.67774 },
    },
  },
  {
    id: 4,
    attributes: {
      slug: "anand-van",
      name: "Anand-Van: Cute Clay 1BHK w/ Sunrise & Sunset Balcony",
      location: "Vrindavan, Uttar Pradesh",
      category: "1 BHK Apartment",
      featured: true,
      shortDescription:
        "A terracotta-inspired 1BHK on the 13th floor with two balconies — one for sunrise, one for sunset — plus skyline views across Vrindavan.",
      description: [
        "3 km (10 min) from Prem Mandir, 3.5 km (12 min) from ISKCON and 4 km (15 min) from Banke Bihari.",
        "Experience a chic home on the 13th floor offering terracotta-inspired charm and stunning skyline views, with 24×7 lifts, high-speed internet and snacks. Relax on two balconies — one for sunrise and one for sunset — sip coffee in the cozy living space, or cook in the well-equipped kitchen. With its prime location and stylish comforts, this hideaway promises an unforgettable escape.",
      ],
      highlights: [
        "Sunrise & sunset balconies",
        "13th-floor skyline views",
        "10 min from Prem Mandir",
        "12 min from ISKCON",
      ],
      roomType: "1 BHK apartment",
      guestCapacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [
        "Two balconies",
        "Well-equipped kitchen",
        "24×7 lifts",
        "High-speed Wi-Fi",
        "Skyline views",
        "24/7 guest support",
      ],
      airbnbUrl: "https://www.airbnb.co.in/rooms/1142535842156771470",
      rating: 4.98,
      ratingCount: 43,
      mapQuery: "Prem Mandir, Vrindavan, Uttar Pradesh",
      coords: { lat: 27.56357, lng: 77.65873 },
    },
  },
  {
    id: 5,
    attributes: {
      slug: "all-things-pichwai",
      name: "All things Pichwai — Arthouse with stunning balcony",
      location: "Vrindavan, Uttar Pradesh",
      category: "Arthouse Studio",
      featured: true,
      shortDescription:
        "A Pichwai-themed studio with elegant fittings, art-filled interiors and a charming sit-out balcony, minutes from the prime temples.",
      description: [
        "Peaceful, pretty and artsy. Less than 3 km (10 min) from Prem Mandir, 3.5 km (12 min) from ISKCON and 4.5 km (15 min) from Banke Bihari.",
        "Step into a world of art and tranquility at this Pichwai-themed studio. Beautiful elegant fittings, stunning interiors, and a charming sit-out balcony perfect for relaxation. Enjoy easy access to prime temples, immersing yourself in the spiritual essence of Vrindavan, with an abundance of modern amenities for a comfortable and memorable stay.",
      ],
      highlights: [
        "Pichwai art interiors",
        "Sit-out balcony",
        "10 min from Prem Mandir",
        "12 min from ISKCON",
      ],
      roomType: "Studio",
      guestCapacity: 3,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [
        "Art-filled interiors",
        "Sit-out balcony",
        "High-speed Wi-Fi",
        "Modern amenities",
        "24/7 guest support",
        "Flexible check-in",
      ],
      airbnbUrl: "https://www.airbnb.co.in/rooms/1205714535489622168",
      rating: 4.97,
      ratingCount: 98,
      mapQuery: "Prem Mandir, Vrindavan, Uttar Pradesh",
      coords: { lat: 27.57375, lng: 77.65487 },
    },
  },
  {
    id: 6,
    attributes: {
      slug: "artistic-haven-shantivan",
      name: "Artistic Haven: ShantiVan Retreat by Prime Temples",
      location: "Vrindavan, Uttar Pradesh",
      category: "Designer Suite",
      featured: true,
      shortDescription:
        "Urban luxury on the 15th floor — a stylish retreat with skyline vistas, two balconies and sparkling-clean corners by the prime temples.",
      description: [
        "3 km (10 min) from Prem Mandir, 3.5 km (12 min) from ISKCON and 4 km (15 min) from Banke Bihari.",
        "Experience urban luxury in Vrindavan. This stylish retreat on the 15th floor boasts great aesthetics, sparkling-clean corners and breathtaking skyline vistas, with 24×7 lifts, high-speed internet and well-stocked supplies. Relax on two balconies, enjoy coffee in the cozy living area, or whip up a meal in the well-appointed kitchen. Retreat to the comfort of the bedroom or take long showers — welcome home.",
      ],
      highlights: [
        "15th-floor skyline vistas",
        "Two balconies",
        "10 min from Prem Mandir",
        "12 min from ISKCON",
      ],
      roomType: "Entire apartment",
      guestCapacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [
        "Two balconies",
        "Well-appointed kitchen",
        "24×7 lifts",
        "High-speed Wi-Fi",
        "Skyline views",
        "24/7 guest support",
      ],
      airbnbUrl: "https://www.airbnb.co.in/rooms/1142555542700079169",
      rating: 4.99,
      ratingCount: 76,
      mapQuery: "Prem Mandir, Vrindavan, Uttar Pradesh",
      coords: { lat: 27.56312, lng: 77.66011 },
    },
  },
  {
    id: 7,
    attributes: {
      slug: "royal-indian-odyssey",
      name: "The Royal Indian Odyssey — Majestic Luxury Suite",
      location: "Vrindavan, Uttar Pradesh",
      category: "Luxury Suite",
      featured: true,
      shortDescription:
        "Vrindavan's stunning luxury suite — tasteful colours, Rajasthan-inspired décor and a box-style bed on the 11th floor with breathtaking views.",
      description: [
        "Vrindavan's stunning luxurious suite — tasteful colours, corners and more. Prime location: Prem Mandir 3 km (10 min), ISKCON Temple 3.5 km (12 min), Banke Bihari Temple 4 km (15 min).",
        "Why stay here: a luxurious box-style bed for ultimate comfort, interiors inspired by Rajasthan's folklore and vibrant culture, 24×7 lifts, high-speed Wi-Fi and fully stocked amenities. Discover a unique blend of urban luxury and Indian heritage in this 11th-floor designer suite with breathtaking views. Welcome home.",
      ],
      highlights: [
        "Rajasthan-inspired design",
        "Luxurious box-style bed",
        "10 min from Prem Mandir",
        "12 min from ISKCON",
      ],
      roomType: "Luxury suite",
      guestCapacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [
        "Designer suite",
        "Fully stocked amenities",
        "24×7 lifts",
        "High-speed Wi-Fi",
        "Skyline views",
        "24/7 guest support",
      ],
      airbnbUrl: "https://www.airbnb.co.in/rooms/1350462335119442515",
      rating: 4.88,
      ratingCount: 40,
      mapQuery: "Prem Mandir, Vrindavan, Uttar Pradesh",
      coords: { lat: 27.56152, lng: 77.65564 },
    },
  },
  {
    id: 8,
    attributes: {
      slug: "yoga-cafe",
      name: "The Yoga Cafe — wellness stay",
      location: "Vrindavan, Uttar Pradesh",
      category: "Wellness Stay",
      featured: true,
      shortDescription:
        "A stylish 10th-floor wellness stay with terracotta charm, skyline views, 24×7 lifts and high-speed internet — fun for the whole family.",
      description: [
        "Have fun with the whole family at this stylish place. 3 km (10 min) from Prem Mandir, 3.5 km (12 min) from ISKCON and 4 km (15 min) from Banke Bihari.",
        "Experience a chic home on the 10th floor offering terracotta-inspired charm and stunning skyline views, with 24×7 lifts, high-speed internet and snacks. With its prime location and stylish comforts, this hideaway promises an unforgettable escape.",
      ],
      highlights: [
        "10th-floor skyline views",
        "Wellness-focused stay",
        "10 min from Prem Mandir",
        "12 min from ISKCON",
      ],
      roomType: "Entire apartment",
      guestCapacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [
        "High-speed Wi-Fi",
        "24×7 lifts",
        "Skyline views",
        "Family-friendly",
        "24/7 guest support",
        "Flexible check-in",
      ],
      airbnbUrl: "https://www.airbnb.co.in/rooms/1337256608803515268",
      rating: 4.89,
      ratingCount: 19,
      mapQuery: "Prem Mandir, Vrindavan, Uttar Pradesh",
      coords: { lat: 27.56591, lng: 77.66043 },
    },
  },
];

// Assign verified photography from the per-property asset folders.
for (const entity of stayEntities) {
  const images = stayImages[entity.attributes.slug];
  if (images) {
    entity.attributes.heroImage = images.hero;
    entity.attributes.heroAlt = images.heroAlt;
    entity.attributes.gallery = images.gallery;
  }
}

export const stays = collection(stayEntities);
export const stayList = stayEntities.map((e) => e.attributes);

export function getStay(slug: string) {
  return stayList.find((s) => s.slug === slug);
}
