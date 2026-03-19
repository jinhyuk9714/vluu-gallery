import Image from "next/image";

import { getAboutPage } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  description: "About the photographer and the pace behind the gallery.",
  pathname: "/about",
  title: "About | Sung Gallery",
});

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-12 lg:py-14">
      <div className="space-y-5">
        <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted)]">About</p>
        <h1 className="font-serif text-5xl text-[color:var(--color-ink)] sm:text-6xl">{about.title}</h1>
        <p className="max-w-xl text-base leading-8 text-[color:var(--color-muted)]">{about.intro}</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        {about.portraitImageUrl ? (
          <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-surface)]">
            <Image
              alt={about.portraitAlt ?? "Portrait image"}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 24vw"
              src={about.portraitImageUrl}
            />
          </div>
        ) : null}
        <div className="space-y-5">
          {about.body.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-[color:var(--color-muted)]">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

