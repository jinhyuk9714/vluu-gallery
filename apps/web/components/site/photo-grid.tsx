import Image from "next/image";
import Link from "next/link";

import type { PhotoSummary } from "@/types/content";

function getAspectClass(orientation: PhotoSummary["orientation"]) {
  switch (orientation) {
    case "portrait":
      return "aspect-[4/5]";
    case "square":
      return "aspect-square";
    default:
      return "aspect-[16/10]";
  }
}

export function PhotoGrid({ photos }: { photos: PhotoSummary[] }) {
  return (
    <div className="flex flex-col gap-14 lg:gap-20">
      {photos.map((photo, index) => {
        const isEven = index % 2 === 0;
        const frameLabel = String(index + 1).padStart(2, "0");
        const linkClass = isEven
          ? "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] lg:order-1"
          : "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] lg:order-2";
        const imageFrameClass = `relative overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_24px_72px_rgba(17,17,17,0.12)] ${getAspectClass(photo.orientation)}`;
        const copyClass = isEven
          ? "grid gap-4 border-t border-[var(--color-line)] pt-5 lg:order-2"
          : "grid gap-4 border-t border-[var(--color-line)] pt-5 lg:order-1";

        return (
          <article
            key={photo.slug}
            className="grid gap-5 border-b border-[var(--color-line)] pb-14 last:border-b-0 last:pb-0 lg:grid-cols-[minmax(0,1.06fr)_minmax(16rem,0.42fr)] lg:items-end"
          >
            <Link className={linkClass} href={`/photo/${photo.slug}`}>
              <figure className="space-y-4">
                <div className={imageFrameClass}>
                  <Image
                    alt={photo.alt}
                    className="object-cover transition duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 60vw"
                    src={photo.imageUrl}
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5 text-[var(--color-background)] sm:p-6">
                    <span className="rounded-full border border-white/20 bg-[rgba(17,17,17,0.42)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.3em]">
                      {frameLabel}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[rgba(17,17,17,0.82)] via-[rgba(17,17,17,0.18)] to-transparent p-5 text-[var(--color-background)] sm:p-6">
                    <div className="space-y-2">
                      <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/72">
                        {photo.locationLabel ?? "Frame"}
                      </p>
                      <p className="max-w-2xl font-serif text-[clamp(2.1rem,4vw,4.6rem)] leading-[0.88]">
                        {photo.title}
                      </p>
                    </div>
                  </div>
                </div>
              </figure>
            </Link>

            <div className={copyClass}>
              <p className="max-w-xs text-sm leading-7 text-[var(--color-muted)]">
                {photo.captionShort}
              </p>
              <div className="grid gap-2 text-[0.68rem] uppercase tracking-[0.3em] text-[var(--color-steel)]">
                {photo.shotDate ? <p>{photo.shotDate}</p> : null}
                <p>Open frame</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
