import { describe, expect, it } from "vitest";

import { normalizeAboutPage, normalizeCollection } from "@/lib/sanity/data";

describe("sanity data normalization", () => {
  it("preserves authored collection cover alt text", () => {
    const collection = normalizeCollection({
      coverAlt: "Fog lifting over the first platform.",
      intro: "Transit at dawn.",
      photos: [],
      slug: "dawn-platform",
      title: "Dawn Platform",
    });

    expect(collection.coverAlt).toBe("Fog lifting over the first platform.");
  });

  it("does not synthesize a portrait when the about page is intentionally imageless", () => {
    const aboutPage = normalizeAboutPage({
      body: [{ children: [{ text: "A short note." }] }],
      intro: "Quiet routine and patient looking.",
      title: "About",
    });

    expect(aboutPage.portraitAlt).toBeUndefined();
    expect(aboutPage.portraitImageUrl).toBeUndefined();
  });

  it("preserves authored portrait alt text when a portrait image exists", () => {
    const aboutPage = normalizeAboutPage({
      body: [{ children: [{ text: "A short note." }] }],
      intro: "Quiet routine and patient looking.",
      portraitAlt: "Portrait beside a train window.",
      portraitImage: {
        asset: { _ref: "image-sample-1200x1500-jpg" },
      },
      title: "About",
    });

    expect(aboutPage.portraitAlt).toBe("Portrait beside a train window.");
    expect(aboutPage.portraitImageUrl).toContain("fit=max");
  });
});
