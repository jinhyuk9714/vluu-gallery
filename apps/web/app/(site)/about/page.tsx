import { getAboutPage } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  description: "About the photographer and the pace behind the archive.",
  pathname: "/about",
  title: "Info | VLUU",
});

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-14 px-4 py-6 sm:px-6 lg:gap-16 lg:px-10 lg:py-8">
      <section className="grid gap-8 border-b border-[var(--color-line)] pb-12 lg:grid-cols-[0.5fr_1.5fr] lg:items-end">
        <div className="scene-reveal space-y-4 lg:pb-3">
          <p className="text-xs uppercase tracking-[0.42em] text-[var(--color-steel)]">
            Info
          </p>
          <p className="max-w-xs text-sm leading-7 text-[var(--color-muted)]">
            Background, approach, and a short note on how the edit is built.
          </p>
        </div>
        <div className="scene-reveal space-y-5">
          <h1 className="max-w-5xl font-serif text-[clamp(3.8rem,8vw,8rem)] leading-[0.82] tracking-[-0.03em] text-[var(--color-ink)]">
            {about.title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            {about.intro}
          </p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-8">
          <p className="scene-reveal-delayed max-w-3xl text-base leading-8 text-[var(--color-muted)]">
            This personal archive stays small on purpose.
          </p>
          {about.body.map((paragraph, index) => (
            <p
              key={`${paragraph}-${index}`}
              className="scene-reveal-delayed max-w-3xl text-base leading-8 text-[var(--color-muted)]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="border-t border-[var(--color-line)] pt-5">
          <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-steel)]">
            Info
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            The page stays text-only. The work is meant to carry the visual weight.
          </p>
        </aside>
      </section>
    </div>
  );
}
