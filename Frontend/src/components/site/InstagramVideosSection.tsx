import { Instagram } from "lucide-react";

import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { InstagramVideo } from "@/lib/data/types";
import { useSite } from "@/lib/site-context";

/**
 * Homepage Instagram section — CMS-managed reels/videos rendered two per row.
 * Each entry is embedded via the standard Instagram iframe embed URL.
 */
export function InstagramVideosSection({
  videos,
  eyebrow = "Instagram",
  title = "Moments from our stays",
}: {
  videos: InstagramVideo[];
  eyebrow?: string;
  title?: string;
}) {
  const site = useSite();
  const instagram = site.socials.find(
    (s) => s.label.toLowerCase() === "instagram" || s.icon.toLowerCase() === "instagram",
  )?.href;

  return (
    <section className="container-luxe py-24 md:py-32">
      <SectionHeading eyebrow={eyebrow} title={title} className="mb-14" />

      {videos.length > 0 ? (
        <RevealGroup className="grid gap-6 sm:grid-cols-2" stagger={0.1}>
          {videos.map((video) => (
            <RevealItem key={video.url} className="h-full">
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-soft)]">
                <div className="relative mx-auto aspect-[9/16] w-full max-w-[340px]">
                  <iframe
                    src={video.embedUrl}
                    title={video.caption || "Brij Stays Instagram video"}
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                {video.caption ? (
                  <p className="border-t border-border px-5 py-3 text-center text-sm text-muted-foreground">
                    {video.caption}
                  </p>
                ) : null}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-12 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand">
            <Instagram className="h-6 w-6" strokeWidth={1.6} />
          </span>
          <h3 className="mt-5 font-serif text-2xl text-foreground">Videos are on their way</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            We are adding short reels from our stays. Until then, follow along on Instagram for
            daily moments from Vrindavan.
          </p>
          {instagram ? (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              <Instagram className="h-4 w-4" strokeWidth={2} />
              Follow us on Instagram
            </a>
          ) : null}
        </div>
      )}
    </section>
  );
}
