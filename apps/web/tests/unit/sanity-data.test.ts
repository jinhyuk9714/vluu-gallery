import { describe, expect, it } from "vitest";

import { getMockPhotoBySlug } from "@/lib/mock-data";
import { normalizeAboutPage, normalizeCollection } from "@/lib/sanity/data";

describe("sanity data normalization", () => {
  it("derives photo dimensions and orientation from image metadata", () => {
    const collection = normalizeCollection({
      intro: "Window studies from a moving train.",
      photos: [
        {
          alt: "Tower framed by a train window.",
          image: {
            asset: { _ref: "image-sample-900x1600-jpg" },
            dimensions: { aspectRatio: 0.5625, height: 1600, width: 900 },
          },
          slug: "tower-window",
          title: "Tower Window",
        },
      ],
      slug: "window-lines",
      title: "Window Lines",
    });

    expect(collection.photos[0]?.orientation).toBe("portrait");
    expect(collection.photos[0]?.aspectRatio).toBeCloseTo(0.5625);
    expect(collection.photos[0]?.height).toBe(1600);
    expect(collection.photos[0]?.width).toBe(900);
  });

  it("does not synthesize image orientation when dimensions are missing", () => {
    const collection = normalizeCollection({
      intro: "Window studies from a moving train.",
      photos: [
        {
          alt: "Tower framed by a train window.",
          image: {
            asset: { _ref: "image-sample-900x1600-jpg" },
          },
          slug: "tower-window",
          title: "Tower Window",
        },
      ],
      slug: "window-lines",
      title: "Window Lines",
    });

    expect(collection.photos[0]?.orientation).toBeUndefined();
    expect(collection.photos[0]?.aspectRatio).toBeUndefined();
    expect(collection.photos[0]?.height).toBeUndefined();
    expect(collection.photos[0]?.width).toBeUndefined();
  });

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

  it("uses a global photo sequence and removes public collection context", () => {
    const firstWinterPhoto = getMockPhotoBySlug("condensation-window");

    expect(firstWinterPhoto?.previousPhoto).toEqual({
      slug: "bridge-reflections",
      title: "Bridge Reflections",
    });
    expect(firstWinterPhoto?.nextPhoto).toEqual({
      slug: "fare-beep",
      title: "Fare Beep",
    });
    expect(firstWinterPhoto).not.toHaveProperty("collection");
  });
});
