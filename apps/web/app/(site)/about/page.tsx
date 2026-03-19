import Image from "next/image";

import { getAboutPage, getSiteSettings } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  description: "About the photographer and the pace behind the archive.",
  pathname: "/about",
  title: "Info | VLUU",
});

export default async function AboutPage() {
  const about = await getAboutPage();
  const settings = await getSiteSettings();
  const [firstParagraph, ...remainingParagraphs] = about.body;

  return (
    <div className="mx-auto grid w-full max-w-[1720px] gap-12 px-4 pb-12 pt-24 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:px-10 lg:pt-28">
      <section className="space-y-6">
        <p className="text-[0.95rem] uppercase leading-none text-[var(--color-ink)]">Info</p>
        <h1 className="font-serif text-[clamp(2.2rem,4vw,4rem)] leading-[0.92] tracking-[-0.05em] text-[var(--color-ink)]">
          {about.title}
        </h1>
        <p className="max-w-xl text-base leading-7 text-[var(--color-ink)]">{about.intro}</p>
        {firstParagraph ? (
          <p className="max-w-xl text-base leading-7 text-[var(--color-ink)]">{firstParagraph}</p>
        ) : null}
        {about.portraitImageUrl ? (
          <div className="relative mt-8 max-w-[22rem] overflow-hidden bg-[var(--color-surface)]">
            <div className="relative aspect-[4/5]">
              <Image
                alt={about.portraitAlt ?? about.title}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 80vw, 22rem"
                src={about.portraitImageUrl}
              />
            </div>
          </div>
        ) : null}
      </section>

      <section className="space-y-6">
        {remainingParagraphs.length > 0
          ? remainingParagraphs.map((paragraph, index) => (
              <p
                key={`${paragraph}-${index}`}
                className="max-w-xl text-base leading-7 text-[var(--color-ink)]"
              >
                {paragraph}
              </p>
            ))
          : null}
        <div className="pt-4">
          <p className="text-[0.95rem] uppercase leading-none text-[var(--color-ink)]">Elsewhere</p>
          <div className="mt-4 grid gap-2 text-base leading-7 text-[var(--color-ink)]">
            {settings.socialLinks.map((link) => (
              <a
                key={link.label}
                className="w-fit transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
                href={link.url}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
