import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { waNumberFromHref } from "@/lib/site";
import { useSite } from "@/lib/site-context";
import { cn } from "@/lib/utils";

const enquiryTypes = [
  "Stay Booking",
  "Corporate / Bulk Booking",
  "Long-term Stay",
  "Group Booking",
  "Other",
];

const fieldClass =
  "h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand focus:ring-1 focus:ring-brand";

const OPTIONAL = " (optional)";

export function EnquiryForm({
  tone = "dark",
  interestedIn,
  showSubject = false,
  showMessage = false,
  submitLabel = "Chat on WhatsApp",
  className,
}: {
  tone?: "dark" | "light";
  interestedIn?: string;
  showSubject?: boolean;
  showMessage?: boolean;
  submitLabel?: string;
  className?: string;
}) {
  const site = useSite();
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    enquiringAs: enquiryTypes[0] as string,
    subject: "",
    message: "",
  });

  const light = tone === "light";
  const border = light ? "border-cream/25" : "border-border";
  const whatsappNumber = waNumberFromHref(site.whatsapp);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!whatsappNumber) return;
    const lines: string[] = [];

    if (values.message.trim()) {
      lines.push(values.message.trim());
    } else {
      lines.push(
        `Hi Brij Stays, I would like to enquire about ${interestedIn || "a stay in Vrindavan"}.`,
      );
      if (values.enquiringAs) lines.push(`Type of enquiry: ${values.enquiringAs}`);
    }

    if (values.name.trim()) lines.push(`Name: ${values.name.trim()}`);
    if (values.phone.trim()) lines.push(`Phone: ${values.phone.trim()}`);
    if (values.email.trim()) lines.push(`Email: ${values.email.trim()}`);
    if (values.subject.trim()) lines.push(`Subject: ${values.subject.trim()}`);

    const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-6", className)} noValidate>
      {interestedIn ? (
        <p className={cn("eyebrow", light && "text-gold")}>Interested in: {interestedIn}</p>
      ) : null}

      <Field label={`Name${OPTIONAL}`} light={light}>
        <input
          className={cn(fieldClass, border)}
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          placeholder="Your full name"
          autoComplete="name"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={`Phone${OPTIONAL}`} light={light}>
          <input
            className={cn(fieldClass, border)}
            value={values.phone}
            onChange={(e) => setValues({ ...values, phone: e.target.value })}
            placeholder="+91"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>
        <Field label={`Email${OPTIONAL}`} light={light}>
          <input
            className={cn(fieldClass, border)}
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {showSubject ? (
          <Field label={`Subject${OPTIONAL}`} light={light}>
            <input
              className={cn(fieldClass, border)}
              value={values.subject}
              onChange={(e) => setValues({ ...values, subject: e.target.value })}
              placeholder="What is this about?"
            />
          </Field>
        ) : null}

        <Field label={`I am enquiring about${OPTIONAL}`} light={light}>
          <select
            className={cn(fieldClass, border, "cursor-pointer appearance-none")}
            value={values.enquiringAs}
            onChange={(e) => setValues({ ...values, enquiringAs: e.target.value })}
          >
            {enquiryTypes.map((t) => (
              <option key={t} value={t} className="text-foreground">
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {showMessage ? (
        <Field label={`Message${OPTIONAL}`} light={light}>
          <textarea
            rows={4}
            className={cn(
              "w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand focus:ring-1 focus:ring-brand",
              border,
            )}
            value={values.message}
            onChange={(e) => setValues({ ...values, message: e.target.value })}
            placeholder="Tell us what you are looking for"
          />
        </Field>
      ) : null}

      <Button
        type="submit"
        variant="whatsapp"
        size="luxe"
        className={cn("w-full text-white sm:w-fit", light && "bg-[#25D366] hover:bg-[#1ebe5b]")}
      >
        <MessageCircle className="h-4 w-4" />
        {submitLabel}
      </Button>

      <p
        className={cn(
          "flex items-start gap-1.5 text-xs leading-relaxed",
          light ? "text-cream/65" : "text-muted-foreground",
        )}
      >
        <span>*</span>
        <span>
          All fields are optional — you can also just say hello. By continuing you agree to our{" "}
          <Link to="/privacy-policy" className="underline hover:text-gold">
            Privacy Policy
          </Link>
          .
        </span>
      </p>
    </form>
  );
}

function Field({
  label,
  light,
  children,
}: {
  label: string;
  light: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className={cn(
          "mb-1 block text-[0.64rem] tracking-[0.2em] uppercase",
          light ? "text-cream/50" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
