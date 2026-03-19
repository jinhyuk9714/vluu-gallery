import { z } from "zod";

const optionalEnvString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional(),
);

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_DATASET: optionalEnvString,
  NEXT_PUBLIC_SANITY_PROJECT_ID: optionalEnvString,
  NEXT_PUBLIC_SANITY_STUDIO_URL: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().url().optional(),
  ),
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().url().optional(),
  ),
  SANITY_REVALIDATE_SECRET: optionalEnvString,
  VERCEL_ENV: optionalEnvString,
  VERCEL_PROJECT_PRODUCTION_URL: optionalEnvString,
  VERCEL_URL: optionalEnvString,
});

export interface AppEnv {
  isSanityConfigured: boolean;
  revalidateSecret?: string;
  sanityDataset: string;
  sanityProjectId?: string;
  siteUrl: string;
  studioUrl?: string;
}

export function parseAppEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const parsed = envSchema.parse(source);
  const sanityProjectId = parsed.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const sanityDataset = parsed.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const studioUrl = parsed.NEXT_PUBLIC_SANITY_STUDIO_URL;
  const vercelEnv = parsed.VERCEL_ENV;
  const vercelProductionUrl = parsed.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${parsed.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined;
  const vercelPreviewUrl = parsed.VERCEL_URL ? `https://${parsed.VERCEL_URL}` : undefined;
  const inferredVercelUrl =
    vercelEnv && vercelEnv !== "production"
      ? vercelPreviewUrl ?? vercelProductionUrl
      : vercelProductionUrl ?? vercelPreviewUrl;
  const siteUrl = parsed.NEXT_PUBLIC_SITE_URL ?? inferredVercelUrl ?? "http://localhost:3000";

  return {
    isSanityConfigured: Boolean(sanityProjectId),
    revalidateSecret: parsed.SANITY_REVALIDATE_SECRET,
    sanityDataset,
    sanityProjectId,
    siteUrl,
    studioUrl,
  };
}
