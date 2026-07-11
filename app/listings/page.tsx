import ListingCard from "@/app/_components/ListingCard";
import { getListings } from "@/app/_lib/listings";

export default async function ListingsPage() {
  const listings = await getListings();
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Browse listings</h1>
      <p className="mt-2 text-ink-soft">
        {listings.length} summer sublets near campus
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
