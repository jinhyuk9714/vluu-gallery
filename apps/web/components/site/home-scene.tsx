"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ProportionalImage } from "@/components/site/proportional-image";
import type { CollectionPageData, PhotoOrientation, SiteSettings } from "@/types/content";

type ReelItem = {
  alt: string;
  aspectRatio?: number;
  height?: number;
  href: string;
  imageUrl: string;
  orientation?: PhotoOrientation;
  width?: number;
};

type Density = "s" | "m" | "l";

const AUTOPLAY_INTERVAL_MS = 6000;

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
  const [hasPointerMoved, setHasPointerMoved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const activeCollection = featuredCollections[activeIndex] ?? featuredCollections[0];
  const slideCount = featuredCollections.length;
  const slideOffset = slideCount > 0 ? activeIndex * (100 / slideCount) : 0;
  const isAutoplayPaused =
    slideCount < 2 ||
    (hasPointerMoved && isHovered) ||
    isFocusWithin ||
    !isDocumentVisible ||
    prefersReducedMotion;

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateReducedMotionPreference();
    mediaQuery.addEventListener("change", updateReducedMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateReducedMotionPreference);
    };
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setIsDocumentVisible(document.visibilityState === "visible");
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (isAutoplayPaused) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slideCount);
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeIndex, isAutoplayPaused, slideCount]);

  if (!activeCollection) {
    return null;
  }

  return (
    <div className="pb-12">
      <section
        className="relative min-h-[100svh] overflow-hidden bg-[var(--color-surface)]"
        data-testid="home-hero"
        onBlurCapture={(event) => {
          const nextTarget = event.relatedTarget;
          if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
            setIsFocusWithin(false);
          }
        }}
        onFocusCapture={() => {
          setIsFocusWithin(true);
        }}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        onPointerMove={(event) => {
          if (event.movementX !== 0 || event.movementY !== 0) {
            setHasPointerMoved(true);
          }
        }}
      >
        <div
          className="absolute inset-0 flex min-h-[100svh] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none"
          data-testid="hero-track"
          style={{
            transform: `translate3d(-${slideOffset}%, 0, 0)`,
            width: `${slideCount * 100}%`,
          }}
        >
          {featuredCollections.map((collection, index) => (
            <div
              key={collection.slug}
              aria-hidden={index !== activeIndex}
              className="relative min-h-[100svh] flex-none overflow-hidden bg-[var(--color-surface)]"
              data-testid="hero-slide"
              style={{ width: `${100 / slideCount}%` }}
            >
              <Image
                alt={collection.coverAlt}
                className="scene-image object-cover"
                fill
                priority={index === 0}
                sizes="100vw"
                src={collection.coverImageUrl}
              />
            </div>
          ))}
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
                      isActive ? "opacity-100" : "opacity-55 hover:opacity-80"
                    }`}
                    onClick={() => {
                      setActiveIndex(index);
                    }}
                    type="button"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                );
              })}
            </div>

            <div className="pointer-events-auto min-w-0 self-end">
              <p
                className="font-serif text-[clamp(2rem,3vw,3rem)] leading-[0.9] tracking-[-0.04em] text-white"
                data-testid="hero-title"
              >
                {activeCollection.title}
              </p>
            </div>

            <p className="pointer-events-none text-[0.95rem] leading-none text-white">Scroll</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1720px] px-4 pb-8 pt-8 sm:px-6 lg:px-10 lg:pb-10 lg:pt-10">
        <p className="scene-reveal block max-w-[12ch] font-serif text-[clamp(3.8rem,8.8vw,8.8rem)] leading-[0.88] tracking-[-0.055em] text-[var(--color-ink)] sm:max-w-none">
          {site.siteTitle}
          <span className="block sm:inline"> — </span>
          <span className="block sm:inline">Photographic Sequences</span>
        </p>
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
              <div className="overflow-hidden bg-[var(--color-surface)]">
                <ProportionalImage
                  alt={item.alt}
                  className="scene-image h-auto w-full transition duration-700 hover:scale-[1.02] motion-reduce:transition-none"
                  height={item.height}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
                  src={item.imageUrl}
                  width={item.width}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
