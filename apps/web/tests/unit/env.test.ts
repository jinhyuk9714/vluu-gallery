import { describe, expect, it } from "vitest";

import { parseAppEnv } from "@/lib/env";

describe("parseAppEnv", () => {
  it("returns stable defaults when env is absent", () => {
    expect(parseAppEnv({})).toEqual({
      isSanityConfigured: false,
      revalidateSecret: undefined,
      sanityDataset: "production",
      sanityProjectId: undefined,
      siteUrl: "http://localhost:3000",
      studioUrl: undefined,
    });
  });

  it("marks sanity as configured when a project id exists, even if dataset uses the default", () => {
    expect(
      parseAppEnv({
        NEXT_PUBLIC_SANITY_PROJECT_ID: "abc12345",
        NEXT_PUBLIC_SANITY_STUDIO_URL: "https://studio.example.com",
        NEXT_PUBLIC_SITE_URL: "https://gallery.example.com",
        SANITY_REVALIDATE_SECRET: "secret",
      }),
    ).toEqual({
      isSanityConfigured: true,
      revalidateSecret: "secret",
      sanityDataset: "production",
      sanityProjectId: "abc12345",
      siteUrl: "https://gallery.example.com",
      studioUrl: "https://studio.example.com",
    });
  });

  it("treats blank env values as absent", () => {
    expect(
      parseAppEnv({
        NEXT_PUBLIC_SANITY_DATASET: "   ",
        NEXT_PUBLIC_SANITY_PROJECT_ID: "   ",
      }),
    ).toEqual({
      isSanityConfigured: false,
      revalidateSecret: undefined,
      sanityDataset: "production",
      sanityProjectId: undefined,
      siteUrl: "http://localhost:3000",
      studioUrl: undefined,
    });
  });

  it("falls back to the Vercel preview URL when NEXT_PUBLIC_SITE_URL is absent", () => {
    expect(
      parseAppEnv({
        NEXT_PUBLIC_SANITY_PROJECT_ID: "abc12345",
        VERCEL_ENV: "preview",
        VERCEL_URL: "vluu-gallery-git-launch-abc123.vercel.app",
      } as NodeJS.ProcessEnv),
    ).toEqual({
      isSanityConfigured: true,
      revalidateSecret: undefined,
      sanityDataset: "production",
      sanityProjectId: "abc12345",
      siteUrl: "https://vluu-gallery-git-launch-abc123.vercel.app",
      studioUrl: undefined,
    });
  });

  it("prefers the Vercel preview URL on preview deployments even when a production domain exists", () => {
    expect(
      parseAppEnv({
        NEXT_PUBLIC_SANITY_PROJECT_ID: "abc12345",
        VERCEL_ENV: "preview",
        VERCEL_PROJECT_PRODUCTION_URL: "vluu-gallery.vercel.app",
        VERCEL_URL: "vluu-gallery-git-launch-abc123.vercel.app",
      } as NodeJS.ProcessEnv),
    ).toEqual({
      isSanityConfigured: true,
      revalidateSecret: undefined,
      sanityDataset: "production",
      sanityProjectId: "abc12345",
      siteUrl: "https://vluu-gallery-git-launch-abc123.vercel.app",
      studioUrl: undefined,
    });
  });

  it("prefers the Vercel production URL when available", () => {
    expect(
      parseAppEnv({
        NEXT_PUBLIC_SANITY_PROJECT_ID: "abc12345",
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "vluu-gallery.vercel.app",
        VERCEL_URL: "vluu-gallery-git-launch-abc123.vercel.app",
      } as NodeJS.ProcessEnv),
    ).toEqual({
      isSanityConfigured: true,
      revalidateSecret: undefined,
      sanityDataset: "production",
      sanityProjectId: "abc12345",
      siteUrl: "https://vluu-gallery.vercel.app",
      studioUrl: undefined,
    });
  });
});
