export type PhotoOrientation = "landscape" | "portrait" | "square";

export interface SocialLink {
  label: string;
  url: string;
}

export interface CollectionCard {
  coverAlt: string;
  coverImageUrl: string;
  intro: string;
  photoCount: number;
  slug: string;
  title: string;
}

export interface PhotoSummary {
  alt: string;
  captionShort: string;
  imageUrl: string;
  locationLabel?: string;
  orientation: PhotoOrientation;
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
  collection: Pick<CollectionCard, "slug" | "title">;
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

