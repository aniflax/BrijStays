import { Star } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

/** Official 4-color Google "G" glyph used in Google review badges. */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.09 3.59-5.17 3.59-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.86-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.87 8.87 4.76 12 4.76Z"
      />
    </svg>
  );
}

export function GoogleReviews() {
  return (
    <section className="bg-secondary/60 py-14 md:py-20">
      <div className="container-luxe">
        <Reveal className="flex flex-col items-center justify-center gap-6 text-center">
          <a
            href="https://share.google/Oc6HnxPKgkkqaelOT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-3 sm:flex-row sm:gap-5"
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-border bg-white shadow-[var(--shadow-soft)]">
              <GoogleIcon className="h-7 w-7" />
            </span>
            <span className="flex flex-col items-center sm:items-start">
              <span className="flex items-center gap-2">
                <span className="font-display text-4xl leading-none tracking-tight text-foreground">
                  5.0
                </span>
                <span className="flex gap-0.5 text-[#FBBC04]">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-5 w-5 fill-current" strokeWidth={0} />
                  ))}
                </span>
              </span>
              <span className="mt-2 text-sm text-muted-foreground">28 reviews on Google</span>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
