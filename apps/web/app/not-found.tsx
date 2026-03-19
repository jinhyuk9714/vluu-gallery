import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col justify-center gap-8 px-5 py-12 sm:px-8 lg:px-12">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-muted)]">404</p>
        <h1 className="font-serif text-6xl leading-[0.95] text-[var(--color-ink)] sm:text-7xl lg:text-[5.5rem]">
          This sequence is not in the edit.
        </h1>
      </div>
      <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
        The page may have moved, or the link may point to a frame that has not been published.
      </p>
      <Link
        className="inline-flex w-fit items-center border border-[var(--color-ink)] px-5 py-3 text-sm uppercase tracking-[0.24em] text-[var(--color-ink)] transition duration-200 hover:bg-[var(--color-ink)] hover:text-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
        href="/"
      >
        Return to overview
      </Link>
    </div>
  );
}
