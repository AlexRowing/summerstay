import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
              S
            </span>
            <span className="text-lg font-semibold tracking-tight">
              SummerStay
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            Student summer sublets, made simple. Find a place near campus or
            hand off your lease for the summer.
          </p>
        </div>
        <nav className="flex flex-col gap-3 text-sm sm:items-end">
          <Link
            href="/listings"
            className="text-ink-soft transition-colors hover:text-ink"
          >
            Browse listings
          </Link>
          <Link
            href="/host"
            className="text-ink-soft transition-colors hover:text-ink"
          >
            List your place
          </Link>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-5xl px-6 py-5 text-xs text-ink-soft">
          © 2026 SummerStay. Built by students, for students.
        </p>
      </div>
    </footer>
  );
}
