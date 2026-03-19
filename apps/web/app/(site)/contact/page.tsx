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
    <div className="mx-auto grid w-full max-w-[1720px] gap-12 px-4 pb-12 pt-24 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:px-10 lg:pt-28">
      <section className="space-y-6">
        <p className="text-[0.95rem] uppercase leading-none text-[var(--color-ink)]">Contact</p>
        <h1 className="font-serif text-[clamp(2.6rem,5vw,5rem)] leading-[0.92] tracking-[-0.05em] text-[var(--color-ink)]">
          Reach out with context.
        </h1>
        <a
          className="block max-w-[14ch] font-serif text-[clamp(2.2rem,4.5vw,4.6rem)] leading-[0.92] tracking-[-0.05em] text-[var(--color-ink)] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
          href={`mailto:${settings.contactEmail}`}
        >
          {settings.contactEmail}
        </a>
      </section>

      <section className="space-y-8">
        <div>
          <p className="text-[0.95rem] uppercase leading-none text-[var(--color-ink)]">Social</p>
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

        <div>
          <p className="text-[0.95rem] uppercase leading-none text-[var(--color-ink)]">Request</p>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-ink)]">
            For commissions, editorial use, and print inquiries, include the timeline, location, and intended use of the work.
          </p>
        </div>
      </section>
    </div>
  );
}
