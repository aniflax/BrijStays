import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Leaf } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { img } from "@/lib/data/images";
import { leadership } from "@/lib/data/teamMembers";
import { useSite } from "@/lib/site-context";
import type { TeamMember } from "@/lib/data/types";

export const Route = createFileRoute("/director")({
  head: () => ({
    meta: [
      { title: "Founders & Leadership — Brij Stays" },
      {
        name: "description",
        content:
          "Meet Keshav Aggarwal (Founder & Host) and Vineet Singhal (Co-founder) — the people behind Brij Stays' thoughtful hospitality in Vrindavan.",
      },
      { property: "og:title", content: "Founders & Leadership — Brij Stays" },
      {
        property: "og:description",
        content:
          "Keshav Aggarwal and Vineet Singhal on why Brij Stays builds warm, personal, high-quality stays in the spiritual region of Brij.",
      },
    ],
  }),
  component: DirectorPage,
});

function DirectorPage() {
  const site = useSite();
  return (
    <>
      {/* Hero — image fills the section, text overlaid on a soft fade */}
      <section className="relative overflow-hidden bg-muted">
        <img
          src={img.foundersHero}
          alt="A warm, light-filled interior with a series of arches"
          width={1920}
          height={1080}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
        <div className="container-x relative z-10 flex min-h-[22rem] items-center py-14 md:min-h-[26rem] md:py-20">
          <div className="max-w-xl">
            <p className="eyebrow">Founders &amp; Leadership</p>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-foreground md:text-6xl">
              The people behind
              <br />
              Brij Stays
            </h1>
            <div className="mt-8 h-px w-24 bg-brand" />
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Two founders. One standard of warm, thoughtful hospitality.
            </p>
          </div>
        </div>
      </section>

      {/* Founders — two centered columns */}
      <section className="bg-background py-24 md:py-32">
        <div className="container-x mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="eyebrow">Leadership</p>
            <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
              Meet the founders
            </h2>
          </div>

          {/* Mobile & tablet — compact two-column cards with "Know more" */}
          <div className="grid grid-cols-2 items-start gap-3 sm:gap-6 lg:hidden">
            {leadership.map((member, index) => (
              <FounderCard
                key={member.name}
                member={member}
                photo={index === 0 ? site.founderImage : site.coFounderImage}
              />
            ))}
          </div>

          {/* Desktop — full leadership profiles */}
          <div className="hidden items-start gap-24 lg:grid lg:grid-cols-2">
            {leadership.map((member, index) => {
              const photo = index === 0 ? site.founderImage : site.coFounderImage;
              return (
                <div key={member.name} className="relative text-center lg:text-left">
                  <div className="overflow-hidden rounded-t-[2rem] bg-secondary">
                    {photo ? (
                      <img
                        src={photo}
                        alt={`Portrait of ${member.name}`}
                        width={1008}
                        height={1264}
                        loading="eager"
                        decoding="async"
                        className="aspect-[4/5] w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="mt-10">
                    <h2 className="font-display text-3xl text-foreground md:text-4xl">
                      {member.name}
                    </h2>
                    <p className="mt-2 text-xs uppercase tracking-[0.28em] text-brand">
                      {member.role}
                    </p>

                    {member.quote ? (
                      <div className="mt-8">
                        <p className="font-serif text-xl italic leading-snug text-foreground/85 md:text-2xl">
                          “{member.quote}”
                        </p>
                      </div>
                    ) : null}

                    <div className="mx-auto mt-8 h-px w-24 bg-brand lg:mx-0" />

                    <p className="mt-8 text-[0.95rem] leading-[1.85] text-muted-foreground">
                      {member.bio[0]}
                    </p>
                    {member.bio.slice(1).map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mt-6 text-[0.95rem] leading-[1.85] text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section className="bg-muted py-24 text-center md:py-28">
        <div className="container-x mx-auto max-w-3xl">
          <Leaf className="mx-auto h-8 w-8 text-brand" />
          <p className="mx-auto mt-8 max-w-2xl font-display text-2xl leading-snug text-foreground md:text-3xl">
            We don&rsquo;t just host guests. We build trust, relationships and places people are
            proud to return to.
          </p>
        </div>
      </section>
    </>
  );
}

function FounderCard({ member, photo }: { member: TeamMember; photo?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-white p-3 text-center shadow-[var(--shadow-soft)] sm:p-4">
      {photo ? (
        <img
          src={photo}
          alt={`Portrait of ${member.name}`}
          width={1008}
          height={1264}
          loading="lazy"
          decoding="async"
          className="aspect-square w-full rounded-2xl object-cover"
        />
      ) : null}
      <h3 className="mt-3 font-display text-sm leading-tight text-foreground sm:mt-4 sm:text-base">
        {member.name}
      </h3>
      <p className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] text-brand sm:text-[0.65rem]">
        {member.role}
      </p>
      <Button
        type="button"
        variant="pill"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-3 w-full px-2 text-[0.62rem] uppercase tracking-[0.16em] sm:mt-4 sm:text-xs"
      >
        {open ? "Show less" : "Know more"}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </Button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-border pt-3 text-left sm:mt-4 sm:pt-4">
              {member.bio.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-2.5 text-[0.72rem] leading-relaxed text-muted-foreground first:mt-0 sm:text-[0.85rem]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
