import { getSiteSettings } from "@/lib/sanity/data";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  description: "Get in touch for conversation, commissions, or print inquiries.",
  pathname: "/contact",
  title: "Contact | VLUU",
});

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-14">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted)]">Contact</p>
        <h1 className="font-serif text-5xl text-[color:var(--color-ink)] sm:text-6xl">
          Reach out with context, not just urgency.
        </h1>
      </div>
      <div className="space-y-8">
        <p className="max-w-2xl text-base leading-8 text-[color:var(--color-muted)]">
          For conversation, commissions, editorial use, or print requests, email is the clearest route. Social links stay intentionally minimal.
        </p>
        <a
          className="inline-flex items-center border border-[color:var(--color-ink)] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[color:var(--color-ink)] transition duration-200 hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
          href={`mailto:${settings.contactEmail}`}
        >
          {settings.contactEmail}
        </a>
        <ul className="grid gap-3 text-sm text-[color:var(--color-muted)]">
          {settings.socialLinks.map((link) => (
            <li key={link.label}>
              <a
                className="transition hover:text-[color:var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
                href={link.url}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
