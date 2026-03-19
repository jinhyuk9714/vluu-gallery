import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-start justify-center gap-6 px-5 py-10 sm:px-8 lg:px-12">
      <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted)]">404</p>
      <h1 className="font-serif text-5xl text-[color:var(--color-ink)] sm:text-6xl">
        This frame is not in the edit.
      </h1>
      <p className="max-w-xl text-base leading-8 text-[color:var(--color-muted)]">
        The page may have moved, or the link may point to a draft that has not been published yet.
      </p>
      <Link
        className="inline-flex items-center border border-[color:var(--color-ink)] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[color:var(--color-ink)] transition duration-200 hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-background)]"
        href="/"
      >
        Return home
      </Link>
    </div>
  );
}

