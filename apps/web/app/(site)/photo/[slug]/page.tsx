import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPhotoBySlug, getPhotoSlugs } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);

  if (!photo) {
    return buildMetadata({
      description: "Photo not found.",
      pathname: `/photo/${slug}`,
      title: "Photo not found | Sung Gallery",
    });
  }

  return buildMetadata({
    description: photo.captionShort,
    imagePath: photo.imageUrl,
    pathname: `/photo/${photo.slug}`,
    title: `${photo.title} | Sung Gallery`,
  });
}

export async function generateStaticParams() {
  const slugs = await getPhotoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);

  if (!photo) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-[color:var(--color-muted)]">
        <Link
          className="transition hover:text-[color:var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
          href="/collections"
        >
          Collections
        </Link>
        <span>/</span>
        <Link
          className="transition hover:text-[color:var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
          href={`/collections/${photo.collection.slug}`}
        >
          {photo.collection.title}
        </Link>
      </div>

      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-surface)] lg:aspect-[4/4.8]">
          <Image
            alt={photo.alt}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            src={photo.imageUrl}
          />
        </div>
        <div className="flex flex-col justify-between gap-10">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted)]">
                Selected frame
              </p>
              <h1 className="font-serif text-5xl text-[color:var(--color-ink)] sm:text-6xl">
                {photo.title}
              </h1>
            </div>
            <p className="max-w-xl text-base leading-8 text-[color:var(--color-muted)]">
              {photo.captionShort}
            </p>
            <dl className="grid gap-4 border-t border-black/8 pt-6 text-sm text-[color:var(--color-muted)]">
              {photo.locationLabel ? (
                <div className="flex justify-between gap-6">
                  <dt>Location</dt>
                  <dd className="text-right text-[color:var(--color-ink)]">{photo.locationLabel}</dd>
                </div>
              ) : null}
              {photo.shotDate ? (
                <div className="flex justify-between gap-6">
                  <dt>Date</dt>
                  <dd className="text-right text-[color:var(--color-ink)]">{photo.shotDate}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <nav aria-label="Photo pagination" className="grid gap-4 border-t border-black/8 pt-6 sm:grid-cols-2">
            {photo.previousPhoto ? (
              <Link
                className="group flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
                href={`/photo/${photo.previousPhoto.slug}`}
              >
                <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-muted)]">Previous</span>
                <span className="font-serif text-2xl text-[color:var(--color-ink)] transition group-hover:opacity-70">
                  {photo.previousPhoto.title}
                </span>
              </Link>
            ) : <div />}
            {photo.nextPhoto ? (
              <Link
                className="group flex flex-col gap-1 text-left sm:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
                href={`/photo/${photo.nextPhoto.slug}`}
              >
                <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-muted)]">Next</span>
                <span className="font-serif text-2xl text-[color:var(--color-ink)] transition group-hover:opacity-70">
                  {photo.nextPhoto.title}
                </span>
              </Link>
            ) : null}
          </nav>
        </div>
      </section>
    </div>
  );
}

