import type {
  AboutPageData,
  CollectionCard,
  CollectionPageData,
  HomePageData,
  PhotoPageData,
  PhotoSummary,
  SiteSettings,
} from "@/types/content";

const COLLECTIONS: CollectionPageData[] = [
  {
    aspectRatio: 0.8,
    coverAlt: "Muted dusk skyline over the Han River",
    coverImageUrl: "/placeholders/seoul-evenings-cover.svg",
    height: 2000,
    intro:
      "A study in sodium light, reflected glass, and the quiet between trains and river crossings.",
    orientation: "portrait",
    photoCount: 3,
    photos: [
      {
        alt: "Apartment towers catching the last cool blue light",
        aspectRatio: 1.5,
        captionShort: "Blue hour flattening the city into calm geometry.",
        height: 1200,
        imageUrl: "/placeholders/seoul-evenings-01.svg",
        locationLabel: "Mapo",
        orientation: "landscape",
        shotDate: "2025-10-12",
        slug: "han-river-blue-hour",
        title: "Han River Blue Hour",
        width: 1800,
      },
      {
        alt: "Subway platform lit by warm fluorescent fixtures",
        aspectRatio: 0.8,
        captionShort: "A pocket of stillness before the last fast train.",
        height: 1500,
        imageUrl: "/placeholders/seoul-evenings-02.svg",
        locationLabel: "Gongdeok",
        orientation: "portrait",
        shotDate: "2025-10-14",
        slug: "last-train-platform",
        title: "Last Train Platform",
        width: 1200,
      },
      {
        alt: "Pedestrian bridge with olive-toned city reflections",
        aspectRatio: 1.5,
        captionShort: "Steel, river haze, and a small current of people.",
        height: 1200,
        imageUrl: "/placeholders/seoul-evenings-03.svg",
        locationLabel: "Yeouido",
        orientation: "landscape",
        shotDate: "2025-10-17",
        slug: "bridge-reflections",
        title: "Bridge Reflections",
        width: 1800,
      },
    ],
    slug: "seoul-evenings",
    title: "Seoul Evenings",
    width: 1600,
  },
  {
    aspectRatio: 0.8,
    coverAlt: "A winter tram interior rendered in pale morning light",
    coverImageUrl: "/placeholders/winter-transit-cover.svg",
    height: 2000,
    intro:
      "Cold windows, compressed air, and small gestures that make movement feel intimate.",
    orientation: "portrait",
    photoCount: 3,
    photos: [
      {
        alt: "Frosted tram window with soft light bleeding through",
        aspectRatio: 0.8,
        captionShort: "The city arriving slowly through condensation.",
        height: 1500,
        imageUrl: "/placeholders/winter-transit-01.svg",
        locationLabel: "Line 2",
        orientation: "portrait",
        shotDate: "2025-12-02",
        slug: "condensation-window",
        title: "Condensation Window",
        width: 1200,
      },
      {
        alt: "Transit card reader and gloved hand in steel light",
        aspectRatio: 1,
        captionShort: "A mechanical gesture repeated a thousand times a day.",
        height: 1400,
        imageUrl: "/placeholders/winter-transit-02.svg",
        locationLabel: "City Hall",
        orientation: "square",
        shotDate: "2025-12-05",
        slug: "fare-beep",
        title: "Fare Beep",
        width: 1400,
      },
      {
        alt: "Empty carriage aisle with muted olive seats",
        aspectRatio: 1.5,
        captionShort: "The quiet luxury of arriving before everyone else.",
        height: 1200,
        imageUrl: "/placeholders/winter-transit-03.svg",
        locationLabel: "Early Service",
        orientation: "landscape",
        shotDate: "2025-12-08",
        slug: "first-carriage",
        title: "First Carriage",
        width: 1800,
      },
    ],
    slug: "winter-transit",
    title: "Winter Transit",
    width: 1600,
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", url: "https://instagram.com" },
  { label: "Email", url: "mailto:hello@example.com" },
];

export function getMockCollections(): CollectionCard[] {
  return COLLECTIONS.map(({ aspectRatio, coverAlt, coverImageUrl, height, intro, orientation, photoCount, slug, title, width }) => ({
    aspectRatio,
    coverAlt,
    coverImageUrl,
    height,
    intro,
    orientation,
    photoCount,
    slug,
    title,
    width,
  }));
}

export function getMockCollectionBySlug(slug: string): CollectionPageData | undefined {
  return COLLECTIONS.find((collection) => collection.slug === slug);
}

export function getMockPhotoBySlug(slug: string): PhotoPageData | undefined {
  for (const collection of COLLECTIONS) {
    const index = collection.photos.findIndex((photo) => photo.slug === slug);

    if (index >= 0) {
      const photo = collection.photos[index];
      const previousPhoto = index > 0 ? collection.photos[index - 1] : undefined;
      const nextPhoto = index < collection.photos.length - 1 ? collection.photos[index + 1] : undefined;

      return {
        ...photo,
        collection: {
          slug: collection.slug,
          title: collection.title,
        },
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
}

export function getMockSiteSettings(): SiteSettings {
  return {
    contactEmail: "hello@example.com",
    featuredCollections: getMockCollections(),
    homeIntro:
      "A personal edit of city light, transit rhythm, and quiet architectural moments. Short stories, sparse captions, and just enough structure to let the images breathe.",
    siteDescription:
      "A curated personal photography gallery with collection-led storytelling and restrained editorial design.",
    siteTitle: "VLUU",
    socialLinks: SOCIAL_LINKS,
  };
}

export function getMockAboutPage(): AboutPageData {
  return {
    body: [
      "I photograph cities the way some people keep journals: by returning to the same routes until minor differences start to matter.",
      "Most of the images here come from ordinary transit, evening walks, and weather shifts. The goal is not spectacle but clarity.",
    ],
    intro: "Small movements, quiet infrastructure, and the textures of routine.",
    portraitAlt: "Abstract placeholder portrait block",
    portraitImageUrl: "/placeholders/portrait.svg",
    title: "About",
  };
}

export function getMockHomePageData(): HomePageData {
  const site = getMockSiteSettings();

  return {
    heroCollection: site.featuredCollections[0],
    latestCollection: site.featuredCollections[1],
    site,
  };
}

export function getMockCollectionSlugs(): string[] {
  return COLLECTIONS.map((collection) => collection.slug);
}

export function getMockPhotoSlugs(): string[] {
  return COLLECTIONS.flatMap((collection) => collection.photos.map((photo) => photo.slug));
}

export function getMockCollectionSlugForPhoto(photoSlug: string): string | undefined {
  return COLLECTIONS.find((collection) =>
    collection.photos.some((photo) => photo.slug === photoSlug),
  )?.slug;
}

export function getMockOrderedPhotos(): PhotoSummary[] {
  return COLLECTIONS.flatMap((collection) => collection.photos);
}
