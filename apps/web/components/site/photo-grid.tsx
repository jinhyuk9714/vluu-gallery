import Link from "next/link";

import { ProportionalImage } from "@/components/site/proportional-image";
import type { PhotoSummary } from "@/types/content";

export function PhotoGrid({ photos }: { photos: PhotoSummary[] }) {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {photos.map((photo) => (
        <Link
          key={photo.slug}
          className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
          href={`/photo/${photo.slug}`}
        >
          <div className="overflow-hidden bg-[var(--color-surface)]">
            <ProportionalImage
              alt={photo.alt}
              className="h-auto w-full transition duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
              height={photo.height}
              sizes="(max-width: 768px) 100vw, 82vw"
              src={photo.imageUrl}
              width={photo.width}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
