import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { StayGrid } from "@/components/site/StayGrid";
import { CtaBanner } from "@/components/site/CtaBanner";
import { stayList } from "@/lib/data/stays";
import { img } from "@/lib/data/images";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/stays/")({
  head: () => ({
    meta: [
      { title: "Stays in Vrindavan — Boutique Stays near ISKCON & Prem Mandir | Brij Stays" },
      {
        name: "description",
        content:
          "Browse 8 curated boutique stays in Vrindavan — from studios next to ISKCON to heritage apartments and luxury suites near Prem Mandir. Inquire on WhatsApp.",
      },
      { property: "og:title", content: "Stays in Vrindavan — Brij Stays" },
      {
        property: "og:description",
        content:
          "Premium, comfortable and curated boutique stays in Vrindavan, near ISKCON, Prem Mandir and Banke Bihari.",
      },
    ],
  }),
  component: StaysPage,
});

function StaysPage() {
  const site = useSite();
  const instagram = site.socials.find((s) => s.icon === "Instagram")?.href;
  return (
    <>
      <PageHero
        eyebrow="Stays in Vrindavan"
        title={"Curated stays in the\nheart of Brij"}
        subtitle="Eight boutique stays within easy reach of ISKCON, Prem Mandir and Banke Bihari — each one hosted with care."
        image={img.hero1}
        imageAlt="Boutique stay in Vrindavan"
        priority
      />

      <section className="container-luxe py-24 md:py-32">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow mb-4">The Collection</p>
          <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
            Eight stays, one standard of hospitality
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Every stay below is verified on Airbnb with real guest reviews. For availability and
            pricing, message us on WhatsApp — we confirm quickly, usually the same day.
          </p>
        </div>
        <StayGrid stays={stayList} columns={4} />
      </section>

      <section className="pb-24 md:pb-32">
        <CtaBanner
          eyebrow="Plan Your Stay"
          title="Not sure which stay fits your trip?"
          intro="Tell us your dates and group size — we will recommend a stay and share availability and pricing on WhatsApp."
          image={img.interior2}
          imageAlt="Comfortable stay interior in warm tones"
          ctaLabel="Message Us"
          ctaTo="/contact"
        />
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-x text-center">
          <p className="text-sm text-muted-foreground">
            Follow daily life at our stays on{" "}
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-foreground hover:text-brand"
            >
              Instagram
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
