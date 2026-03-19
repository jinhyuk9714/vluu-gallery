import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PhotoGrid } from "@/components/site/photo-grid";
import { ProportionalImage } from "@/components/site/proportional-image";
import { getCollectionBySlug, getCollectionSlugs, getCollections } from "@/lib/sanity/data";
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
      description: "Sequence not found.",
      pathname: `/collections/${slug}`,
      title: "Sequence not found | VLUU",
    });
  }

  return buildMetadata({
    description: collection.intro,
    imagePath: collection.coverImageUrl,
    pathname: `/collections/${collection.slug}`,
    title: `${collection.title} | VLUU`,
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
  const collections = await getCollections();

  if (!collection) {
    notFound();
  }

  const collectionIndex = collections.findIndex((item) => item.slug === collection.slug);
  const previousCollection = collectionIndex > 0 ? collections[collectionIndex - 1] : undefined;
  const nextCollection =
    collectionIndex >= 0 && collectionIndex < collections.length - 1
      ? collections[collectionIndex + 1]
      : undefined;
  const [firstPhoto, secondPhoto, thirdPhoto, ...remainingPhotos] = collection.photos;

  return (
    <div className="pb-10">
      <section className="relative overflow-hidden bg-[var(--color-surface)]">
        <ProportionalImage
          alt={collection.coverAlt}
          className="scene-image max-h-[92svh] w-full object-contain"
          height={collection.height}
          priority
          sizes="100vw"
          src={collection.coverImageUrl}
          width={collection.width}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0)_24%,rgba(0,0,0,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1720px] px-4 pb-5 sm:px-6 lg:px-10 lg:pb-8">
          <h1 className="max-w-[10ch] font-serif text-[clamp(3.8rem,8vw,8.6rem)] leading-[0.88] tracking-[-0.05em] text-white">
            {collection.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1720px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-2 lg:px-10">
        {firstPhoto ? (
          <Link
            className="block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
            href={`/photo/${firstPhoto.slug}`}
          >
            <div className="overflow-hidden bg-[var(--color-surface)]">
              <ProportionalImage
                alt={firstPhoto.alt}
                className="h-auto w-full"
                height={firstPhoto.height}
                sizes="(max-width: 1024px) 100vw, 48vw"
                src={firstPhoto.imageUrl}
                width={firstPhoto.width}
              />
            </div>
          </Link>
        ) : null}
        {secondPhoto ? (
          <Link
            className="block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
            href={`/photo/${secondPhoto.slug}`}
          >
            <div className="overflow-hidden bg-[var(--color-surface)]">
              <ProportionalImage
                alt={secondPhoto.alt}
                className="h-auto w-full"
                height={secondPhoto.height}
                sizes="(max-width: 1024px) 100vw, 48vw"
                src={secondPhoto.imageUrl}
                width={secondPhoto.width}
              />
            </div>
          </Link>
        ) : null}
      </section>

      {thirdPhoto ? (
        <section className="mx-auto w-full max-w-[1720px] px-4 pb-4 sm:px-6 lg:px-10">
          <Link
            className="block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
            href={`/photo/${thirdPhoto.slug}`}
          >
            <div className="overflow-hidden bg-[var(--color-surface)]">
              <ProportionalImage
                alt={thirdPhoto.alt}
                className="h-auto w-full"
                height={thirdPhoto.height}
                sizes="100vw"
                src={thirdPhoto.imageUrl}
                width={thirdPhoto.width}
              />
            </div>
          </Link>
        </section>
      ) : null}

      {remainingPhotos.length > 0 ? (
        <section className="mx-auto w-full max-w-[1720px] px-4 pb-4 sm:px-6 lg:px-10">
          <PhotoGrid photos={remainingPhotos} />
        </section>
      ) : null}

      <section className="mx-auto grid w-full max-w-[1720px] gap-6 px-4 py-20 sm:px-6 lg:grid-cols-[0.48fr_0.52fr] lg:px-10">
        <p className="text-[0.95rem] uppercase leading-none text-[var(--color-ink)]">Info</p>
        <div className="grid gap-8 sm:grid-cols-[10rem_1fr]">
          <p className="text-[0.95rem] uppercase leading-none text-[var(--color-ink)]">Cut</p>
          <p className="max-w-xl text-base leading-7 text-[var(--color-ink)]">{collection.intro}</p>
          <p className="text-[0.95rem] uppercase leading-none text-[var(--color-ink)]">Frames</p>
          <p className="text-base leading-7 text-[var(--color-ink)]">{collection.photoCount}</p>
        </div>
      </section>

      <nav
        aria-label="Collection pagination"
        className="mx-auto grid w-full max-w-[1720px] gap-8 px-4 pb-6 pt-2 sm:px-6 lg:grid-cols-2 lg:px-10"
      >
        {previousCollection ? (
          <Link
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
            href={`/collections/${previousCollection.slug}`}
          >
            <span className="block font-serif text-[clamp(2.8rem,4.8vw,5rem)] leading-[0.9] tracking-[-0.05em] text-[var(--color-ink)]">
              PREV:
            </span>
            <span className="block font-serif text-[clamp(2.8rem,4.8vw,5rem)] leading-[0.9] tracking-[-0.05em] text-[var(--color-ink)]">
              {previousCollection.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {nextCollection ? (
          <Link
            className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] lg:text-right"
            href={`/collections/${nextCollection.slug}`}
          >
            <span className="block font-serif text-[clamp(2.8rem,4.8vw,5rem)] leading-[0.9] tracking-[-0.05em] text-[var(--color-ink)]">
              NEXT:
            </span>
            <span className="block font-serif text-[clamp(2.8rem,4.8vw,5rem)] leading-[0.9] tracking-[-0.05em] text-[var(--color-ink)]">
              {nextCollection.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
