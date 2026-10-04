import Link from "next/link";
import { button, size } from "@/app/_components/ui";

// Branded 404. Renders for unmatched URLs and whenever a page calls notFound()
// (e.g. a listing that was taken down).
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center sm:py-28">
      <svg viewBox="0 0 120 120" aria-hidden="true" className="size-24">
        <rect
          x="20"
          y="16"
          width="80"
          height="96"
          rx="40"
          className="fill-sunken"
        />
        <path
          d="M38 112V58a22 22 0 0 1 44 0v54Z"
          className="fill-line-strong"
        />
        <circle cx="72" cy="86" r="3.5" className="fill-accent" />
      </svg>
      <h1 className="mt-6 text-[1.75rem] font-bold tracking-[-0.025em]">
        This door doesn&apos;t lead anywhere
      </h1>
      <p className="mt-2 text-ink-soft">
        The page doesn&apos;t exist, or the listing was taken down after someone
        moved in.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link href="/listings" className={`${button.primary} ${size.md}`}>
          Find a place
        </Link>
        <Link href="/" className={`${button.secondary} ${size.md}`}>
          Go home
        </Link>
      </div>
    </div>
  );
}
