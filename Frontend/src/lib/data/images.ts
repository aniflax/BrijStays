// Central image registry. When switching to Strapi, replace these local imports
// with absolute media URLs returned by the CMS.
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import projectElysian from "@/assets/project-elysian.jpg";
import projectPalms from "@/assets/project-palms.jpg";
import projectSilverwood from "@/assets/project-silverwood.jpg";
import projectMeridian from "@/assets/project-meridian.jpg";
import destMahabaleshwar from "@/assets/dest-mahabaleshwar.jpg";
import destOmkareshwar from "@/assets/dest-omkareshwar.jpg";
import destPachmarhi from "@/assets/dest-pachmarhi.jpg";
import destFarmland from "@/assets/dest-farmland.jpg";
import interior1 from "@/assets/interior-1.jpg";
import interior2 from "@/assets/interior-2.jpg";
import interior3 from "@/assets/interior-3.jpg";
import interior4 from "@/assets/interior-4.jpg";
import bannerDark from "@/assets/banner-dark.jpg";
import foundersHero from "@/assets/founders-hero.jpg";

// Airbnb stay photography — one folder per property under src/assets/stays/.
import nestHero from "@/assets/stays/nest-in-the-forest/hero.webp";
import nest01 from "@/assets/stays/nest-in-the-forest/01.webp";
import nest02 from "@/assets/stays/nest-in-the-forest/02.webp";
import nest03 from "@/assets/stays/nest-in-the-forest/03.webp";
import nest04 from "@/assets/stays/nest-in-the-forest/04.webp";
import nest05 from "@/assets/stays/nest-in-the-forest/05.webp";
import redVelvetHero from "@/assets/stays/red-velvet-studio/hero.webp";
import redVelvet01 from "@/assets/stays/red-velvet-studio/01.webp";
import redVelvet02 from "@/assets/stays/red-velvet-studio/02.webp";
import redVelvet03 from "@/assets/stays/red-velvet-studio/03.webp";
import redVelvet04 from "@/assets/stays/red-velvet-studio/04.webp";
import redVelvet05 from "@/assets/stays/red-velvet-studio/05.webp";
import shyamRangHero from "@/assets/stays/shyam-rang-palace/hero.webp";
import shyamRang01 from "@/assets/stays/shyam-rang-palace/01.webp";
import shyamRang02 from "@/assets/stays/shyam-rang-palace/02.webp";
import shyamRang03 from "@/assets/stays/shyam-rang-palace/03.webp";
import shyamRang04 from "@/assets/stays/shyam-rang-palace/04.webp";
import shyamRang05 from "@/assets/stays/shyam-rang-palace/05.webp";
import anandVanHero from "@/assets/stays/anand-van/hero.webp";
import anandVan01 from "@/assets/stays/anand-van/01.webp";
import anandVan02 from "@/assets/stays/anand-van/02.webp";
import anandVan03 from "@/assets/stays/anand-van/03.webp";
import anandVan04 from "@/assets/stays/anand-van/04.webp";
import anandVan05 from "@/assets/stays/anand-van/05.webp";
import pichwaiHero from "@/assets/stays/all-things-pichwai/hero.webp";
import pichwai01 from "@/assets/stays/all-things-pichwai/01.webp";
import pichwai02 from "@/assets/stays/all-things-pichwai/02.webp";
import pichwai03 from "@/assets/stays/all-things-pichwai/03.webp";
import pichwai04 from "@/assets/stays/all-things-pichwai/04.webp";
import pichwai05 from "@/assets/stays/all-things-pichwai/05.webp";
import shantivanHero from "@/assets/stays/artistic-haven-shantivan/hero.webp";
import shantivan01 from "@/assets/stays/artistic-haven-shantivan/01.webp";
import shantivan02 from "@/assets/stays/artistic-haven-shantivan/02.webp";
import shantivan03 from "@/assets/stays/artistic-haven-shantivan/03.webp";
import shantivan04 from "@/assets/stays/artistic-haven-shantivan/04.webp";
import shantivan05 from "@/assets/stays/artistic-haven-shantivan/05.webp";
import royalHero from "@/assets/stays/royal-indian-odyssey/hero.webp";
import royal01 from "@/assets/stays/royal-indian-odyssey/01.webp";
import royal02 from "@/assets/stays/royal-indian-odyssey/02.webp";
import royal03 from "@/assets/stays/royal-indian-odyssey/03.webp";
import royal04 from "@/assets/stays/royal-indian-odyssey/04.webp";
import royal05 from "@/assets/stays/royal-indian-odyssey/05.webp";
import yogaCafeHero from "@/assets/stays/yoga-cafe/hero.webp";
import yogaCafe01 from "@/assets/stays/yoga-cafe/01.webp";
import yogaCafe02 from "@/assets/stays/yoga-cafe/02.webp";
import yogaCafe03 from "@/assets/stays/yoga-cafe/03.webp";
import yogaCafe04 from "@/assets/stays/yoga-cafe/04.webp";
import yogaCafe05 from "@/assets/stays/yoga-cafe/05.webp";

export const img = {
  hero1,
  hero2,
  hero3,
  projectElysian,
  projectPalms,
  projectSilverwood,
  projectMeridian,
  destMahabaleshwar,
  destOmkareshwar,
  destPachmarhi,
  destFarmland,
  interior1,
  interior2,
  interior3,
  interior4,
  bannerDark,
  foundersHero,
};

/** Per-property Airbnb photography, grouped by stay slug. */
export const stayImages: Record<
  string,
  { hero: string; heroAlt: string; gallery: { src: string; alt: string }[] }
> = {
  "nest-in-the-forest": {
    hero: nestHero,
    heroAlt: "Nest in the Forest — cozy boutique stay bedroom in Vrindavan",
    gallery: [
      { src: nest01, alt: "Nest in the Forest bedroom with warm wood tones" },
      { src: nest02, alt: "Nest in the Forest living area" },
      { src: nest03, alt: "Nest in the Forest stay interior detail" },
      { src: nest04, alt: "Nest in the Forest bathroom" },
      { src: nest05, alt: "Nest in the Forest — boutique stay in Vrindavan" },
    ],
  },
  "red-velvet-studio": {
    hero: redVelvetHero,
    heroAlt: "Red Velvet Studio — modern studio next to ISKCON Vrindavan",
    gallery: [
      { src: redVelvet01, alt: "Red Velvet Studio bedroom with bold striped wall" },
      { src: redVelvet02, alt: "Red Velvet Studio seating area" },
      { src: redVelvet03, alt: "Red Velvet Studio interior" },
      { src: redVelvet04, alt: "Red Velvet Studio kitchenette" },
      { src: redVelvet05, alt: "Red Velvet Studio — boutique studio in Vrindavan" },
    ],
  },
  "shyam-rang-palace": {
    hero: shyamRangHero,
    heroAlt: "Shyam Rang Palace — hand-painted heritage apartment in Vrindavan",
    gallery: [
      { src: shyamRang01, alt: "Shyam Rang Palace hand-painted wall" },
      { src: shyamRang02, alt: "Shyam Rang Palace interior with Jaipur pots" },
      { src: shyamRang03, alt: "Shyam Rang Palace living space" },
      { src: shyamRang04, alt: "Shyam Rang Palace decorative detail" },
      { src: shyamRang05, alt: "Shyam Rang Palace — boutique stay near ISKCON" },
    ],
  },
  "anand-van": {
    hero: anandVanHero,
    heroAlt: "Anand-Van — clay-styled 1BHK with sunrise and sunset balconies in Vrindavan",
    gallery: [
      { src: anandVan01, alt: "Anand-Van balcony with sunrise view" },
      { src: anandVan02, alt: "Anand-Van living space" },
      { src: anandVan03, alt: "Anand-Van kitchen" },
      { src: anandVan04, alt: "Anand-Van bedroom" },
      { src: anandVan05, alt: "Anand-Van — chic 1BHK apartment in Vrindavan" },
    ],
  },
  "all-things-pichwai": {
    hero: pichwaiHero,
    heroAlt: "All things Pichwai — Pichwai art studio with balcony in Vrindavan",
    gallery: [
      { src: pichwai01, alt: "All things Pichwai art-filled interior" },
      { src: pichwai02, alt: "All things Pichwai studio seating" },
      { src: pichwai03, alt: "All things Pichwai sit-out balcony" },
      { src: pichwai04, alt: "All things Pichwai bedroom" },
      { src: pichwai05, alt: "All things Pichwai — arthouse stay in Vrindavan" },
    ],
  },
  "artistic-haven-shantivan": {
    hero: shantivanHero,
    heroAlt: "Artistic Haven: ShantiVan Retreat — designer suite with skyline views in Vrindavan",
    gallery: [
      { src: shantivan01, alt: "Artistic Haven ShantiVan living area" },
      { src: shantivan02, alt: "Artistic Haven ShantiVan balcony" },
      { src: shantivan03, alt: "Artistic Haven ShantiVan bedroom" },
      { src: shantivan04, alt: "Artistic Haven ShantiVan kitchen" },
      { src: shantivan05, alt: "Artistic Haven ShantiVan — retreat by the temples" },
    ],
  },
  "royal-indian-odyssey": {
    hero: royalHero,
    heroAlt: "The Royal Indian Odyssey — majestic luxury suite in Vrindavan",
    gallery: [
      { src: royal01, alt: "Royal Indian Odyssey luxury bedroom" },
      { src: royal02, alt: "Royal Indian Odyssey heritage-inspired interior" },
      { src: royal03, alt: "Royal Indian Odyssey living space" },
      { src: royal04, alt: "Royal Indian Odyssey designer detail" },
      { src: royal05, alt: "The Royal Indian Odyssey — luxury suite in Vrindavan" },
    ],
  },
  "yoga-cafe": {
    hero: yogaCafeHero,
    heroAlt: "The Yoga Cafe — wellness stay in Vrindavan",
    gallery: [
      { src: yogaCafe01, alt: "The Yoga Cafe calm living space" },
      { src: yogaCafe02, alt: "The Yoga Cafe balcony view" },
      { src: yogaCafe03, alt: "The Yoga Cafe bedroom" },
      { src: yogaCafe04, alt: "The Yoga Cafe kitchenette" },
      { src: yogaCafe05, alt: "The Yoga Cafe — wellness stay in Vrindavan" },
    ],
  },
};

export const galleryStrip = [
  { src: interior2, alt: "Bedroom with linen bedding and morning light" },
  { src: interior1, alt: "Oak and stone kitchen with brass fittings" },
  { src: hero2, alt: "Living room in warm neutral tones" },
  { src: interior4, alt: "Stone basin in a minimal bathroom" },
  { src: interior3, alt: "Travertine and oak material detail" },
  { src: hero3, alt: "Aerial view of a landscaped residential community" },
  { src: projectSilverwood, alt: "Duplex villa exterior at dusk" },
];
