import Image from "next/image";
import Link from "next/link";

import { CollectionCard } from "@/components/site/collection-card";
import { getHomePageData } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  description:
    "A curated personal gallery of city light, transit rhythm, and quiet architectural moments.",
  imagePath: "/placeholders/seoul-evenings-cover.svg",
  pathname: "/",
  title: "Sung Gallery",
});

export default async function HomePage() {
  const { heroCollection, latestCollection, site } = await getHomePageData();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted)]">
            Curated personal archive
          </p>
          <h1 className="max-w-3xl font-serif text-5xl leading-none text-[color:var(--color-ink)] sm:text-6xl lg:text-7xl">
            Quiet city studies, arranged as short visual essays.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[color:var(--color-muted)] sm:text-lg">
            {site.homeIntro}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              className="inline-flex items-center justify-center border border-[color:var(--color-ink)] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[color:var(--color-ink)] transition duration-200 hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
              href={`/collections/${heroCollection.slug}`}
            >
              View featured work
            </Link>
            <Link
              className="inline-flex items-center justify-center px-5 py-3 text-sm uppercase tracking-[0.22em] text-[color:var(--color-muted)] transition duration-200 hover:text-[color:var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
              href="/collections"
            >
              Browse collections
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-surface)]">
          <Image
            alt={heroCollection.coverAlt}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            src={heroCollection.coverImageUrl}
          />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted)]">
            Featured collections
          </p>
          <h2 className="font-serif text-4xl text-[color:var(--color-ink)]">
            Collection-led, not feed-led.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[color:var(--color-muted)] lg:justify-self-end">
          The homepage stays selective. Each series is edited as a small body of work so the pace feels deliberate instead of infinite.
        </p>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        {site.featuredCollections.map((collection) => (
          <CollectionCard key={collection.slug} {...collection} />
        ))}
      </section>

      <section className="grid gap-8 border-t border-black/8 pt-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted)]">
            Latest edit
          </p>
          <h2 className="font-serif text-4xl text-[color:var(--color-ink)]">{latestCollection.title}</h2>
        </div>
        <div className="space-y-5">
          <p className="max-w-2xl text-base leading-8 text-[color:var(--color-muted)]">
            {latestCollection.intro}
          </p>
          <Link
            className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-[color:var(--color-ink)] transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
            href={`/collections/${latestCollection.slug}`}
          >
            Open the sequence
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

