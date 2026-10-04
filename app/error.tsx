"use client";

import Link from "next/link";
import { button, size } from "@/app/_components/ui";

// Root error boundary. Next.js renders this (instead of a white screen) when a
// route throws at request time, e.g. the database is unreachable. Error
// boundaries must be Client Components.
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:py-28">
      <h1 className="text-[1.75rem] font-bold tracking-[-0.025em]">
        Something went wrong on our end
      </h1>
      <p className="mt-2 text-ink-soft">
        We couldn&apos;t load this page. It&apos;s usually a hiccup; try again
        in a moment.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={reset}
          className={`${button.primary} ${size.md}`}
        >
          Try again
        </button>
        <Link href="/" className={`${button.secondary} ${size.md}`}>
          Go home
        </Link>
      </div>
    </div>
  );
}
