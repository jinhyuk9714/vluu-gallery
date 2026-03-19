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
      description: "Frame not found.",
      pathname: `/photo/${slug}`,
      title: "Frame not found | VLUU",
    });
  }

  return buildMetadata({
    description: photo.captionShort,
    imagePath: photo.imageUrl,
    pathname: `/photo/${photo.slug}`,
    title: `${photo.title} | VLUU`,
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
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-8 px-4 py-6 sm:px-6 lg:gap-10 lg:px-10 lg:py-8">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-steel)]">
        <Link
          className="transition duration-300 hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
          href="/collections"
        >
          All sequences
        </Link>
        <span>/</span>
        <Link
          className="transition duration-300 hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
          href={`/collections/${photo.collection.slug}`}
        >
          {photo.collection.title}
        </Link>
      </div>

      <section className="grid gap-6 border-b border-[var(--color-line)] pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.4fr)] lg:items-end">
        <div className="scene-reveal space-y-3">
          <p className="text-xs uppercase tracking-[0.42em] text-[var(--color-steel)]">
            Frame
          </p>
          <h1 className="max-w-5xl font-serif text-[clamp(3.6rem,8vw,8.8rem)] leading-[0.82] tracking-[-0.03em] text-[var(--color-ink)]">
            {photo.title}
          </h1>
        </div>

        <div className="grid gap-3 border-t border-[var(--color-line)] pt-5 text-xs uppercase tracking-[0.3em] text-[var(--color-steel)]">
          <p>Info</p>
          <p>{photo.collection.title}</p>
          {photo.locationLabel ? <p>{photo.locationLabel}</p> : null}
          {photo.shotDate ? <p>{photo.shotDate}</p> : null}
        </div>
      </section>

      <section className="scene-image relative overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_30px_90px_rgba(17,17,17,0.16)]">
        <div className="relative aspect-[16/11] min-h-[36rem] lg:min-h-[78vh]">
          <Image
            alt={photo.alt}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={photo.imageUrl}
          />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(18rem,0.38fr)] lg:items-start">
        <div className="space-y-4">
          <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            {photo.captionShort}
          </p>
        </div>

        <dl className="grid gap-4 border-t border-[var(--color-line)] pt-5 text-sm text-[var(--color-muted)]">
          <div className="flex justify-between gap-6">
            <dt>Collection</dt>
            <dd className="text-right text-[var(--color-ink)]">
              <Link
                className="transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
                href={`/collections/${photo.collection.slug}`}
              >
                {photo.collection.title}
              </Link>
            </dd>
          </div>
          {photo.locationLabel ? (
            <div className="flex justify-between gap-6">
              <dt>Location</dt>
              <dd className="text-right text-[var(--color-ink)]">{photo.locationLabel}</dd>
            </div>
          ) : null}
          {photo.shotDate ? (
            <div className="flex justify-between gap-6">
              <dt>Date</dt>
              <dd className="text-right text-[var(--color-ink)]">{photo.shotDate}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <nav
        aria-label="Photo pagination"
        className="grid gap-4 border-t border-[var(--color-line)] pt-6 sm:grid-cols-2"
      >
        {photo.previousPhoto ? (
          <Link
            className="group flex min-h-40 flex-col justify-between border border-[var(--color-line)] bg-[var(--color-surface)] p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
            href={`/photo/${photo.previousPhoto.slug}`}
          >
            <span className="text-xs uppercase tracking-[0.24em] text-[var(--color-steel)]">
              Previous frame
            </span>
            <span className="max-w-sm font-serif text-[clamp(2rem,3vw,3.2rem)] leading-[0.9] text-[var(--color-ink)] transition duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0">
              {photo.previousPhoto.title}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
        {photo.nextPhoto ? (
          <Link
            className="group flex min-h-40 flex-col justify-between border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-left sm:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
            href={`/photo/${photo.nextPhoto.slug}`}
          >
            <span className="text-xs uppercase tracking-[0.24em] text-[var(--color-steel)]">
              Next frame
            </span>
            <span className="max-w-sm self-start font-serif text-[clamp(2rem,3vw,3.2rem)] leading-[0.9] text-[var(--color-ink)] transition duration-300 group-hover:-translate-x-1 motion-reduce:group-hover:translate-x-0 sm:self-end">
              {photo.nextPhoto.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
