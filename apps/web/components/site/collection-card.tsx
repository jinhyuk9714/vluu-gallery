import Image from "next/image";
import Link from "next/link";

import type { CollectionCard as CollectionCardProps } from "@/types/content";

export function CollectionCard({ coverAlt, coverImageUrl, intro, photoCount, slug, title }: CollectionCardProps) {
  return (
    <article className="group space-y-4">
      <Link
        className="block overflow-hidden bg-[color:var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
        href={`/collections/${slug}`}
      >
        <div className="relative aspect-[4/5]">
          <Image
            alt={coverAlt}
            className="object-cover transition duration-300 group-hover:scale-[1.015]"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={coverImageUrl}
          />
        </div>
      </Link>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-serif text-2xl text-[color:var(--color-ink)]">
            <Link
              className="transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
              href={`/collections/${slug}`}
            >
              {title}
            </Link>
          </h3>
          <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            {photoCount} frames
          </span>
        </div>
        <p className="max-w-lg text-sm leading-7 text-[color:var(--color-muted)]">{intro}</p>
      </div>
    </article>
  );
}
