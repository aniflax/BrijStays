import { useState } from "react";
import { Play, Instagram } from "lucide-react";

import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { InstagramVideo } from "@/lib/data/types";
import { useSite } from "@/lib/site-context";

/**
 * Homepage Instagram section — CMS-managed reels rendered two per row.
 * Each card shows a clean cover image with a play button; clicking swaps in
 * the Instagram embed so the video plays in place. Cards stay compact.
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
  const [playing, setPlaying] = useState<Record<string, boolean>>({});
  const instagram = site.socials.find(
    (s) => s.label.toLowerCase() === "instagram" || s.icon.toLowerCase() === "instagram",
  )?.href;

  return (
    <section className="container-luxe py-24 md:py-32">
      <SectionHeading eyebrow={eyebrow} title={title} className="mb-14" />

      {videos.length > 0 ? (
        <RevealGroup
          className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
          stagger={0.1}
        >
          {videos.map((video) => {
            const isPlaying = playing[video.url];
            return (
              <RevealItem key={video.url} className="h-full">
                <div className="group overflow-hidden rounded-2xl border border-border bg-secondary/40 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-lg">
                  {isPlaying ? (
                    <div className="relative aspect-[9/16] w-full">
                      <iframe
                        src={video.embedUrl}
                        title={video.caption || "Brij Stays Instagram reel"}
                        className="absolute inset-0 h-full w-full"
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlaying((prev) => ({ ...prev, [video.url]: true }))}
                      className="relative block aspect-[9/16] w-full cursor-pointer overflow-hidden bg-secondary"
                      aria-label={`Play reel: ${video.caption || "Brij Stays Instagram video"}`}
                    >
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.caption || "Brij Stays Instagram reel"}
                          width={540}
                          height={960}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : null}
                      <span className="absolute inset-0 bg-charcoal/20 transition-colors duration-300 group-hover:bg-charcoal/10" />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-charcoal shadow-lg transition-transform duration-300 group-hover:scale-110">
                          <Play className="ml-0.5 h-5 w-5 fill-current" />
                        </span>
                      </span>
                      {video.caption ? (
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent px-4 pt-10 pb-3 text-left text-sm font-medium text-white">
                          {video.caption}
                        </span>
                      ) : null}
                    </button>
                  )}
                </div>
              </RevealItem>
            );
          })}
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
