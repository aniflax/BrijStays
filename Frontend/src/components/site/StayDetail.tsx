import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, MapPin, ShieldCheck, Sparkles, Star, Wifi, X } from "lucide-react";
import { PageHero } from "./PageHero";
import { SectionHeading } from "./SectionHeading";
import { MapCard } from "./MapCard";
import { WhatsAppInquiry } from "./WhatsAppInquiry";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import type { Stay } from "@/lib/data/types";

const usps = [
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

export function StayDetail({ stay }: { stay: Stay }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const specs = [...stay.specs, { label: "Location", value: stay.location }];

  return (
    <>
      <PageHero
        eyebrow={`${stay.category} · ${stay.location}`}
        title={stay.name}
        subtitle={stay.shortDescription}
        image={stay.heroImage}
        imageAlt={stay.heroAlt}
        size="tall"
        priority
      />

      <section className="container-luxe py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-5">Overview</p>
              <div className="flex flex-col gap-5 text-[0.98rem] leading-relaxed text-muted-foreground">
                {stay.description.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
                  <Star className="h-4 w-4 fill-brand text-brand" />
                  <span className="font-medium text-foreground">
                    {stay.rating.toFixed(2).replace(/\.?0+$/, "")}
                  </span>
                  <span className="text-muted-foreground">
                    · {stay.ratingCount} verified Airbnb review{stay.ratingCount === 1 ? "" : "s"}
                  </span>
                </span>
              </div>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-5" delay={0.15}>
            <dl className="border-t border-border">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between gap-6 border-b border-border py-5"
                >
                  <dt className="text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
                    {s.label}
                  </dt>
                  <dd className="text-right text-sm">{s.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppInquiry title={stay.name} className="flex-1" />
              <Button asChild variant="luxeOutline" size="luxe" className="flex-1">
                <a
                  href={stay.airbnbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${stay.name} on Airbnb`}
                >
                  View on Airbnb <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Pricing and live availability are confirmed on WhatsApp or the Airbnb listing.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe pb-24 md:pb-32">
        <SectionHeading eyebrow="Gallery" title="Inside the stay" className="mb-14" />
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {stay.gallery.map((image, i) => (
            <RevealItem key={image.alt} className={i % 5 === 0 ? "sm:col-span-2" : ""}>
              <button
                type="button"
                onClick={() => setLightbox(i)}
                className="group block w-full cursor-pointer overflow-hidden bg-secondary"
                aria-label={`Open image: ${image.alt}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="img-zoom aspect-[4/3] w-full object-cover"
                />
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <AnimatePresence>
        {lightbox !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-charcoal/95 p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label="Close gallery"
              className="absolute top-6 right-6 cursor-pointer text-cream/70 hover:text-cream"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={stay.gallery[lightbox]?.src}
              alt={stay.gallery[lightbox]?.alt ?? ""}
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section className="container-luxe pb-24 md:pb-32">
        <SectionHeading
          eyebrow="Why Stay With Us"
          title="The Brij Stays standard"
          className="mb-14"
        />
        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {usps.map((usp) => (
            <RevealItem key={usp.title} className="h-full">
              <div className="card-soft flex h-full flex-col gap-3 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-brand">
                  <usp.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-1 font-serif text-lg text-foreground">{usp.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{usp.caption}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="bg-secondary/60 py-24 md:py-32">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Highlights"
            title="What makes this stay special"
            className="mb-14"
          />
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {stay.highlights.map((highlight) => (
              <RevealItem key={highlight} className="h-full">
                <div className="card-soft flex h-full items-start gap-3 p-6">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                    <Check className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <p className="text-sm leading-relaxed font-medium text-foreground">{highlight}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-16 grid gap-6 rounded-3xl border border-border bg-white p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="eyebrow mb-4">Amenities</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {stay.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Have questions about availability, pricing or a longer stay? Message us directly on
                WhatsApp and we will take care of the rest.
              </p>
              <WhatsAppInquiry title={stay.name} />
            </div>
          </div>
        </div>
      </section>

      <section className="container-luxe py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-5">Location</p>
            <h2 className="font-display text-3xl">Stays in the heart of Vrindavan</h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              {stay.name} sits within easy reach of ISKCON Vrindavan, Prem Mandir and Banke Bihari
              Temple. Get directions below or message us for local guidance.
            </p>
            <WhatsAppInquiry
              title={stay.name}
              label="Get directions on WhatsApp"
              className="mt-8"
            />
          </Reveal>
          <Reveal delay={0.15}>
            <MapCard query={stay.mapQuery} tone="light" height={300} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
