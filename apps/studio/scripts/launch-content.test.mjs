import assert from "node:assert/strict";
import test from "node:test";

import {
  LaunchManifestError,
  buildLaunchImportPlan,
  readLaunchManifestFromFile,
  validateLaunchManifest,
} from "./launch-content.mjs";

function expectLaunchIssues(fn, expectedIssues) {
  assert.throws(fn, (error) => {
    assert.ok(error instanceof LaunchManifestError);

    for (const issue of expectedIssues) {
      assert.match(error.message, issue);
    }

    return true;
  });
}

test("readLaunchManifestFromFile parses JSON", () => {
  const manifest = readLaunchManifestFromFile(
    new URL("./fixtures/manifest.json", import.meta.url),
  );

  assert.equal(manifest.collections.length, 1);
  assert.equal(manifest.collections[0].slug, "seoul-evenings");
  assert.equal(manifest.siteSettings.socialLinks[0].label, "Instagram");
});

test("validateLaunchManifest reports duplicate slugs", () => {
  const manifest = {
    aboutPage: {
      body: ["One paragraph"],
      intro: "Intro",
      portraitAlt: "Portrait alt",
      portraitFile: "about/portrait.jpg",
      title: "About",
    },
    collections: [
      {
        coverAlt: "Cover alt",
        coverFile: "collections/alpha/cover.jpg",
        intro: "Alpha intro",
        photos: [
          {
            alt: "Alpha photo alt",
            captionShort: "Alpha caption",
            file: "collections/alpha/one.jpg",
            slug: "shared-photo",
            title: "Alpha One",
          },
        ],
        slug: "alpha",
        title: "Alpha",
      },
      {
        coverAlt: "Cover alt",
        coverFile: "collections/beta/cover.jpg",
        intro: "Beta intro",
        photos: [
          {
            alt: "Beta photo alt",
            captionShort: "Beta caption",
            file: "collections/beta/one.jpg",
            slug: "shared-photo",
            title: "Beta One",
          },
        ],
        slug: "beta",
        title: "Beta",
      },
    ],
    siteSettings: {
      contactEmail: "hello@example.com",
      featuredCollections: ["beta", "alpha"],
      homeIntro: "Home intro",
      siteDescription: "Site description",
      siteTitle: "Gallery",
      socialLinks: [],
    },
  };

  expectLaunchIssues(() => validateLaunchManifest(manifest), [/Duplicate slug/i]);
});

test("validateLaunchManifest reports missing alt and caption text", () => {
  const manifest = {
    aboutPage: {
      body: ["One paragraph"],
      intro: "Intro",
      portraitAlt: "Portrait alt",
      portraitFile: "about/portrait.jpg",
      title: "About",
    },
    collections: [
      {
        coverAlt: "Cover alt",
        coverFile: "collections/alpha/cover.jpg",
        intro: "Alpha intro",
        photos: [
          {
            alt: "",
            captionShort: "",
            file: "collections/alpha/one.jpg",
            slug: "alpha-photo",
            title: "Alpha One",
          },
        ],
        slug: "alpha",
        title: "Alpha",
      },
    ],
    siteSettings: {
      contactEmail: "hello@example.com",
      featuredCollections: ["alpha"],
      homeIntro: "Home intro",
      siteDescription: "Site description",
      siteTitle: "Gallery",
      socialLinks: [],
    },
  };

  expectLaunchIssues(
    () => validateLaunchManifest(manifest),
    [/collections\[0\]\.photos\[0\]\.alt is required/i, /captionShort is required/i],
  );
});

test("validateLaunchManifest reports invalid contact details", () => {
  const manifest = {
    aboutPage: {
      body: ["One paragraph"],
      intro: "Intro",
      title: "About",
    },
    collections: [
      {
        coverAlt: "Cover alt",
        coverFile: "collections/alpha/cover.jpg",
        intro: "Alpha intro",
        photos: [
          {
            alt: "Alpha photo alt",
            captionShort: "Alpha caption",
            file: "collections/alpha/one.jpg",
            slug: "alpha-photo",
            title: "Alpha One",
          },
        ],
        slug: "alpha",
        title: "Alpha",
      },
    ],
    siteSettings: {
      contactEmail: "not-an-email",
      featuredCollections: ["alpha"],
      homeIntro: "Home intro",
      siteDescription: "Site description",
      siteTitle: "Gallery",
      socialLinks: [{ label: "Instagram", url: "instagram-dot-com/example" }],
    },
  };

  expectLaunchIssues(() => validateLaunchManifest(manifest), [
    /contactEmail must be a valid email address/i,
    /socialLinks\[0\]\.url must be a valid URL/i,
  ]);
});

test("buildLaunchImportPlan preserves collection and featured order", () => {
  const manifest = {
    aboutPage: {
      body: ["One paragraph"],
      intro: "Intro",
      portraitAlt: "Portrait alt",
      portraitFile: "about/portrait.jpg",
      title: "About",
    },
    collections: [
      {
        coverAlt: "Cover alt",
        coverFile: "collections/first/cover.jpg",
        intro: "First intro",
        photos: [
          {
            alt: "First one alt",
            captionShort: "First caption one",
            file: "collections/first/one.jpg",
            locationLabel: "Mapo",
            shotDate: "2025-10-01",
            slug: "first-1",
            title: "First One",
          },
          {
            alt: "First two alt",
            captionShort: "First caption two",
            file: "collections/first/two.jpg",
            locationLabel: "Yeouido",
            shotDate: "2025-10-02",
            slug: "first-2",
            title: "First Two",
          },
        ],
        slug: "first",
        title: "First",
      },
      {
        coverAlt: "Cover alt",
        coverFile: "collections/second/cover.jpg",
        intro: "Second intro",
        photos: [
          {
            alt: "Second one alt",
            captionShort: "Second caption one",
            file: "collections/second/one.jpg",
            locationLabel: "Gongdeok",
            shotDate: "2025-10-03",
            slug: "second-1",
            title: "Second One",
          },
        ],
        slug: "second",
        title: "Second",
      },
    ],
    siteSettings: {
      contactEmail: "hello@example.com",
      featuredCollections: ["second", "first"],
      homeIntro: "Home intro",
      siteDescription: "Site description",
      siteTitle: "Gallery",
      socialLinks: [
        { label: "Instagram", url: "https://instagram.com/example" },
      ],
    },
  };

  const plan = buildLaunchImportPlan(manifest, {
    projectId: "project",
    sourceDir: new URL("./fixtures", import.meta.url),
  });

  assert.deepEqual(
    plan.collections.map((collection) => collection.slug),
    ["first", "second"],
  );
  assert.deepEqual(plan.featuredCollections, ["second", "first"]);
  assert.deepEqual(
    plan.collections[0].photos.map((photo) => photo.slug),
    ["first-1", "first-2"],
  );
  assert.deepEqual(plan.collections[0].photos[0].shotDate, "2025-10-01");
  assert.deepEqual(plan.collections[0].photos[0].locationLabel, "Mapo");
  assert.deepEqual(plan.siteSettings.socialLinks, [
    { label: "Instagram", url: "https://instagram.com/example" },
  ]);
});

test("buildLaunchImportPlan reports missing files in staged launch content", () => {
  const manifest = {
    aboutPage: {
      body: ["One paragraph"],
      intro: "Intro",
      title: "About",
    },
    collections: [
      {
        coverAlt: "Cover alt",
        coverFile: "collections/first/missing-cover.jpg",
        intro: "First intro",
        photos: [
          {
            alt: "First one alt",
            captionShort: "First caption one",
            file: "collections/first/missing-photo.jpg",
            slug: "first-1",
            title: "First One",
          },
        ],
        slug: "first",
        title: "First",
      },
    ],
    siteSettings: {
      contactEmail: "hello@example.com",
      featuredCollections: ["first"],
      homeIntro: "Home intro",
      siteDescription: "Site description",
      siteTitle: "Gallery",
      socialLinks: [],
    },
  };

  expectLaunchIssues(
    () =>
      buildLaunchImportPlan(manifest, {
        sourceDir: new URL("./fixtures", import.meta.url),
      }),
    [/missing-cover\.jpg/i, /missing-photo\.jpg/i],
  );
});
