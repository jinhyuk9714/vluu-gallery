export type RevalidatePayload = {
  _type?: string;
  collectionSlug?: string;
  slug?: string | { current?: string };
};

function normalizeSlug(slug?: string | { current?: string }) {
  if (!slug) return undefined;
  return typeof slug === "string" ? slug : slug.current;
}

export function resolveRevalidationTargets(payload: RevalidatePayload) {
  const slug = normalizeSlug(payload.slug);

  switch (payload._type) {
    case "siteSettings":
      return ["/", "/about", "/contact"];
    case "aboutPage":
      return ["/about"];
    case "collection":
      return ["/"];
    case "photo":
      return slug ? [`/photo/${slug}`, "/"] : [];
    default:
      return [];
  }
}
