import Link from "next/link";

// Branded 404. Renders for unmatched URLs and whenever a page calls notFound()
// (e.g. a listing detail page with an id that isn't in the database).
export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">
        404
      </p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-ink-soft">
        We couldn&apos;t find that page. The listing may have been taken down.
      </p>
      <Link
        href="/listings"
        className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
      >
        Browse listings
      </Link>
    </div>
  );
}
