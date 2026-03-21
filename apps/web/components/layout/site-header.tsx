"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const overlayTone = pathname === "/" || pathname.startsWith("/photo/");
  const textClass = overlayTone ? "chrome-ink" : "text-[var(--color-ink)]";
  const shellClass = overlayTone
    ? "bg-transparent"
    : "border-b border-[var(--color-line)] bg-[rgb(11_13_14_/_0.82)] backdrop-blur-xl";
  const focusRingClass = overlayTone
    ? "focus-visible:ring-white focus-visible:ring-offset-transparent"
    : "focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-[var(--color-background)]";

  return (
    <header className={`pointer-events-none fixed inset-x-0 top-0 z-40 transition-colors ${shellClass}`}>
      <div className="mx-auto flex w-full max-w-[1720px] items-start justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link
          className={`pointer-events-auto text-[0.78rem] uppercase tracking-[0.32em] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 ${focusRingClass} ${textClass}`}
          href="/"
        >
          VLUU
        </Link>

        <nav aria-label="Primary" className="pointer-events-auto ml-auto">
          <div className={`flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.24em] sm:gap-5 ${textClass}`}>
            {navItems.map((item) => {
              const isActive = item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  className={`transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 ${focusRingClass}`}
                  href={item.href}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className={`h-[1px] w-3 bg-current transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
