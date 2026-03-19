import Link from "next/link";

import { ProportionalImage } from "@/components/site/proportional-image";
import type { CollectionCard as CollectionCardProps } from "@/types/content";

export function CollectionCard({
  coverAlt,
  coverImageUrl,
  height,
  slug,
  title,
  width,
}: CollectionCardProps) {
  return (
    <article className="group">
      <Link
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
        href={`/collections/${slug}`}
      >
        <div className="overflow-hidden bg-[var(--color-surface)]">
          <ProportionalImage
            alt={coverAlt}
            className="h-auto w-full transition duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            height={height}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 46vw, 24vw"
            src={coverImageUrl}
            width={width}
          />
        </div>
        <div className="pt-2 text-[clamp(1rem,1.25vw,1.25rem)] leading-[1.08] text-[var(--color-ink)]">
          <p className="uppercase">{title}</p>
          <p className="uppercase">View Collection</p>
        </div>
      </Link>
    </article>
  );
}
