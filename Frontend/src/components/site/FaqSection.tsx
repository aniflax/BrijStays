import { SectionHeading } from "./SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Faq } from "@/lib/data/types";

/**
 * Homepage FAQ section — questions and answers managed from Strapi, rendered
 * as an accordion just above the footer. Falls back to the bundled FAQs until
 * CMS content is published.
 */
export function FaqSection({
  faqs,
  eyebrow = "FAQ",
  title = "Frequently asked questions",
}: {
  faqs: Faq[];
  eyebrow?: string;
  title?: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <section className="container-luxe py-24 md:py-32">
      <SectionHeading eyebrow={eyebrow} title={title} className="mb-14" />

      <Reveal className="mx-auto max-w-3xl">
        <RevealGroup className="overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-soft)]">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <RevealItem
                key={faq.question}
                {...(index > 0 ? { className: "border-t border-border" } : {})}
              >
                <AccordionItem value={faq.question} className="border-b-0">
                  <AccordionTrigger className="px-6 py-5 font-serif text-lg text-foreground hover:no-underline hover:text-brand md:text-xl">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 text-base leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </RevealItem>
            ))}
          </Accordion>
        </RevealGroup>
      </Reveal>
    </section>
  );
}
