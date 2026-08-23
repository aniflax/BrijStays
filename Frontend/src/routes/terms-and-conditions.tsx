import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Brij Stays" },
      {
        name: "description",
        content:
          "Terms governing the use of the Brij Stays website and the material published on it.",
      },
      { property: "og:title", content: "Terms & Conditions — Brij Stays" },
      { property: "og:description", content: "Website terms, disclaimers and content ownership." },
    ],
  }),
  component: () => (
    <LegalPage
      title="Terms & Conditions"
      updated="1 February 2026"
      sections={[
        {
          id: "use-of-site",
          heading: "Use of this site",
          paragraphs: [
            "By using this website you agree to these terms. The site is provided for information about Brij Stays accommodation in Vrindavan, Uttar Pradesh, and is not an offer or a contract.",
          ],
        },
        {
          id: "stay-information",
          heading: "Stay information and imagery",
          paragraphs: [
            "Property descriptions, photographs, amenities and specifications are indicative and drawn from our published listings. Photography is representative of the actual stay.",
            "Nothing on this site should be relied upon in place of the confirmation we share directly with you for a booking.",
          ],
        },
        {
          id: "intellectual-property",
          heading: "Intellectual property",
          paragraphs: [
            "All text, imagery, layouts and marks on this site belong to Brij Stays and may not be reproduced without written permission.",
          ],
        },
        {
          id: "governing-law",
          heading: "Governing law",
          paragraphs: [
            "These terms are governed by the laws of India, and disputes are subject to the exclusive jurisdiction of the courts at Mathura, Uttar Pradesh.",
          ],
        },
      ]}
    />
  ),
});
