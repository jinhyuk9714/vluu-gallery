import { describe, expect, it } from "vitest";

import { resolveRevalidationTargets } from "@/lib/revalidate";

describe("resolveRevalidationTargets", () => {
  it("maps site settings to global routes", () => {
    expect(resolveRevalidationTargets({ _type: "siteSettings" })).toEqual(["/", "/about", "/contact"]);
  });

  it("maps about content updates to the about route", () => {
    expect(resolveRevalidationTargets({ _type: "aboutPage" })).toEqual(["/about"]);
  });

  it("maps collection updates to the homepage", () => {
    expect(
      resolveRevalidationTargets({ _type: "collection", slug: { current: "winter-transit" } }),
    ).toEqual(["/"]);
  });

  it("maps photo updates to the photo route and homepage", () => {
    expect(
      resolveRevalidationTargets({
        _type: "photo",
        collectionSlug: "seoul-evenings",
        slug: "bridge-reflections",
      }),
    ).toEqual(["/photo/bridge-reflections", "/"]);
  });
});
