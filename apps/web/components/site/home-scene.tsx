"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { CollectionPageData, PhotoOrientation, SiteSettings } from "@/types/content";

type ReelItem = {
  alt: string;
  href: string;
  imageUrl: string;
  orientation: PhotoOrientation;
};

type Density = "s" | "m" | "l";

function getAspectClass(orientation: PhotoOrientation) {
  switch (orientation) {
    case "portrait":
      return "aspect-[4/5]";
    case "square":
      return "aspect-square";
    default:
      return "aspect-[4/3]";
  }
}

function getColumnsClass(density: Density) {
  switch (density) {
    case "s":
      return "columns-2 gap-3 sm:columns-3 lg:columns-5";
    case "l":
      return "columns-1 gap-4 sm:columns-2 lg:columns-3";
    default:
      return "columns-2 gap-4 sm:columns-3 lg:columns-4";
  }
}

export function HomeScene({
  featuredCollections,
  reelItems,
  site,
}: {
  featuredCollections: CollectionPageData[];
  reelItems: ReelItem[];
  site: SiteSettings;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [density, setDensity] = useState<Density>("m");

  const activeCollection = featuredCollections[activeIndex] ?? featuredCollections[0];
  const previewCollection = featuredCollections[(activeIndex + 1) % featuredCollections.length];

  const dedupedReelItems = useMemo(() => {
    const seen = new Set<string>();
    return reelItems.filter((item) => {
      if (seen.has(item.imageUrl)) {
        return false;
      }

      seen.add(item.imageUrl);
      return true;
    });
  }, [reelItems]);

  if (!activeCollection) {
    return null;
  }

  return (
    <div className="pb-12">
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="grid min-h-[100svh] grid-cols-1 lg:grid-cols-[0.37fr_0.63fr]">
          <div className="relative hidden min-h-[100svh] overflow-hidden lg:block">
            <Image
              alt={previewCollection?.coverAlt ?? activeCollection.coverAlt}
              className="scene-image object-cover"
              fill
              priority
              sizes="38vw"
              src={previewCollection?.coverImageUrl ?? activeCollection.coverImageUrl}
            />
          </div>
          <div className="relative min-h-[100svh] overflow-hidden">
            <Image
              alt={activeCollection.coverAlt}
              className="scene-image object-cover"
              fill
              priority
              sizes="100vw"
              src={activeCollection.coverImageUrl}
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0)_24%,rgba(0,0,0,0.18)_100%)]" />

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto flex w-full max-w-[1720px] items-end justify-between gap-5 px-4 pb-4 text-white sm:px-6 sm:pb-6 lg:px-10 lg:pb-7">
            <div className="pointer-events-auto flex items-end gap-4 text-[0.95rem] leading-none sm:gap-6">
              {featuredCollections.map((collection, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={collection.slug}
                    aria-label={`Open featured collection ${collection.title}`}
                    className={`transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0 hover:opacity-75 sm:opacity-75"
                    }`}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                );
              })}
            </div>

            <div className="pointer-events-auto min-w-0 self-end">
              <p className="font-serif text-[clamp(2rem,3vw,3rem)] leading-[0.9] tracking-[-0.04em] text-white">
                {activeCollection.title}
              </p>
              <Link
                className="mt-1 inline-flex items-center gap-2 text-[1.05rem] leading-none text-white hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
                href={`/collections/${activeCollection.slug}`}
              >
                View Collection
              </Link>
            </div>

            <p className="pointer-events-none text-[0.95rem] leading-none text-white">Scroll</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1720px] px-4 pb-8 pt-8 sm:px-6 lg:px-10 lg:pb-10 lg:pt-10">
        <Link
          className="scene-reveal block max-w-[12ch] font-serif text-[clamp(3.8rem,8.8vw,8.8rem)] leading-[0.88] tracking-[-0.055em] text-[var(--color-ink)] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] sm:max-w-none"
          href={`/collections/${activeCollection.slug}`}
        >
          {site.siteTitle}
          <span className="block sm:inline"> — </span>
          <span className="block sm:inline">Photographic Sequences</span>
        </Link>
      </section>

      <section className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-10">
        <div className="mb-4 flex items-center gap-5 text-[0.95rem] leading-none text-[var(--color-ink)]">
          {(["s", "m", "l"] as Density[]).map((size) => (
            <button
              key={size}
              className={`uppercase transition-opacity ${
                density === size ? "opacity-100" : "opacity-45 hover:opacity-80"
              }`}
              onClick={() => setDensity(size)}
              type="button"
            >
              {size}
            </button>
          ))}
        </div>

        <div className={getColumnsClass(density)}>
          {dedupedReelItems.map((item, index) => (
            <Link
              key={`${item.href}-${index}`}
              className="mb-4 block break-inside-avoid overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
              href={item.href}
            >
              <div className={`relative overflow-hidden bg-[var(--color-surface)] ${getAspectClass(item.orientation)}`}>
                <Image
                  alt={item.alt}
                  className="scene-image h-full w-full object-cover transition duration-700 hover:scale-[1.02] motion-reduce:transition-none"
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
                  src={item.imageUrl}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
