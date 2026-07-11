import Link from "next/link";
import ListingCard from "@/app/_components/ListingCard";
import { getListings } from "@/app/_lib/listings";

export default async function ListingsPage() {
  const listings = await getListings();
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Browse listings</h1>
      <p className="mt-2 text-ink-soft">
        {listings.length === 0
          ? "No sublets posted yet"
          : `${listings.length} summer sublets near campus`}
      </p>

      {listings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-card p-12 text-center">
          <p className="font-medium">Nothing here yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
            No one has posted a summer sublet yet. Be the first to list your
            place.
          </p>
          <Link
            href="/host"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
          >
            List your place
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
