import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PhotoGrid } from "@/components/site/photo-grid";
import { getCollectionBySlug, getCollectionSlugs } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return buildMetadata({
      description: "Collection not found.",
      pathname: `/collections/${slug}`,
      title: "Collection not found | Sung Gallery",
    });
  }

  return buildMetadata({
    description: collection.intro,
    imagePath: collection.coverImageUrl,
    pathname: `/collections/${collection.slug}`,
    title: `${collection.title} | Sung Gallery`,
  });
}

export async function generateStaticParams() {
  const slugs = await getCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted)]">
            Collection
          </p>
          <h1 className="font-serif text-5xl text-[color:var(--color-ink)] sm:text-6xl">
            {collection.title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[color:var(--color-muted)]">
            {collection.intro}
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-surface)]">
          <Image
            alt={collection.coverAlt}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            src={collection.coverImageUrl}
          />
        </div>
      </section>

      <PhotoGrid photos={collection.photos} />
    </div>
  );
}

