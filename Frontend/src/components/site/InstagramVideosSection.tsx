import { useState } from "react";
import { Play, Instagram } from "lucide-react";

import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { InstagramVideo } from "@/lib/data/types";
import { useSite } from "@/lib/site-context";

/**
 * Homepage Instagram section — CMS-managed reels rendered two per row as
 * compact cards. Each card shows a short cover area with a play button;
 * clicking swaps in the Instagram embed so the video plays in place. Cards
 * are intentionally short (not full 9:16) so the section stays compact, and
 * they keep their shape even when the remote cover image is blocked.
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
  const [covers, setCovers] = useState<Record<string, "loading" | "ok" | "error">>({});
  const instagram = site.socials.find(
    (s) => s.label.toLowerCase() === "instagram" || s.icon.toLowerCase() === "instagram",
  )?.href;

  const coverState = (url: string) => covers[url] ?? "loading";
  const markCover = (url: string, state: "ok" | "error") =>
    setCovers((prev) => (prev[url] === state ? prev : { ...prev, [url]: state }));

  return (
    <section className="container-luxe py-24 md:py-32">
      <SectionHeading eyebrow={eyebrow} title={title} className="mb-14" />

      {videos.length > 0 ? (
        <RevealGroup
          className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:gap-5"
          stagger={0.1}
        >
          {videos.map((video) => {
            const isPlaying = playing[video.url];
            return (
              <RevealItem key={video.url} className="h-full">
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-soft)] transition-shadow hover:shadow-lg">
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
                      className="flex aspect-square w-full cursor-pointer flex-col overflow-hidden bg-secondary text-left"
                      aria-label={`Play reel: ${video.caption || "Brij Stays Instagram video"}`}
                    >
                      <span className="relative flex-1 overflow-hidden">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.caption || "Brij Stays Instagram reel"}
                            width={540}
                            height={540}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => markCover(video.url, "ok")}
                            onError={() => markCover(video.url, "error")}
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:scale-[1.03] ${
                              coverState(video.url) === "ok" ? "opacity-100" : "opacity-0"
                            }`}
                          />
                        ) : null}
                        <span
                          className={`absolute inset-0 grid place-items-center bg-gradient-to-br from-secondary via-secondary to-charcoal/10 transition-opacity duration-300 ${
                            coverState(video.url) === "ok" ? "opacity-0" : "opacity-100"
                          }`}
                          aria-hidden
                        >
                          <Instagram className="h-6 w-6 text-charcoal/50" strokeWidth={1.5} />
                        </span>
                        <span
                          className={`absolute inset-0 bg-charcoal/15 transition-colors duration-300 group-hover:bg-charcoal/5 ${
                            coverState(video.url) === "ok" ? "opacity-100" : "opacity-0"
                          }`}
                          aria-hidden
                        />
                        <span className="absolute inset-0 grid place-items-center" aria-hidden>
                          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/95 text-charcoal shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <Play className="ml-0.5 h-4 w-4 fill-current" />
                          </span>
                        </span>
                      </span>
                      {video.caption ? (
                        <span className="flex items-center gap-2 border-t border-border bg-white px-3 py-2.5 text-sm leading-snug font-medium text-charcoal">
                          <Instagram className="h-3.5 w-3.5 shrink-0 text-charcoal/50" strokeWidth={1.8} />
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
