import type { MetadataRoute } from "next";

import { getSiteOrigin } from "@/lib/sanity/data";

export default function robots(): MetadataRoute.Robots {
  return {
    host: getSiteOrigin(),
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: `${getSiteOrigin()}/sitemap.xml`,
  };
}

