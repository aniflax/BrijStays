import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Stay } from "@/lib/data/types";
import { buildStayWhatsAppHref, waNumberFromHref } from "@/lib/site";
import { useSite } from "@/lib/site-context";
import { cn } from "@/lib/utils";

export function StayCard({
  stay,
  showWhatsApp = true,
  compact = false,
  className,
}: {
  stay: Stay;
  /** Hide the WhatsApp button — used on the homepage where the detail page already has it. */
  showWhatsApp?: boolean;
  /** Compact sizing so two cards fit per row on phones (homepage featured grid). */
  compact?: boolean;
  className?: string;
}) {
  const site = useSite();
  const whatsappHref = buildStayWhatsAppHref(stay.name, waNumberFromHref(site.whatsapp));

  // Card chips come from the stay's spec rows (editable in Strapi). Common
  // labels are matched case-insensitively; anything else in specs is skipped
  // so chips stay short.
  const chipSpecs = stay.specs.filter((spec) => /guests?|bed|bath|ac|room/i.test(spec.label));
  const chips =
    chipSpecs.length > 0
      ? chipSpecs.map((spec) => `${spec.value} ${spec.label.toLowerCase()}`)
      : stay.specs.slice(0, 3).map((spec) => spec.value);

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-border bg-white transition-shadow duration-500 hover:shadow-xl",
        compact ? "p-2 md:p-3" : "p-3 md:p-6",
        className,
      )}
    >
      <Link
        to="/stays/$slug"
        params={{ slug: stay.slug }}
        className="block overflow-hidden rounded-xl bg-secondary"
        aria-label={`${stay.name}, ${stay.location}`}
      >
        <img
          src={stay.heroImage}
          alt={stay.heroAlt}
          width={1600}
          height={1200}
          loading="lazy"
          decoding="async"
          className={cn("img-zoom w-full object-cover", compact ? "aspect-[3/4]" : "aspect-[4/5]")}
        />
      </Link>

      <div className={cn("flex flex-1 flex-col", compact ? "pt-3 md:pt-4" : "pt-5")}>
        <p
          className={cn(
            "uppercase tracking-[0.2em] text-brand",
            compact ? "text-[0.6rem] md:text-xs" : "text-xs",
          )}
        >
          {stay.category} · {stay.location}
        </p>
        <h3
          className={cn(
            "mt-2 font-serif leading-tight",
            compact ? "text-base md:text-lg" : "text-2xl",
          )}
        >
          <Link
            to="/stays/$slug"
            params={{ slug: stay.slug }}
            className="transition-colors hover:text-brand"
          >
            {stay.shortName}
          </Link>
        </h3>
        <ul className={cn("flex flex-wrap gap-2", compact ? "mt-3 hidden sm:flex" : "mt-4")}>
          {chips.map((value) => (
            <li
              key={value}
              className={cn(
                "rounded-full border border-border tracking-[0.12em] text-muted-foreground uppercase",
                compact ? "px-2.5 py-1 text-[0.6rem]" : "px-3 py-1.5 text-[0.68rem]",
              )}
            >
              {value}
            </li>
          ))}
        </ul>

        <div
          className={cn(
            "mt-6 flex flex-wrap gap-2",
            compact && "mt-auto gap-1.5 pt-3 md:mt-6 md:gap-2",
          )}
        >
          <Button
            asChild
            variant="luxeOutline"
            size="luxeSm"
            className={cn(
              "flex-1 min-w-[110px]",
              compact && "h-8 min-w-0 px-2 text-xs md:h-10 md:min-w-[110px] md:px-4 md:text-sm",
            )}
          >
            <Link to="/stays/$slug" params={{ slug: stay.slug }}>
              View Stay
            </Link>
          </Button>
          {showWhatsApp && whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Inquire about ${stay.name} on WhatsApp`}
              className={cn(
                "inline-flex flex-1 min-w-[110px] cursor-pointer items-center justify-center gap-2 rounded-full border border-foreground/20 px-4 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:text-brand",
                compact
                  ? "h-8 min-w-0 gap-1 px-2 text-xs md:h-10 md:min-w-[110px] md:gap-2 md:px-4 md:text-sm"
                  : "h-10",
              )}
            >
              <WhatsAppGlyph className="h-3.5 w-3.5 md:h-4 md:w-4" />
              WhatsApp
            </a>
          ) : null}
          <a
            href={stay.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${stay.name} on Airbnb`}
            className={cn(
              "inline-flex flex-1 min-w-[100px] cursor-pointer items-center justify-center gap-1.5 rounded-full border border-foreground/20 px-4 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:text-brand",
              compact
                ? "h-8 min-w-0 px-2 text-xs md:h-10 md:min-w-[100px] md:px-4 md:text-sm"
                : "h-10",
            )}
          >
            Airbnb <ArrowUpRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.02 0C5.4 0 .02 5.38.02 12a11.9 11.9 0 0 0 1.64 6.02L0 24l6.16-1.61A11.94 11.94 0 0 0 12.02 24C18.63 24 24 18.63 24 12c0-3.2-1.25-6.21-3.48-8.52ZM12.02 21.9a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.66.96.98-3.56-.24-.37A9.9 9.9 0 1 1 12.02 21.9Zm5.44-7.42c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.34.22-.64.07a8.16 8.16 0 0 1-2.4-1.48 9.1 9.1 0 0 1-1.68-2.09c-.17-.3-.02-.46.13-.61.14-.14.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.11 3.22 5.11 4.51.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.18-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}
