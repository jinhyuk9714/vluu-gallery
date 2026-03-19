import Link from "next/link";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/collections", label: "Sequences" },
  { href: "/about", label: "Info" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-line)] bg-[rgba(244,239,231,0.76)] backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12">
        <Link
          className="font-serif text-[1.15rem] tracking-[0.16em] text-[var(--color-ink)] transition-opacity duration-300 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
          href="/"
        >
          VLUU
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 sm:gap-x-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="text-[0.68rem] uppercase tracking-[0.3em] text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
