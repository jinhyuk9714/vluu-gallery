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
    <div className="mx-auto w-full max-w-[1720px] px-4 pb-14 pt-24 sm:px-6 lg:px-10 lg:pb-20 lg:pt-28">
      <div className="grid gap-12 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16">
        <section className="space-y-6">
          <p className="text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-steel)]">Contact</p>
          <h1 className="max-w-[9ch] font-serif text-[clamp(2.6rem,5vw,5.4rem)] leading-[0.9] tracking-[-0.055em] text-[var(--color-ink)]">
            Reach out with context.
          </h1>
          <a
            className="block max-w-[12ch] font-serif text-[clamp(2.6rem,5.4vw,6.2rem)] leading-[0.92] tracking-[-0.055em] text-[var(--color-ink)] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
            href={`mailto:${settings.contactEmail}`}
          >
            {settings.contactEmail}
          </a>
        </section>

        <section className="space-y-8">
          <div className="grid gap-4 border-t border-[var(--color-line)] pt-6">
            <p className="text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-steel)]">Social</p>
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

          <div className="grid gap-4 border-t border-[var(--color-line)] pt-6">
            <p className="text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-steel)]">Request</p>
            <p className="max-w-2xl text-[clamp(1.05rem,1.2vw,1.2rem)] leading-[1.85] text-[var(--color-ink)]">
              For commissions, editorial use, and print inquiries, include the timeline, location,
              and intended use of the work.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
