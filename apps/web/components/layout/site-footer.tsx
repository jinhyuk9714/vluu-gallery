import { getSiteSettings } from "@/lib/sanity/data";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-black/8 mt-24">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 text-sm text-[color:var(--color-muted)] sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-12">
        <div className="space-y-3">
          <p className="font-serif text-lg text-[color:var(--color-ink)]">{settings.siteTitle}</p>
          <p className="max-w-xl leading-7">{settings.siteDescription}</p>
        </div>
        <div className="space-y-3 lg:text-right">
          <a
            className="inline-block transition-colors hover:text-[color:var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
            href={`mailto:${settings.contactEmail}`}
          >
            {settings.contactEmail}
          </a>
          <div className="flex gap-4 lg:justify-end">
            {settings.socialLinks.map((link) => (
              <a
                key={link.label}
                className="transition-colors hover:text-[color:var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
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

