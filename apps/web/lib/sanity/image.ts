import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { sanityClient } from "@/lib/sanity/client";

const builder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: SanityImageSource, width = 1600) {
  return builder.image(source).width(width).fit("max").auto("format").url();
}
