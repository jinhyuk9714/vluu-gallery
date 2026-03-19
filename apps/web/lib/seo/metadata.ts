import type { Metadata } from "next";

import { getSiteOrigin } from "@/lib/sanity/data";

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteOrigin()).toString();
}

export function buildMetadata(input: {
  description: string;
  imagePath?: string;
  pathname?: string;
  title: string;
}): Metadata {
  const url = absoluteUrl(input.pathname);
  const image = input.imagePath ? absoluteUrl(input.imagePath) : undefined;

  return {
    alternates: {
      canonical: url,
    },
    description: input.description,
    openGraph: {
      description: input.description,
      images: image ? [{ alt: input.title, url: image }] : undefined,
      title: input.title,
      type: "website",
      url,
    },
    title: input.title,
    twitter: {
      card: "summary_large_image",
      description: input.description,
      images: image ? [image] : undefined,
      title: input.title,
    },
  };
}

