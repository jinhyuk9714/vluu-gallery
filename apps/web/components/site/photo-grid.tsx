import Image from "next/image";
import Link from "next/link";

import type { PhotoSummary } from "@/types/content";

function getSpanClasses(index: number, orientation: PhotoSummary["orientation"]) {
  if (orientation === "portrait") {
    return index % 4 === 0 ? "md:col-span-5 xl:col-span-4" : "md:col-span-4 xl:col-span-3";
  }

  if (orientation === "square") {
    return "md:col-span-4 xl:col-span-4";
  }

  return index % 3 === 0 ? "md:col-span-8 xl:col-span-8" : "md:col-span-6 xl:col-span-5";
}

function getAspectClass(orientation: PhotoSummary["orientation"]) {
  switch (orientation) {
    case "portrait":
      return "aspect-[4/5]";
    case "square":
      return "aspect-square";
    default:
      return "aspect-[3/2]";
  }
}

export function PhotoGrid({ photos }: { photos: PhotoSummary[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5 xl:gap-6">
      {photos.map((photo, index) => (
        <Link
          key={photo.slug}
          className={`group block ${getSpanClasses(index, photo.orientation)} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]`}
          href={`/photo/${photo.slug}`}
        >
          <figure className="space-y-3">
            <div className={`relative overflow-hidden bg-[color:var(--color-surface)] ${getAspectClass(photo.orientation)}`}>
              <Image
                alt={photo.alt}
                className="object-cover transition duration-300 group-hover:scale-[1.01] group-hover:opacity-92 motion-reduce:transition-none"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                src={photo.imageUrl}
              />
            </div>
            <figcaption className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-serif text-xl text-[color:var(--color-ink)]">{photo.title}</p>
                <p className="text-sm leading-6 text-[color:var(--color-muted)]">{photo.captionShort}</p>
              </div>
              {photo.locationLabel ? (
                <span className="pt-1 text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                  {photo.locationLabel}
                </span>
              ) : null}
            </figcaption>
          </figure>
        </Link>
      ))}
    </div>
  );
}

