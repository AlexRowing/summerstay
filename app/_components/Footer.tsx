import Link from "next/link";
import ThemeToggle from "@/app/_components/ThemeToggle";

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
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <p className="text-xs text-ink-soft">
            © 2026 SummerStay • Developed by{" "}
            <a
              href="https://www.linkedin.com/in/alex-garcia-7174702b0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Alex Garcia
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/AlexRowing"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-ink-soft transition-colors hover:text-ink"
            >
              {/* GitHub's official mark, inlined (lucide 1.x removed brand icons) */}
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
