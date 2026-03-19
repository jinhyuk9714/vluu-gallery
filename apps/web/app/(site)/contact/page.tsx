import { getSiteSettings } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  description: "Contact VLUU for commissions, editorial use, or print requests.",
  pathname: "/contact",
  title: "Contact | VLUU",
});

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-12 px-4 py-6 sm:px-6 lg:gap-16 lg:px-10 lg:py-8">
      <section className="grid gap-8 border-b border-[var(--color-line)] pb-12 lg:grid-cols-[0.54fr_1.46fr] lg:items-end">
        <div className="scene-reveal space-y-4 lg:pb-3">
          <p className="text-xs uppercase tracking-[0.42em] text-[var(--color-steel)]">
            Contact
          </p>
          <p className="max-w-xs text-sm leading-7 text-[var(--color-muted)]">
            For commissions, editorial use, or print requests.
          </p>
        </div>
        <h1 className="scene-reveal max-w-5xl font-serif text-[clamp(4rem,8vw,8.4rem)] leading-[0.82] tracking-[-0.03em] text-[var(--color-ink)]">
          Reach out with context.
        </h1>
      </section>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <a
          className="inline-flex w-fit items-center border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-4 font-serif text-[clamp(2rem,4vw,4.2rem)] leading-[0.92] text-[var(--color-background)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(17,17,17,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] motion-reduce:hover:translate-y-0"
          href={`mailto:${settings.contactEmail}`}
        >
          {settings.contactEmail}
        </a>

        <div className="grid gap-4 border-t border-[var(--color-line)] pt-5 text-sm text-[var(--color-muted)]">
          <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-steel)]">
            Elsewhere
          </p>
          <div className="flex flex-wrap gap-4">
            {settings.socialLinks.map((link) => (
              <a
                key={link.label}
                className="text-xs uppercase tracking-[0.3em] transition duration-300 hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
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
