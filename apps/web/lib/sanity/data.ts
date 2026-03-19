import { cache } from "react";

import { parseAppEnv } from "@/lib/env";
import {
  getMockAboutPage,
  getMockCollectionBySlug,
  getMockCollectionSlugForPhoto,
  getMockCollectionSlugs,
  getMockCollections,
  getMockHomePageData,
  getMockPhotoBySlug,
  getMockPhotoSlugs,
  getMockSiteSettings,
} from "@/lib/mock-data";
import { isSanityConfigured, sanityClient } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import {
  aboutPageQuery,
  collectionsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import type {
  AboutPageData,
  CollectionCard,
  CollectionPageData,
  HomePageData,
  PhotoPageData,
  PhotoOrientation,
  SiteSettings,
} from "@/types/content";

type RawSanityImage = {
  asset?: { _ref?: string };
  crop?: unknown;
  hotspot?: unknown;
};

type RawSiteSettings = {
  contactEmail?: string;
  featuredCollections?: Array<{
    coverAlt?: string;
    coverImage?: RawSanityImage;
    intro?: string;
    slug?: string;
    title?: string;
  }>;
  homeIntro?: string;
  siteDescription?: string;
  siteTitle?: string;
  socialLinks?: Array<{ label?: string; url?: string }>;
};

type RawCollection = {
  coverAlt?: string;
  coverImage?: RawSanityImage;
  intro?: string;
  photos?: Array<{
    alt?: string;
    captionShort?: string;
    image?: RawSanityImage;
    locationLabel?: string;
    shotDate?: string;
    slug?: string;
    title?: string;
  }>;
  slug?: string;
  title?: string;
};

type RawAboutPage = {
  body?: Array<{
    children?: Array<{ text?: string }>;
  }>;
  intro?: string;
  portraitAlt?: string;
  portraitImage?: RawSanityImage;
  title?: string;
};

export function normalizeCollection(raw: RawCollection): CollectionPageData {
  const normalizedPhotos = raw.photos?.map((photo, index) => {
    const orientation: PhotoOrientation =
      index % 3 === 0 ? "landscape" : index % 3 === 1 ? "portrait" : "square";

    return {
      alt: photo.alt ?? photo.title ?? "Gallery image",
      captionShort: photo.captionShort ?? "",
      imageUrl: photo.image ? urlForImage(photo.image, 1800) : "/placeholders/seoul-evenings-01.svg",
      locationLabel: photo.locationLabel,
      orientation,
      shotDate: photo.shotDate,
      slug: photo.slug ?? `photo-${index}`,
      title: photo.title ?? "Untitled",
    };
  }) ?? [];

  return {
    coverAlt: raw.coverAlt ?? (raw.title ? `${raw.title} cover image` : "Collection cover image"),
    coverImageUrl: raw.coverImage
      ? urlForImage(raw.coverImage, 1800)
      : "/placeholders/winter-transit-cover.svg",
    intro: raw.intro ?? "",
    photoCount: normalizedPhotos.length,
    photos: normalizedPhotos,
    slug: raw.slug ?? "untitled-collection",
    title: raw.title ?? "Untitled Collection",
  };
}

export function normalizeSiteSettings(raw: RawSiteSettings): SiteSettings {
  return {
    contactEmail: raw.contactEmail ?? "hello@example.com",
    featuredCollections:
      raw.featuredCollections?.map((collection, index) => ({
        coverAlt: collection.coverAlt ?? `${collection.title ?? "Collection"} cover image`,
        coverImageUrl: collection.coverImage
          ? urlForImage(collection.coverImage, 1600)
          : index % 2 === 0
            ? "/placeholders/seoul-evenings-cover.svg"
            : "/placeholders/winter-transit-cover.svg",
        intro: collection.intro ?? "",
        photoCount: 0,
        slug: collection.slug ?? `collection-${index}`,
        title: collection.title ?? "Untitled Collection",
      })) ?? [],
    homeIntro: raw.homeIntro ?? "",
    siteDescription: raw.siteDescription ?? "",
    siteTitle: raw.siteTitle ?? "VLUU",
    socialLinks:
      raw.socialLinks?.flatMap((link) =>
        link.label && link.url ? [{ label: link.label, url: link.url }] : [],
      ) ?? [],
  };
}

export function normalizeAboutPage(raw: RawAboutPage): AboutPageData {
  return {
    body:
      raw.body
        ?.map((block) =>
          block.children?.map((child) => child.text ?? "").join("").trim(),
        )
        .filter((paragraph): paragraph is string => Boolean(paragraph)) ?? [],
    intro: raw.intro ?? "",
    portraitAlt: raw.portraitImage
      ? raw.portraitAlt ?? (raw.title ? `${raw.title} portrait` : "Portrait image")
      : undefined,
    portraitImageUrl: raw.portraitImage ? urlForImage(raw.portraitImage, 1200) : undefined,
    title: raw.title ?? "About",
  };
}

const fetchCollectionsLive = cache(async () => {
  const rawCollections = await sanityClient.fetch<RawCollection[]>(collectionsQuery);
  return rawCollections.map(normalizeCollection);
});

const fetchSiteSettingsLive = cache(async () => {
  const rawSettings = await sanityClient.fetch<RawSiteSettings>(siteSettingsQuery);
  return normalizeSiteSettings(rawSettings);
});

const fetchAboutPageLive = cache(async () => {
  const rawAboutPage = await sanityClient.fetch<RawAboutPage>(aboutPageQuery);
  return normalizeAboutPage(rawAboutPage);
});

async function withFallback<T>(loader: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!isSanityConfigured) {
    return fallback();
  }

  return loader();
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return withFallback(fetchSiteSettingsLive, getMockSiteSettings);
}

export async function getCollections(): Promise<CollectionCard[]> {
  return withFallback(
    async () =>
      (await fetchCollectionsLive()).map((collection) => ({
        coverAlt: collection.coverAlt,
        coverImageUrl: collection.coverImageUrl,
        intro: collection.intro,
        photoCount: collection.photoCount,
        slug: collection.slug,
        title: collection.title,
      })),
    getMockCollections,
  );
}

export async function getCollectionBySlug(slug: string): Promise<CollectionPageData | undefined> {
  return withFallback(
    async () => (await fetchCollectionsLive()).find((collection) => collection.slug === slug),
    () => getMockCollectionBySlug(slug),
  );
}

export async function getPhotoBySlug(slug: string): Promise<PhotoPageData | undefined> {
  return withFallback(
    async () => {
      const collections = await fetchCollectionsLive();

      for (const collection of collections) {
        const index = collection.photos.findIndex((photo) => photo.slug === slug);
        if (index >= 0) {
          const photo = collection.photos[index];
          const previousPhoto = index > 0 ? collection.photos[index - 1] : undefined;
          const nextPhoto = index < collection.photos.length - 1 ? collection.photos[index + 1] : undefined;

          return {
            ...photo,
            collection: { slug: collection.slug, title: collection.title },
            nextPhoto: nextPhoto
              ? { slug: nextPhoto.slug, title: nextPhoto.title }
              : undefined,
            previousPhoto: previousPhoto
              ? { slug: previousPhoto.slug, title: previousPhoto.title }
              : undefined,
          };
        }
      }

      return undefined;
    },
    () => getMockPhotoBySlug(slug),
  );
}

export async function getHomePageData(): Promise<HomePageData> {
  return withFallback(
    async () => {
      const [site, collections] = await Promise.all([getSiteSettings(), getCollections()]);

      if (site.featuredCollections.length === 0) {
        throw new Error("siteSettings.featuredCollections must include at least one collection.");
      }

      const hydratedFeaturedCollections = site.featuredCollections.map((collection) => {
        const matchingCollection = collections.find((item) => item.slug === collection.slug);
        return matchingCollection ?? collection;
      });

      const heroCollection = hydratedFeaturedCollections[0];
      const latestCollection = hydratedFeaturedCollections[1] ?? heroCollection;

      if (!heroCollection) {
        throw new Error("siteSettings.featuredCollections must resolve to at least one collection.");
      }

      return {
        heroCollection,
        latestCollection,
        site: {
          ...site,
          featuredCollections: hydratedFeaturedCollections,
        },
      };
    },
    getMockHomePageData,
  );
}

export async function getAboutPage(): Promise<AboutPageData> {
  return withFallback(fetchAboutPageLive, getMockAboutPage);
}

export async function getCollectionSlugs(): Promise<string[]> {
  return withFallback(
    async () => (await fetchCollectionsLive()).map((collection) => collection.slug),
    getMockCollectionSlugs,
  );
}

export async function getPhotoSlugs(): Promise<string[]> {
  return withFallback(
    async () => (await fetchCollectionsLive()).flatMap((collection) =>
      collection.photos.map((photo) => photo.slug),
    ),
    getMockPhotoSlugs,
  );
}

export async function getCollectionSlugForPhoto(photoSlug: string): Promise<string | undefined> {
  return withFallback(
    async () =>
      (await fetchCollectionsLive()).find((collection) =>
        collection.photos.some((photo) => photo.slug === photoSlug),
      )?.slug,
    () => getMockCollectionSlugForPhoto(photoSlug),
  );
}

export function getSiteOrigin() {
  return parseAppEnv().siteUrl;
}
