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
      studioUrl: "https://personal-gallery.sanity.studio",
    });
  });

  it("marks sanity as configured only when project and dataset exist", () => {
    expect(
      parseAppEnv({
        NEXT_PUBLIC_SANITY_DATASET: "production",
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
});

