import { CollectionCard } from "@/components/site/collection-card";
import { getCollections } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  description: "Browse curated photography collections arranged as small visual essays.",
  pathname: "/collections",
  title: "Collections | Sung Gallery",
});

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted)]">
            Collections
          </p>
          <h1 className="font-serif text-5xl text-[color:var(--color-ink)] sm:text-6xl">
            Edited as sequences, not dumps.
          </h1>
        </div>
        <p className="max-w-xl text-base leading-8 text-[color:var(--color-muted)] lg:justify-self-end">
          Each collection has its own pacing, cover image, and order. The site is meant to be traversed in these smaller, calmer units.
        </p>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        {collections.map((collection) => (
          <CollectionCard key={collection.slug} {...collection} />
        ))}
      </section>
    </div>
  );
}

