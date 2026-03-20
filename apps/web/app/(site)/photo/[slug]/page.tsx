import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PhotoDetailHero } from "@/components/site/photo-detail-hero";
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
    <div className="pb-10">
      <PhotoDetailHero
        alt={photo.alt}
        height={photo.height}
        imageUrl={photo.imageUrl}
        title={photo.title}
        width={photo.width}
      />

      <section className="mx-auto grid w-full max-w-[1720px] gap-6 px-4 py-20 sm:px-6 lg:grid-cols-[0.48fr_0.52fr] lg:px-10">
        <p className="text-[0.95rem] uppercase leading-none text-[var(--color-ink)]">Frame</p>
        <div className="space-y-8">
          <p className="max-w-2xl text-base leading-7 text-[var(--color-ink)]">{photo.captionShort}</p>
          <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
            {photo.locationLabel ? (
              <>
                <p className="text-[0.95rem] uppercase leading-none text-[var(--color-ink)]">Location</p>
                <p className="text-base leading-7 text-[var(--color-ink)]">{photo.locationLabel}</p>
              </>
            ) : null}
            {photo.shotDate ? (
              <>
                <p className="text-[0.95rem] uppercase leading-none text-[var(--color-ink)]">Date</p>
                <p className="text-base leading-7 text-[var(--color-ink)]">{photo.shotDate}</p>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <nav
        aria-label="Photo pagination"
        className="mx-auto grid w-full max-w-[1720px] gap-8 px-4 pb-6 pt-2 sm:px-6 lg:grid-cols-2 lg:px-10"
      >
        {photo.previousPhoto ? (
          <Link
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
            href={`/photo/${photo.previousPhoto.slug}`}
          >
            <span className="block font-serif text-[clamp(2.8rem,4.8vw,5rem)] leading-[0.9] tracking-[-0.05em] text-[var(--color-ink)]">
              PREV:
            </span>
            <span className="block font-serif text-[clamp(2.8rem,4.8vw,5rem)] leading-[0.9] tracking-[-0.05em] text-[var(--color-ink)]">
              {photo.previousPhoto.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {photo.nextPhoto ? (
          <Link
            className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] lg:text-right"
            href={`/photo/${photo.nextPhoto.slug}`}
          >
            <span className="block font-serif text-[clamp(2.8rem,4.8vw,5rem)] leading-[0.9] tracking-[-0.05em] text-[var(--color-ink)]">
              NEXT:
            </span>
            <span className="block font-serif text-[clamp(2.8rem,4.8vw,5rem)] leading-[0.9] tracking-[-0.05em] text-[var(--color-ink)]">
              {photo.nextPhoto.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
