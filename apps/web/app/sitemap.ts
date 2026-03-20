import type { MetadataRoute } from "next";

import { getPhotoSlugs, getSiteOrigin } from "@/lib/sanity/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const photoSlugs = await getPhotoSlugs();
  const siteOrigin = getSiteOrigin();

  return [
    "",
    "/about",
    "/contact",
    ...photoSlugs.map((slug) => `/photo/${slug}`),
  ].map((path) => ({
    lastModified: new Date(),
    url: `${siteOrigin}${path}`,
  }));
}
