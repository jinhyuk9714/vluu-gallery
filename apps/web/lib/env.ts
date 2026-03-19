import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_STUDIO_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  SANITY_REVALIDATE_SECRET: z.string().optional(),
});

export interface AppEnv {
  isSanityConfigured: boolean;
  revalidateSecret?: string;
  sanityDataset: string;
  sanityProjectId?: string;
  siteUrl: string;
  studioUrl: string;
}

export function parseAppEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const parsed = envSchema.parse(source);
  const sanityProjectId = parsed.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const sanityDataset = parsed.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const studioUrl =
    parsed.NEXT_PUBLIC_SANITY_STUDIO_URL ??
    "https://personal-gallery.sanity.studio";
  const siteUrl = parsed.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    isSanityConfigured: Boolean(sanityProjectId && parsed.NEXT_PUBLIC_SANITY_DATASET),
    revalidateSecret: parsed.SANITY_REVALIDATE_SECRET,
    sanityDataset,
    sanityProjectId,
    siteUrl,
    studioUrl,
  };
}

