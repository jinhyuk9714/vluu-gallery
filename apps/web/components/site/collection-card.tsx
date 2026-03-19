import Image from "next/image";
import Link from "next/link";

import type { CollectionCard as CollectionCardProps } from "@/types/content";

export function CollectionCard({
  coverAlt,
  coverImageUrl,
  index = 0,
  slug,
  title,
}: CollectionCardProps & { index?: number }) {
  const isTall = index % 4 === 3;

  return (
    <article className={`group ${isTall ? "lg:row-span-2" : ""}`}>
      <Link
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
        href={`/collections/${slug}`}
      >
        <div className="overflow-hidden bg-[var(--color-surface)]">
          <div className={`relative overflow-hidden ${isTall ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
            <Image
              alt={coverAlt}
              className="object-cover transition duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 46vw, 24vw"
              src={coverImageUrl}
            />
          </div>
        </div>
        <div className="pt-2 text-[clamp(1rem,1.25vw,1.25rem)] leading-[1.08] text-[var(--color-ink)]">
          <p className="uppercase">{title}</p>
          <p className="uppercase">View Collection</p>
        </div>
      </Link>
    </article>
  );
}
