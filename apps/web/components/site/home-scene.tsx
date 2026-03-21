"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ProportionalImage } from "@/components/site/proportional-image";
import type { CollectionPageData, SiteSettings } from "@/types/content";

type ReelItem = {
  alt: string;
  aspectRatio?: number;
  height?: number;
  href: string;
  imageUrl: string;
  width?: number;
};

type HomeSceneProps = {
  featuredCollections: CollectionPageData[];
  reelItems: ReelItem[];
  site: SiteSettings;
};

const AUTOPLAY_INTERVAL_MS = 6000;

function getWallSpanClass(index: number) {
  switch (index % 7) {
    case 0:
      return "md:col-span-7 lg:col-span-6";
    case 1:
      return "md:col-span-5 lg:col-span-4 lg:mt-14";
    case 2:
      return "md:col-span-4 lg:col-span-3";
    case 3:
      return "md:col-span-8 lg:col-span-7 lg:-mt-10";
    case 4:
      return "md:col-span-5 lg:col-span-4 lg:mt-20";
    case 5:
      return "md:col-span-7 lg:col-span-5";
    default:
      return "md:col-span-5 lg:col-span-4 lg:mt-8";
  }
}

export function HomeScene({
  featuredCollections,
  reelItems,
  site,
}: HomeSceneProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const activeCollection = featuredCollections[activeIndex] ?? featuredCollections[0];
  const slideCount = featuredCollections.length;
  const slideOffset = slideCount > 0 ? activeIndex * (100 / slideCount) : 0;
  const isAutoplayPaused =
    slideCount < 2 || isHovered || isFocusWithin || !isDocumentVisible || prefersReducedMotion;

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
  }, [isAutoplayPaused, slideCount]);

  if (!activeCollection) {
    return null;
  }

  return (
    <div className="pb-16 lg:pb-20">
      <section
        className="relative min-h-[100svh] overflow-hidden bg-[var(--color-background)] text-white"
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
      >
        <div
          className="absolute inset-0 flex min-h-[100svh] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none"
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
              <div className="absolute inset-0 bg-black/18" />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,5,6,0.1)_0%,rgba(4,5,6,0.18)_24%,rgba(4,5,6,0.56)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.16),transparent_26%),radial-gradient(circle_at_82%_76%,rgba(0,0,0,0.3),transparent_34%)]" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1720px] flex-col justify-end px-4 pb-4 pt-24 sm:px-6 sm:pb-6 lg:px-10 lg:pb-8 lg:pt-28">
          <div className="grid gap-8 border-t border-white/14 pt-6 lg:grid-cols-[0.18fr_0.56fr_0.26fr] lg:items-end">
            <div className="pointer-events-auto flex items-end gap-4 text-[0.92rem] leading-none text-white/76 sm:gap-5">
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

            <div className="pointer-events-auto min-w-0 space-y-4">
              <p className="text-[0.74rem] uppercase tracking-[0.28em] text-white/62">
                Selected sequence
              </p>
              <p
                className="max-w-[8ch] font-serif text-[clamp(3.2rem,8.7vw,9.6rem)] leading-[0.85] tracking-[-0.06em] text-white sm:max-w-[9ch]"
                data-testid="hero-title"
              >
                {activeCollection.title}
              </p>
              <p className="max-w-[34rem] text-[0.98rem] leading-7 text-white/78 sm:text-[1.02rem]">
                {site.homeIntro}
              </p>
            </div>

            <div className="pointer-events-auto flex flex-col gap-6 lg:items-end">
              <p className="max-w-[22rem] text-[0.95rem] leading-6 text-white/72 lg:text-right">
                {activeCollection.intro}
              </p>
              <p className="text-[0.92rem] uppercase tracking-[0.24em] text-white/70">Scroll</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1720px] px-4 pb-6 pt-8 sm:px-6 lg:px-10 lg:pb-10 lg:pt-10">
        <div className="quiet-rule pt-6 lg:pt-8">
          <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:gap-12">
            <p className="max-w-[7ch] font-serif text-[clamp(4rem,11vw,9rem)] leading-[0.84] tracking-[-0.07em] text-[var(--color-ink)]">
              {site.siteTitle}
            </p>
            <div className="grid gap-6 self-end lg:grid-cols-[0.55fr_0.45fr] lg:items-end">
              <p className="max-w-[32rem] text-[clamp(1.05rem,1.35vw,1.4rem)] leading-[1.8] text-[var(--color-muted)]">
                {site.siteDescription}
              </p>
              <Link
                className="w-fit border border-[var(--color-line)] px-4 py-3 text-[0.78rem] uppercase tracking-[0.24em] text-[var(--color-ink)] transition duration-300 hover:border-[var(--color-muted)] hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
                href="/contact"
              >
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-12 lg:gap-x-6 lg:gap-y-8">
          {dedupedReelItems.map((item, index) => (
            <Link
              key={`${item.href}-${index}`}
              className={`group block ${getWallSpanClass(index)} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]`}
              href={item.href}
            >
              <div className="overflow-hidden bg-[var(--color-surface)] shadow-[0_18px_48px_var(--color-shadow)]">
                <ProportionalImage
                  alt={item.alt}
                  className="scene-image h-auto w-full transition duration-700 group-hover:scale-[1.018] motion-reduce:transition-none"
                  height={item.height}
                  sizes="(max-width: 768px) 92vw, (max-width: 1280px) 48vw, 32vw"
                  src={item.imageUrl}
                  width={item.width}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1720px] px-4 pt-16 sm:px-6 lg:px-10 lg:pt-24">
        <div className="quiet-rule pt-8 lg:pt-10">
          <div className="grid gap-8 lg:grid-cols-[0.56fr_0.44fr] lg:items-end">
            <p className="max-w-[15ch] font-serif text-[clamp(2.8rem,5vw,5.8rem)] leading-[0.9] tracking-[-0.06em] text-[var(--color-ink)]">
              A slower edit of light, transit, and weather.
            </p>
            <div className="flex flex-col gap-5">
              <p className="max-w-[26rem] text-[1rem] leading-7 text-[var(--color-muted)]">
                For editorial use, commissions, and print conversations, step into the contact page.
              </p>
              <Link
                className="w-fit text-[0.82rem] uppercase tracking-[0.26em] text-[var(--color-ink)] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
                href="/contact"
              >
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
