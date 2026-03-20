"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const overlayTone = pathname === "/" || pathname.startsWith("/photo/");
  const textClass = overlayTone ? "text-white" : "text-[var(--color-ink)]";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto grid w-full max-w-[1720px] grid-cols-[auto_1fr_auto] items-start gap-5 px-4 py-4 sm:px-6 lg:px-10">
        <Link
          className={`pointer-events-auto text-[clamp(0.95rem,1vw,1.1rem)] leading-none transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${textClass}`}
          href="/"
        >
          VLUU
        </Link>
        <nav
          aria-label="Primary"
          className="pointer-events-auto justify-self-center"
        >
          <div className={`flex flex-col items-start text-[clamp(0.98rem,1vw,1.15rem)] leading-[1.15] ${textClass}`}>
            {navItems.map((item) => {
              const isActive = item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
                  href={item.href}
                >
                  <span className={isActive ? "mr-1 inline-block" : "mr-1 inline-block opacity-0"}>
                    •
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        <Link
          className={`pointer-events-auto justify-self-end text-[clamp(0.98rem,1vw,1.15rem)] leading-none transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${textClass}`}
          href="/contact"
        >
          Contact
        </Link>
      </div>
    </header>
  );
}
