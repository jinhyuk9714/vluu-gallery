import Image from "next/image";
import Link from "next/link";

import type { CollectionCard as CollectionCardProps } from "@/types/content";

export function CollectionCard({
  coverAlt,
  coverImageUrl,
  index = 0,
  intro,
  photoCount,
  slug,
  title,
  variant = "stack",
}: CollectionCardProps & { index?: number; variant?: "stack" | "sequence" }) {
  const isEven = index % 2 === 0;
  const frameLabel = String(index + 1).padStart(2, "0");
  const sequenceGridClass = isEven
    ? "grid gap-5 lg:items-end lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.52fr)]"
    : "grid gap-5 lg:items-end lg:grid-cols-[minmax(18rem,0.52fr)_minmax(0,1.2fr)]";
  const mediaPaneClass = isEven ? "lg:order-1" : "lg:order-2";
  const copyPaneClass = isEven
    ? "flex flex-col gap-6 border-t border-[var(--color-line)] pt-5 lg:order-2 lg:min-h-[16rem] lg:justify-between lg:border-t-0 lg:pt-0 lg:pl-4"
    : "flex flex-col gap-6 border-t border-[var(--color-line)] pt-5 lg:order-1 lg:min-h-[16rem] lg:justify-between lg:border-t-0 lg:pt-0 lg:pr-4";

  if (variant === "sequence") {
    return (
      <article className="group">
        <Link
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
          href={`/collections/${slug}`}
        >
          <div className={sequenceGridClass}>
            <div className={mediaPaneClass}>
              <div className="relative overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_30px_90px_rgba(17,17,17,0.12)]">
                <div className="relative aspect-[16/11] min-h-[22rem]">
                  <Image
                    alt={coverAlt}
                    className="object-cover transition duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                    fill
                    sizes="(max-width: 1024px) 100vw, 74vw"
                    src={coverImageUrl}
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-[rgba(17,17,17,0.82)] via-[rgba(17,17,17,0.22)] to-transparent p-5 text-[var(--color-background)] sm:p-7">
                  <div className="space-y-2">
                    <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/68">
                      Sequence {frameLabel}
                    </p>
                    <h3 className="max-w-2xl font-serif text-[clamp(2.8rem,5vw,5.8rem)] leading-[0.86]">
                      {title}
                    </h3>
                  </div>
                  <span className="shrink-0 text-[0.68rem] uppercase tracking-[0.34em] text-white/72">
                    {photoCount} frames
                  </span>
                </div>
              </div>
            </div>

            <div className={copyPaneClass}>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.38em] text-[var(--color-steel)]">
                  All sequences
                </p>
                <p className="max-w-sm text-sm leading-7 text-[var(--color-muted)]">
                  {intro}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-[var(--color-ink)]">
                <span>Open</span>
                <span aria-hidden="true">→</span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group">
      <Link
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
        href={`/collections/${slug}`}
      >
        <div className="overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(17,17,17,0.08)]">
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-surface)]">
            <Image
              alt={coverAlt}
              className="object-cover transition duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              src={coverImageUrl}
            />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 text-[var(--color-background)]">
              <span className="rounded-full border border-white/25 bg-[rgba(17,17,17,0.44)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.3em]">
                {frameLabel}
              </span>
              <span className="rounded-full border border-white/25 bg-[rgba(17,17,17,0.44)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.3em]">
                {photoCount} frames
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.38em] text-[var(--color-steel)]">
                Sequence
              </p>
              <h3 className="max-w-lg font-serif text-[clamp(2.2rem,3.4vw,4.4rem)] leading-[0.9] text-[var(--color-ink)]">
                {title}
              </h3>
              <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
                {intro}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[var(--color-line)] pt-5 text-sm uppercase tracking-[0.22em] text-[var(--color-ink)]">
              <span>Open sequence</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
