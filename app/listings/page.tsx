import ListingCard from "@/app/_components/ListingCard";
import { listings } from "@/app/_lib/listings";

export default function ListingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold">Browse Listings</h1>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        {listings.length} summer sublets available
      </p>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
