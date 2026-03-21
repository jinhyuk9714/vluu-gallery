import { getSiteSettings } from "@/lib/sanity/data";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const primarySocial =
    settings.socialLinks.find((link) => link.label.toLowerCase().includes("instagram")) ??
    settings.socialLinks[0];
  const currentYear = new Date().getFullYear();
  const socialLabel = (() => {
    if (!primarySocial) {
      return settings.contactEmail;
    }

    const url = primarySocial.url;
    const match = url.match(/instagram\.com\/([^/?#]+)/i);
    if (match?.[1]) {
      return `${primarySocial.label.toUpperCase()}: @${match[1]}`;
    }

    return primarySocial.label.toUpperCase();
  })();

  return (
    <footer className="mt-20 border-t border-[var(--color-line)]">
      <div className="mx-auto grid w-full max-w-[1720px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_auto_1fr] lg:items-end lg:px-10 lg:py-10">
        <div className="space-y-3">
          <p className="text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-steel)]">
            {settings.siteTitle}
          </p>
          <p className="max-w-[24rem] text-[0.95rem] leading-6 text-[var(--color-muted)]">
            Photographic still journal. A slower edit of transit, weather, and city light. © {currentYear}
          </p>
        </div>
        <a
          className="w-fit text-[0.78rem] uppercase tracking-[0.24em] text-[var(--color-steel)] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] lg:justify-self-center"
          href="#top"
        >
          Back to top
        </a>
        {primarySocial ? (
          <a
            className="justify-self-start text-[0.9rem] uppercase tracking-[0.2em] text-[var(--color-muted)] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] lg:justify-self-end"
            href={primarySocial.url}
            rel="noreferrer"
            target="_blank"
          >
            {socialLabel}
          </a>
        ) : (
          <a
            className="justify-self-start text-[0.9rem] uppercase tracking-[0.2em] text-[var(--color-muted)] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] lg:justify-self-end"
            href={`mailto:${settings.contactEmail}`}
          >
            {settings.contactEmail}
          </a>
        )}
      </div>
    </footer>
  );
}
