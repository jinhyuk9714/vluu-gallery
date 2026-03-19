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
    <div className="flex flex-col gap-4 lg:gap-6">
      {photos.map((photo) => (
        <Link
          key={photo.slug}
          className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
          href={`/photo/${photo.slug}`}
        >
          <div className={`relative overflow-hidden bg-[var(--color-surface)] ${getAspectClass(photo.orientation)}`}>
            <Image
              alt={photo.alt}
              className="object-cover transition duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
              fill
              sizes="(max-width: 768px) 100vw, 82vw"
              src={photo.imageUrl}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
