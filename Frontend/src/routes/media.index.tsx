import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { BlogCard } from "@/components/site/BlogCard";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { fetchBlogPosts } from "@/lib/blog";
import { img } from "@/lib/data/images";

export const Route = createFileRoute("/media/")({
  loader: async () => {
    const posts = await fetchBlogPosts();
    return { posts };
  },
  head: () => ({
    meta: [
      { title: "Insights & Updates — Brij Stays Media" },
      {
        name: "description",
        content:
          "Travel guides, temple guides and notes on staying well from the Brij Stays team in Vrindavan.",
      },
      { property: "og:title", content: "Insights & Updates — Brij Stays" },
      {
        property: "og:description",
        content: "Notes on Vrindavan, temple visits and planning a comfortable stay.",
      },
    ],
  }),
  component: MediaPage,
});

function MediaPage() {
  const { posts } = Route.useLoaderData();
  const featured = posts.find((p) => p.imp) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <>
      <PageHero
        eyebrow="Media"
        title={"Insights &\nUpdates"}
        subtitle="Travel notes, temple guides and staying well in Vrindavan — written for guests, not for search engines."
        image={img.interior2}
        imageAlt="Reading corner with soft daylight"
        priority
      />
      <section className="container-luxe py-24 md:py-32">
        {featured ? (
          <div className="mb-20 border-b border-border pb-20">
            <BlogCard post={featured} featured />
          </div>
        ) : null}
        <RevealGroup className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {rest.map((post) => (
            <RevealItem key={post.slug}>
              <BlogCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
