import { HomeScene } from "@/components/site/home-scene";
import { getCollectionBySlug, getHomePageData } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  description: "A stark overview of VLUU, arranged as selected photographic sequences.",
  imagePath: "/placeholders/seoul-evenings-cover.svg",
  pathname: "/",
  title: "Overview | VLUU",
});

export default async function HomePage() {
  const { heroCollection, latestCollection, site } = await getHomePageData();
  const featuredCollections = await Promise.all(
    site.featuredCollections.map(async (collection) => {
      const detailedCollection = await getCollectionBySlug(collection.slug);
      return detailedCollection;
    }),
  );
  const resolvedCollections = featuredCollections.filter(
    (collection): collection is NonNullable<typeof collection> => Boolean(collection),
  );
  const fallbackCollections = [
    await getCollectionBySlug(heroCollection.slug),
    await getCollectionBySlug(latestCollection.slug),
  ].filter((collection): collection is NonNullable<typeof collection> => Boolean(collection));
  const collectionsForScene = resolvedCollections.length > 0 ? resolvedCollections : fallbackCollections;
  const reelItems = collectionsForScene.flatMap((collection) => [
    {
      alt: collection.coverAlt,
      href: `/collections/${collection.slug}`,
      imageUrl: collection.coverImageUrl,
      orientation: "landscape" as const,
    },
    ...collection.photos.map((photo) => ({
      alt: photo.alt,
      href: `/photo/${photo.slug}`,
      imageUrl: photo.imageUrl,
      orientation: photo.orientation,
    })),
  ]);

  return (
    <HomeScene
      featuredCollections={collectionsForScene}
      reelItems={reelItems}
      site={site}
    />
  );
}
