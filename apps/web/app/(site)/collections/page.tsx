import { CollectionCard } from "@/components/site/collection-card";
import { getCollections } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  description: "Browse curated photography collections arranged as image-led portfolio panels.",
  pathname: "/collections",
  title: "All sequences | VLUU",
});

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-16 px-4 py-6 sm:px-6 lg:px-10 lg:gap-20 lg:py-8">
      <section className="grid gap-8 border-b border-[var(--color-line)] pb-12 lg:grid-cols-[0.62fr_1.38fr] lg:items-end">
        <div className="scene-reveal space-y-4 lg:pb-3">
          <p className="text-xs uppercase tracking-[0.42em] text-[var(--color-steel)]">
            All sequences
          </p>
          <p className="max-w-xs text-sm leading-7 text-[var(--color-muted)]">
            Two words matter here: edit and pace.
          </p>
        </div>
        <div className="scene-reveal space-y-6">
          <h1 className="max-w-5xl font-serif text-[clamp(4rem,10vw,10rem)] leading-[0.82] tracking-[-0.03em] text-[var(--color-ink)]">
            All sequences.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            Each set is cut down to a single run of frames. Covers stay large, copy stays spare, and the list reads as a line of image-led panels rather than a grid of cards.
          </p>
        </div>
      </section>

      <section className="grid gap-10">
        {collections.map((collection, index) => (
          <CollectionCard
            key={collection.slug}
            index={index}
            variant="sequence"
            {...collection}
          />
        ))}
      </section>
    </div>
  );
}
