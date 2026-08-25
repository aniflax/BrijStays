import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BedDouble, MapPin, MessageCircle, ShieldCheck, Sparkles, Wifi } from "lucide-react";

import { Hero } from "@/components/site/Hero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StatRow } from "@/components/site/StatCounter";
import { GalleryMarquee } from "@/components/site/GalleryMarquee";
import { StayCard } from "@/components/site/StayCard";
import { BlogCard } from "@/components/site/BlogCard";
import { TestimonialsCarousel } from "@/components/site/TestimonialsCarousel";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { WhatsAppInquiry } from "@/components/site/WhatsAppInquiry";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { stayList } from "@/lib/data/stays";
import { testimonialList } from "@/lib/data/testimonials";
import { fetchBlogPosts } from "@/lib/blog";
import { galleryStrip, img, stayImages } from "@/lib/data/images";

export const Route = createFileRoute("/")({
  loader: async () => {
    const posts = await fetchBlogPosts();
    const homePosts = posts.filter((p) => p.showOnHomePage).slice(0, 3);
    return { homePosts };
  },
  head: () => ({
    meta: [
      { title: "Brij Stays — Premium Stays in Vrindavan" },
      {
        name: "description",
        content:
          "Curated boutique stays in Vrindavan near ISKCON, Prem Mandir and Banke Bihari. Premium, comfortable and warmly hosted — inquire on WhatsApp.",
      },
      { property: "og:title", content: "Brij Stays — Premium Stays in Vrindavan" },
      {
        property: "og:description",
        content:
          "Premium, comfortable and curated boutique stays in Vrindavan, Uttar Pradesh — near ISKCON, Prem Mandir and Banke Bihari.",
      },
    ],
  }),
  component: Home,
});

const stats = [
  { value: 8, suffix: "", label: "Curated Stays", caption: "Boutique stays across Vrindavan." },
  { value: 311, suffix: "+", label: "Guest Reviews", caption: "Verified ratings on Airbnb." },
  {
    value: 24,
    suffix: "/7",
    label: "Guest Support",
    caption: "Front desk and host care, always on.",
  },
];

const features = [
  {
    title: "Warm",
    body: "Every stay is hosted personally — from check-in to local guidance on temple timings, darshan and getting around Vrindavan.",
  },
  {
    title: "Comfortable",
    body: "Hygienic, fully furnished rooms with high-speed Wi-Fi, modern interiors and thoughtful daily essentials.",
  },
  {
    title: "Transparent",
    body: "Clear pricing and flexible check-in. Availability and rates are confirmed directly on WhatsApp — no hidden charges.",
  },
];

const services = [
  {
    icon: BedDouble,
    title: "Executive Stay Suites & Rooms",
    caption: "Premium rooms and suites for a comfortable, restful stay.",
  },
  {
    icon: MapPin,
    title: "Vacation Rentals & Homestays",
    caption: "Curated homes that feel personal, minutes from the temples.",
  },
  {
    icon: ShieldCheck,
    title: "Long-term Serviced Apartments",
    caption: "Daily, weekly and monthly stays with housekeeping and support.",
  },
  {
    icon: MessageCircle,
    title: "Corporate Lodging Solutions",
    caption: "Reliable accommodation and bulk booking packages for teams.",
  },
];

const uspTags = [
  {
    icon: MapPin,
    title: "Prime Locations",
    caption: "Close to ISKCON, Prem Mandir and Banke Bihari.",
  },
  {
    icon: Wifi,
    title: "High-Speed Wi-Fi",
    caption: "Fast, reliable internet in every stay.",
  },
  {
    icon: ShieldCheck,
    title: "24/7 Guest Support",
    caption: "Front desk and host assistance around the clock.",
  },
  {
    icon: Sparkles,
    title: "Transparent Pricing",
    caption: "Clear rates, confirmed directly on WhatsApp.",
  },
];

function Home() {
  const { homePosts } = Route.useLoaderData();
  const featuredStay = stayList[0]!;
  const templeImage = stayImages[featuredStay.slug]?.hero ?? img.hero2;

  return (
    <>
      <Hero />

      {/* More Than a Stay */}
      <section className="container-luxe py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <p className="mb-4 text-xs uppercase tracking-[0.28em] text-brand">More Than a Stay</p>
            <h2 className="hidden font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl md:block">
              A stay in Vrindavan should feel like coming home
            </h2>
            <p className="mt-6 hidden text-base leading-relaxed text-muted-foreground md:block">
              We host in the spiritual region of Brij because we believe warm, personal
              accommodation is part of the experience itself. Every Brij Stays property is curated,
              cleaned and cared for — so you can focus on your darshan, your retreat or simply time
              with family.
            </p>
            <p className="mt-4 hidden text-base leading-relaxed text-muted-foreground md:block">
              From studios next to ISKCON to heritage apartments and skyline suites, each stay is
              verified on Airbnb and hosted with the same standard of care.
            </p>
            <Button asChild variant="luxeOutline" size="luxe" className="mt-9">
              <Link to="/about">About Brij Stays</Link>
            </Button>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.15}>
            <div className="relative">
              <img
                src={img.hero2}
                alt="Warm boutique stay interior with tall windows"
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full rounded-[2rem] object-cover"
              />
              <div className="animate-floaty absolute -top-6 -left-6 hidden h-24 w-24 rounded-full border border-brand/30 md:block" />
              <div className="animate-floaty absolute -right-4 -bottom-8 hidden h-32 w-32 rounded-3xl border border-brand/20 bg-white/40 backdrop-blur-sm md:block" />
              <div className="absolute -bottom-6 left-6 hidden max-w-[230px] rounded-2xl border border-border bg-white/90 p-4 shadow-lg backdrop-blur md:block">
                <div className="text-xs tracking-widest text-brand uppercase">Rated on Airbnb</div>
                <div className="mt-1 font-serif text-2xl text-foreground">4.9 / 5</div>
                <div className="text-xs text-muted-foreground">across 311 guest reviews</div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-20">
          <StatRow stats={stats} />
        </Reveal>
      </section>

      <section className="pb-24 md:pb-32">
        <GalleryMarquee images={galleryStrip} />
      </section>

      {/* Featured stays */}
      <section className="py-24 md:py-32">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Find Your Stay"
            title="Featured stays in Vrindavan"
            action={
              <Button asChild variant="luxeOutline" size="luxeSm">
                <Link to="/stays">All stays</Link>
              </Button>
            }
            className="mb-14"
          />
        </div>
        <div className="container-luxe">
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {stayList.map((stay) => (
              <StayCard key={stay.slug} stay={stay} showWhatsApp={false} />
            ))}
          </div>
        </div>
      </section>

      {/* Vrindavan & the temples */}
      <section className="bg-secondary/60 py-24 md:py-32">
        <div className="container-luxe grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <img
              src={templeImage}
              alt={featuredStay.heroAlt}
              width={1600}
              height={1200}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-[2rem] object-cover"
            />
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mb-4 text-xs uppercase tracking-[0.28em] text-brand">
              Vrindavan &amp; the Temples
            </p>
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
              Stay close to the spiritual heart of Brij
            </h2>
            <p className="mt-6 hidden text-[0.98rem] leading-relaxed text-muted-foreground md:block">
              Our stays are within a short walk or drive of ISKCON Vrindavan, Prem Mandir and Banke
              Bihari Temple. Wake up for the Mangala Aarti, return for the evening light show, and
              spend the hours between at your ease.
            </p>
            <RevealGroup className="mt-10 flex flex-col gap-6" stagger={0.1}>
              {uspTags.map((tag) => (
                <RevealItem
                  key={tag.title}
                  className="flex items-start gap-4 border-t border-border pt-5"
                >
                  <tag.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} />
                  <div>
                    <p className="text-sm tracking-[0.06em]">{tag.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{tag.caption}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="container-luxe py-24 md:py-32">
        <SectionHeading
          eyebrow="Services"
          title="Hospitality that fits your journey"
          intro="From a weekend darshan to a month-long stay, we host every kind of guest — travelers, devotees, families and professionals."
          className="mb-14"
        />
        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {services.map((s) => (
            <RevealItem key={s.title} className="h-full">
              <div className="card-soft flex h-full flex-col gap-3 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-brand">
                  <s.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-1 font-serif text-lg text-foreground">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.caption}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* The Brij Stays standard */}
      <section className="container-luxe pb-24 md:pb-32">
        <SectionHeading
          eyebrow="The Brij Stays Standard"
          title={"Hospitality the way\nyou always imagined"}
          className="mb-14"
        />
        <div className="grid gap-14 lg:grid-cols-12">
          <RevealGroup className="flex flex-col gap-10 lg:col-span-6" stagger={0.12}>
            {features.map((f) => (
              <RevealItem key={f.title} className="border-t border-border pt-6">
                <h3 className="font-display text-2xl">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <RevealGroup className="grid grid-cols-2 gap-4 lg:col-span-6" stagger={0.1}>
            {[img.interior1, img.interior2, img.interior3, img.interior4].map((src, i) => (
              <RevealItem key={src} className={i % 3 === 0 ? "mt-8" : ""}>
                <img
                  src={src}
                  alt="Interior finish sample"
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Verified guest ratings */}
      <section className="bg-secondary/60 py-24 md:py-32">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Guest Reviews"
            title="Verified ratings from Airbnb guests"
            className="mb-14"
          />
          <TestimonialsCarousel items={testimonialList} />
        </div>
      </section>

      {/* Insights */}
      <section className="container-luxe py-24 md:py-32">
        <SectionHeading
          eyebrow="Insights & Updates"
          title="Notes from Vrindavan"
          action={
            <Button asChild variant="luxeOutline" size="luxeSm">
              <Link to="/media">All articles</Link>
            </Button>
          }
          className="mb-14"
        />
        <RevealGroup className="grid gap-x-4 gap-y-10 md:grid-cols-3" stagger={0.12}>
          {homePosts.map((post) => (
            <RevealItem key={post.slug}>
              <BlogCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Lead capture */}
      <section id="enquire" className="bg-secondary/60 py-24 md:py-32">
        <div className="container-luxe grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="mb-4 text-xs uppercase tracking-[0.28em] text-brand">Plan Your Stay</p>
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
              Ready to plan your stay in Vrindavan?
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
              Leave your details and we will call you back within one working day. For faster
              confirmation, message us on WhatsApp.
            </p>
            <WhatsAppInquiry
              title="a stay in Vrindavan"
              label="Chat on WhatsApp"
              className="mt-8"
            />
          </div>
          <div className="rounded-3xl border border-border bg-white p-8 shadow-[var(--shadow-soft)] lg:col-span-7 lg:p-10">
            <EnquiryForm source="home" />
          </div>
        </div>
      </section>
    </>
  );
}
