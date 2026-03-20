export type PhotoOrientation = "landscape" | "portrait" | "square";

export interface ImageDimensions {
  aspectRatio?: number;
  height?: number;
  orientation?: PhotoOrientation;
  width?: number;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface CollectionCard extends ImageDimensions {
  coverAlt: string;
  coverImageUrl: string;
  intro: string;
  photoCount: number;
  slug: string;
  title: string;
}

export interface PhotoSummary extends ImageDimensions {
  alt: string;
  captionShort: string;
  imageUrl: string;
  locationLabel?: string;
  shotDate?: string;
  slug: string;
  title: string;
}

export interface CollectionPageData extends CollectionCard {
  photos: PhotoSummary[];
}

export interface PhotoNavItem {
  slug: string;
  title: string;
}

export interface PhotoPageData extends PhotoSummary {
  nextPhoto?: PhotoNavItem;
  previousPhoto?: PhotoNavItem;
}

export interface SiteSettings {
  contactEmail: string;
  featuredCollections: CollectionCard[];
  homeIntro: string;
  siteDescription: string;
  siteTitle: string;
  socialLinks: SocialLink[];
}

export interface AboutPageData {
  body: string[];
  intro: string;
  portraitAlt?: string;
  portraitImageUrl?: string;
  title: string;
}

export interface HomePageData {
  heroCollection: CollectionCard;
  latestCollection: CollectionCard;
  site: SiteSettings;
}
