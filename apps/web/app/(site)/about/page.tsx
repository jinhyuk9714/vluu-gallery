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
    <div className="mx-auto w-full max-w-[1720px] px-4 pb-14 pt-24 sm:px-6 lg:px-10 lg:pb-20 lg:pt-28">
      <div className="grid gap-12 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16">
        <section className="space-y-6">
          <p className="text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-steel)]">Info</p>
          <h1 className="max-w-[8ch] font-serif text-[clamp(2.6rem,4.8vw,4.8rem)] leading-[0.9] tracking-[-0.055em] text-[var(--color-ink)]">
            {about.title}
          </h1>
          <p className="max-w-[22rem] text-[clamp(1rem,1.15vw,1.15rem)] leading-[1.8] text-[var(--color-ink)]">
            {about.intro}
          </p>
          {firstParagraph ? (
            <p className="max-w-[22rem] text-[clamp(1rem,1.15vw,1.15rem)] leading-[1.8] text-[var(--color-ink)]">
              {firstParagraph}
            </p>
          ) : null}
        </section>

        <section className="space-y-8">
          {remainingParagraphs.length > 0 ? (
            <div className="grid gap-8 border-l border-[var(--color-line)] pl-0 lg:pl-12">
              {remainingParagraphs.map((paragraph, index) => (
                <p
                  key={`${paragraph}-${index}`}
                  className="max-w-3xl text-[clamp(1.05rem,1.2vw,1.2rem)] leading-[1.85] text-[var(--color-ink)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
          <div className="grid gap-4 border-t border-[var(--color-line)] pt-6">
            <p className="text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-steel)]">Elsewhere</p>
            <div className="grid gap-2 text-[clamp(1rem,1.1vw,1.1rem)] leading-7 text-[var(--color-ink)]">
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
    </div>
  );
}
