import { createFileRoute, notFound } from "@tanstack/react-router";

import { StayDetail } from "@/components/site/StayDetail";
import { getStay } from "@/lib/data/stays";

export const Route = createFileRoute("/stays/$slug")({
  loader: ({ params }) => {
    const stay = getStay(params.slug);
    if (!stay) throw notFound();
    return { stay };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Stay not found — Brij Stays" }, { name: "robots", content: "noindex" }],
      };
    }
    const { stay } = loaderData;
    const title = `${stay.name} | Brij Stays — Stays in Vrindavan`;
    const description = stay.shortDescription;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:image", content: stay.heroImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: stay.heroImage },
      ],
      links: [{ rel: "canonical", href: `/stays/${stay.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VacationRental",
            name: stay.name,
            description: stay.shortDescription,
            image: [stay.heroImage, ...stay.gallery.map((g) => g.src)],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Vrindavan",
              addressRegion: "Uttar Pradesh",
              postalCode: "281121",
              addressCountry: "IN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: stay.coords.lat,
              longitude: stay.coords.lng,
            },
            containsPlace: {
              "@type": "Accommodation",
              occupancy: { "@type": "QuantitativeValue", value: stay.guestCapacity },
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: stay.rating,
              reviewCount: stay.ratingCount,
            },
            amenityFeature: stay.amenities.slice(0, 6).map((a) => ({
              "@type": "LocationFeatureSpecification",
              name: a,
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Stays in Vrindavan", item: "/stays" },
              { "@type": "ListItem", position: 3, name: stay.name, item: `/stays/${stay.slug}` },
            ],
          }),
        },
      ],
    };
  },
  component: StayPage,
});

function StayPage() {
  const { stay } = Route.useLoaderData();
  return <StayDetail stay={stay} />;
}
