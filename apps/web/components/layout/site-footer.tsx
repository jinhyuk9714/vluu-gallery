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
    <footer className="mt-16">
      <div className="mx-auto grid w-full max-w-[1720px] gap-3 px-4 py-4 text-[0.95rem] text-[var(--color-ink)] sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:items-end lg:px-10">
        <p>{settings.siteTitle} © {currentYear}</p>
        <a
          className="justify-self-start transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] lg:justify-self-center"
          href="#top"
        >
          Back to top
        </a>
        {primarySocial ? (
          <a
            className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] lg:justify-self-end"
            href={primarySocial.url}
            rel="noreferrer"
            target="_blank"
          >
            {socialLabel}
          </a>
        ) : (
          <a
            className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)] lg:justify-self-end"
            href={`mailto:${settings.contactEmail}`}
          >
            {settings.contactEmail}
          </a>
        )}
      </div>
    </footer>
  );
}
