import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CtaBanner } from "@/components/site/CtaBanner";
import { img, stayImages } from "@/lib/data/images";
import { director } from "@/lib/data/teamMembers";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Brij Stays — Boutique Stays in Vrindavan" },
      {
        name: "description",
        content:
          "Our vision, mission and standard: how Brij Stays curates premium, comfortable and warm boutique stays in Vrindavan, Uttar Pradesh.",
      },
      { property: "og:title", content: "About Brij Stays" },
      {
        property: "og:description",
        content: "Premium, comfortable and curated boutique stays in Vrindavan.",
      },
    ],
  }),
  component: AboutPage,
});

const checklist = [
  "Premium stays verified on Airbnb with real guest reviews",
  "Prime central locations close to ISKCON, Prem Mandir and Banke Bihari",
  "24/7 guest support and concierge-style local guidance",
  "Transparent pricing and flexible check-in, confirmed on WhatsApp",
];

function AboutPage() {
  const site = useSite();
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={"Hospitality rooted in\nthe heart of Brij"}
        subtitle="Premium, comfortable and curated stays in Vrindavan — hosted with warmth, integrity and personal care."
        image={stayImages["shyam-rang-palace"]?.hero ?? img.hero3}
        imageAlt="Hand-painted heritage stay interior in Vrindavan"
        priority
      />

      <section className="container-luxe py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <p className="mb-4 text-xs uppercase tracking-[0.28em] text-brand">The Foundation</p>
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
              The foundation of everything we do
            </h2>
            <p className="mt-6 text-[0.98rem] leading-relaxed text-muted-foreground">
              Brij Stays was founded on a simple belief: the place you stay shapes how you
              experience a place. We bring warm, personal home-sharing together with modern,
              high-quality stays — so every guest in Vrindavan feels welcomed, valued and entirely
              at home.
            </p>
          </Reveal>
          <RevealGroup className="flex flex-col gap-5 lg:col-span-6" stagger={0.1}>
            {checklist.map((item) => (
              <RevealItem key={item} className="flex items-start gap-4 border-t border-border pt-5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <p className="text-[0.95rem] leading-relaxed">{item}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-secondary/60 py-24 md:py-32">
        <div className="container-luxe grid gap-14 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-5">Our Mission</p>
            <h3 className="font-display text-2xl leading-snug">
              To deliver consistent high-quality service, exceptional guest experiences and modern
              amenities across all our locations.
            </h3>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
              That means hygienic, fully furnished rooms, dependable support around the clock, and
              the small courtesies that turn a stay into a memory. Every property is curated before
              it is listed and cared for after every checkout.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="eyebrow mb-5">Our Vision</p>
            <h3 className="font-display text-2xl leading-snug">
              To become a trusted name in hospitality — combining comfort, affordability and
              personalized care.
            </h3>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
              We measure ourselves on the guests who return, and on the travellers who arrive
              because someone they trust recommended us. That is the only marketing metric we take
              seriously.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-24 md:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-[1.3] italic">
            “A stay is not measured in nights. It is measured in how welcome a guest feels the
            moment they arrive.”
          </p>
          <p className="mt-8 text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
            {director.name} · {director.role}
          </p>
        </Reveal>
      </section>

      <section className="container-luxe pb-24 md:pb-32">
        <SectionHeading
          eyebrow="Leadership"
          title="A message from our Founders"
          className="mb-14"
        />
        <Reveal className="grid gap-10 border border-border p-8 md:grid-cols-12 md:p-10">
          <div className="md:col-span-3">
            <img
              src={site.founderImage || director.photo}
              alt={`Portrait of ${director.name}`}
              className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
          </div>
          <div className="md:col-span-9">
            <h3 className="font-display text-2xl">{director.name}</h3>
            <p className="mt-1 text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
              {director.role}
            </p>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
              {director.bio[0]}
            </p>
            <Link
              to="/director"
              className="nav-underline mt-6 inline-flex text-[0.7rem] tracking-[0.18em] uppercase hover:text-gold"
            >
              Read the full message
            </Link>
          </div>
        </Reveal>
      </section>

      <CtaBanner
        eyebrow="Plan Your Stay"
        title="Experience Brij Stays for yourself"
        intro="Browse the collection and message us on WhatsApp — we will help you choose the stay that fits your journey."
        image={stayImages["anand-van"]?.hero ?? img.projectSilverwood}
        imageAlt="Chic apartment with a sunrise balcony in Vrindavan"
        ctaLabel="Explore Stays"
        ctaTo="/stays"
      />
    </>
  );
}
