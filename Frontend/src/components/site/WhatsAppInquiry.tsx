import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildStayWhatsAppHref, waNumberFromHref, type WhatsAppExtras } from "@/lib/site";
import { useSite } from "@/lib/site-context";
import { cn } from "@/lib/utils";

/**
 * Reusable WhatsApp inquiry CTA with a pre-filled, property-specific message.
 * Extras (check-in / check-out / guests / requirements) can be passed later
 * without changing the component API.
 */
export function WhatsAppInquiry({
  title,
  label = "Inquire on WhatsApp",
  extras,
  tone = "light",
  className,
}: {
  title: string;
  label?: string;
  extras?: WhatsAppExtras;
  /** "light" renders on white/light sections; "dark" on charcoal sections. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const site = useSite();
  const href = buildStayWhatsAppHref(title, waNumberFromHref(site.whatsapp), extras);
  if (!href) return null;
  return (
    <Button
      asChild
      variant="whatsapp"
      size="luxe"
      className={cn("text-white", tone === "dark" && "bg-[#25D366] hover:bg-[#1ebe5b]", className)}
    >
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} — ${title}`}>
        <MessageCircle className="h-4 w-4" />
        {label}
      </a>
    </Button>
  );
}
