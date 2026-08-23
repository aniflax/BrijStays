import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Quote } from "lucide-react";

import { img } from "@/lib/data/images";
import { leadership } from "@/lib/data/teamMembers";

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
              Two founders. One standard of thoughtful living.
            </p>
          </div>
        </div>
      </section>

      {/* Founders — two centered columns */}
      <section className="bg-background py-24 md:py-32">
        <div className="container-x mx-auto max-w-6xl">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-24">
            {leadership.map((member) => (
              <div key={member.name} className="relative text-center lg:text-left">
                <div className="overflow-hidden rounded-t-[2rem] bg-secondary">
                  {member.photo ? (
                    <img
                      src={member.photo}
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
                      <Quote className="mx-auto h-8 w-8 text-brand lg:mx-0" />
                      <p className="mt-3 font-serif text-xl italic leading-snug text-foreground/85 md:text-2xl">
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
            ))}
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section className="bg-muted py-24 text-center md:py-28">
        <div className="container-x mx-auto max-w-3xl">
          <Leaf className="mx-auto h-8 w-8 text-brand" />
          <p className="mx-auto mt-8 max-w-2xl font-display text-2xl leading-snug text-foreground md:text-3xl">
            We don&rsquo;t just build spaces. We build trust, relationships and places people are
            proud to call home.
          </p>
        </div>
      </section>
    </>
  );
}
