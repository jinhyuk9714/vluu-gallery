import { getSiteSettings } from "@/lib/sanity/data";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-24 border-t border-[var(--color-line)]">
      <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-5 py-8 text-sm text-[var(--color-muted)] sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <div className="space-y-3">
          <p className="font-serif text-[1.25rem] tracking-[0.14em] text-[var(--color-ink)]">
            {settings.siteTitle}
          </p>
          <p className="max-w-xl text-[0.92rem] leading-7">{settings.siteDescription}</p>
        </div>
        <div className="space-y-4 lg:text-right">
          <a
            className="inline-block text-[0.84rem] uppercase tracking-[0.24em] transition-colors hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
            href={`mailto:${settings.contactEmail}`}
          >
            {settings.contactEmail}
          </a>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[0.72rem] uppercase tracking-[0.24em] lg:justify-end">
            {settings.socialLinks.map((link) => (
              <a
                key={link.label}
                className="transition-colors hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
                href={link.url}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
