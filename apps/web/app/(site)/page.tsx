import Image from "next/image";
import Link from "next/link";

import { getHomePageData } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  description: "A stark overview of VLUU, arranged as selected photographic sequences.",
  imagePath: "/placeholders/seoul-evenings-cover.svg",
  pathname: "/",
  title: "Overview | VLUU",
});

export default async function HomePage() {
  const { heroCollection, latestCollection, site } = await getHomePageData();

  return (
    <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-16 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <section className="grid gap-10 border-b border-[var(--color-line)] pb-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
        <div className="scene-reveal space-y-6">
          <p className="text-xs uppercase tracking-[0.42em] text-[var(--color-steel)]">
            Featured sequence
          </p>
          <h1 className="max-w-xl font-serif text-[clamp(3.8rem,8vw,7.8rem)] leading-[0.86] text-[var(--color-ink)]">
            A selected archive, cut as a sequence.
          </h1>
          <p className="max-w-xl text-balance text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            {site.homeIntro}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-2 border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[var(--color-background)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(17,17,17,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] motion-reduce:hover:translate-y-0"
              href={`/collections/${heroCollection.slug}`}
            >
              Enter sequence
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              className="inline-flex items-center gap-2 border border-[var(--color-line)] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[var(--color-ink)] transition duration-300 hover:bg-[var(--color-ink)] hover:text-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] motion-reduce:hover:bg-transparent motion-reduce:hover:text-[var(--color-ink)]"
              href="/collections"
            >
              Overview
            </Link>
          </div>
        </div>

        <Link
          className="scene-image group relative overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_28px_80px_rgba(17,17,17,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
          href={`/collections/${heroCollection.slug}`}
        >
          <div className="relative aspect-[16/11] min-h-[28rem]">
            <Image
              alt={heroCollection.coverAlt}
              className="object-cover transition duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 68vw"
              src={heroCollection.coverImageUrl}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-[rgba(17,17,17,0.72)] via-[rgba(17,17,17,0.24)] to-transparent p-5 text-[var(--color-background)] sm:p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/70">Sequence 01</p>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-serif text-4xl leading-[0.95] sm:text-5xl">
                  {heroCollection.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/80">
                  {heroCollection.intro}
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/65">
                {heroCollection.photoCount} frames
              </p>
            </div>
          </div>
        </Link>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="scene-reveal-delayed space-y-4">
          <p className="text-xs uppercase tracking-[0.42em] text-[var(--color-steel)]">
            Selected sequences
          </p>
          <h2 className="max-w-sm font-serif text-[clamp(2.6rem,4vw,4.8rem)] leading-[0.9] text-[var(--color-ink)]">
            More panels, less browsing noise.
          </h2>
        </div>
        <p className="scene-reveal-delayed max-w-2xl self-end text-base leading-8 text-[var(--color-muted)]">
          {site.siteDescription}
        </p>
      </section>

      <section className="grid gap-6">
        {site.featuredCollections.map((collection, index) => {
          const reverse = index % 2 === 1;
          const mediaClass = reverse
            ? "relative aspect-[16/10] overflow-hidden rounded-[1.15rem] border border-[var(--color-line)] bg-[var(--color-background)] lg:order-2"
            : "relative aspect-[16/10] overflow-hidden rounded-[1.15rem] border border-[var(--color-line)] bg-[var(--color-background)]";
          const copyClass = reverse ? "space-y-4 lg:order-1" : "space-y-4";

          return (
            <Link
              key={collection.slug}
              className="group grid gap-4 rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-[0_18px_60px_rgba(17,17,17,0.08)] transition duration-500 hover:-translate-y-1 hover:border-[rgba(17,17,17,0.22)] sm:p-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] lg:items-end"
              href={`/collections/${collection.slug}`}
            >
              <div className={mediaClass}>
                <Image
                  alt={collection.coverAlt}
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  src={collection.coverImageUrl}
                />
              </div>

              <div className={copyClass}>
                <div className="flex items-center justify-between gap-4 text-[0.66rem] uppercase tracking-[0.28em] text-[var(--color-steel)]">
                  <span>0{index + 2}</span>
                  <span>{collection.photoCount} frames</span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-[clamp(2.1rem,3vw,3.4rem)] leading-[0.92] text-[var(--color-ink)]">
                    {collection.title}
                  </h3>
                  <p className="max-w-2xl text-[0.95rem] leading-7 text-[var(--color-muted)]">
                    {collection.intro}
                  </p>
                </div>
                <span className="inline-flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.28em] text-[var(--color-ink)] transition-transform duration-300 group-hover:translate-x-1">
                  Open sequence
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 border-t border-[var(--color-line)] pt-10 lg:grid-cols-[0.76fr_1.24fr]">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.42em] text-[var(--color-steel)]">
            Latest sequence
          </p>
          <h2 className="font-serif text-[clamp(2.4rem,3.8vw,4.4rem)] leading-[0.92] text-[var(--color-ink)]">
            {latestCollection.title}
          </h2>
        </div>
        <div className="max-w-2xl space-y-5">
          <p className="text-base leading-8 text-[var(--color-muted)]">{latestCollection.intro}</p>
          <Link
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[var(--color-ink)] transition duration-300 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] motion-reduce:hover:translate-x-0"
            href={`/collections/${latestCollection.slug}`}
          >
            Open latest sequence
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
