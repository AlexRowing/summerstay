"use client";

import Link from "next/link";

// Root error boundary. Next.js renders this (instead of a white screen) when a
// route throws at request time — e.g. the database is unreachable or a row has
// malformed data. Error boundaries must be Client Components.
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-3 text-ink-soft">
        We hit an unexpected error loading this page. Please try again in a
        moment.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Try again
        </button>
        <Link
          href="/listings"
          className="rounded-full border border-line bg-card px-6 py-3 font-medium transition-colors hover:border-ink-soft"
        >
          Browse listings
        </Link>
      </div>
    </div>
  );
}
