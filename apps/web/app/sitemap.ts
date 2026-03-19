import type { MetadataRoute } from "next";

import { getCollectionSlugs, getPhotoSlugs, getSiteOrigin } from "@/lib/sanity/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collectionSlugs, photoSlugs] = await Promise.all([
    getCollectionSlugs(),
    getPhotoSlugs(),
  ]);
  const siteOrigin = getSiteOrigin();

  return [
    "",
    "/collections",
    "/about",
    "/contact",
    ...collectionSlugs.map((slug) => `/collections/${slug}`),
    ...photoSlugs.map((slug) => `/photo/${slug}`),
  ].map((path) => ({
    lastModified: new Date(),
    url: `${siteOrigin}${path}`,
  }));
}

