import Link from "next/link";

export default function Navbar() {
  return (
    /* sticky + backdrop-blur keeps the navbar pinned on top of content
       as you scroll, with a frosted-glass effect. */
    <header className="sticky top-0 z-50 border-b border-line bg-card/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            S
          </span>
          <span className="text-lg font-semibold tracking-tight">
            SummerStay
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Hidden on phones so the bar never wraps; the homepage and
              footer still link to /listings on small screens. */}
          <Link
            href="/listings"
            className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Browse listings
          </Link>
          <Link
            href="/host"
            className="whitespace-nowrap rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            List your place
          </Link>
        </div>
      </nav>
    </header>
  );
}
