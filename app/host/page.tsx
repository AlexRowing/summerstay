import Link from "next/link";

// Placeholder page: posting a listing arrives with the database phase.
export default function HostPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">
        List your place on SummerStay
      </h1>
      <p className="mt-4 text-ink-soft">
        Soon you&apos;ll be able to post your apartment here and find a
        subletter for the summer. We&apos;re building this next.
      </p>
      <Link
        href="/listings"
        className="mt-8 inline-block rounded-full border border-line bg-card px-6 py-3 font-medium transition-colors hover:border-ink-soft"
      >
        Browse listings instead
      </Link>
    </div>
  );
}
