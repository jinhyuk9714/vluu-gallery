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
    <div className="mx-auto w-full max-w-[1720px] px-4 pb-14 pt-24 sm:px-6 lg:px-10 lg:pt-28">
      <section className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((collection, index) => (
          <CollectionCard key={collection.slug} index={index} {...collection} />
        ))}
      </section>
    </div>
  );
}
