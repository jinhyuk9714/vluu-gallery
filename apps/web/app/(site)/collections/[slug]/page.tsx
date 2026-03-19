import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

  if (!collection) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-12 px-4 py-6 sm:px-6 lg:gap-16 lg:px-10 lg:py-8">
      <Link
        className="w-fit text-xs uppercase tracking-[0.34em] text-[var(--color-steel)] transition hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
        href="/collections"
      >
        All sequences
      </Link>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.54fr)] lg:items-end">
        <div className="scene-image relative overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_32px_90px_rgba(17,17,17,0.14)]">
          <div className="relative aspect-[16/11] min-h-[28rem]">
            <Image
              alt={collection.coverAlt}
              className="object-cover transition duration-700 motion-reduce:transition-none"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 74vw"
              src={collection.coverImageUrl}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[rgba(17,17,17,0.82)] via-[rgba(17,17,17,0.22)] to-transparent p-5 text-[var(--color-background)] sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/70">
                  Sequence
                </p>
                <h1 className="max-w-3xl font-serif text-[clamp(3.2rem,7vw,7.8rem)] leading-[0.84] tracking-[-0.03em]">
                  {collection.title}
                </h1>
              </div>
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/70">
                {collection.photoCount} frames
              </p>
            </div>
          </div>
        </div>

        <div className="scene-reveal flex flex-col gap-8 border-t border-[var(--color-line)] pt-6 lg:min-h-[26rem] lg:justify-between lg:pt-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.42em] text-[var(--color-steel)]">
              Cut
            </p>
            <p className="max-w-md text-base leading-8 text-[var(--color-muted)]">
              {collection.intro}
            </p>
          </div>

          <div className="grid gap-3 text-xs uppercase tracking-[0.32em] text-[var(--color-steel)]">
            <p>Ordered edit</p>
            <p>Image-led sequence</p>
            <p>Open in full frame</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 border-y border-[var(--color-line)] py-5 text-xs uppercase tracking-[0.3em] text-[var(--color-steel)] sm:grid-cols-3">
        <p>{collection.photoCount} frames</p>
        <p>All sequences</p>
        <p>Single run</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <PhotoGrid photos={collection.photos} />

        <aside className="hidden lg:block">
          <div className="sticky top-24 border-t border-[var(--color-line)] pt-5">
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-steel)]">
              Sequence note
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              The order is fixed. Read the frames as a run, not a menu.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
