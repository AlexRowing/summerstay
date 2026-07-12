import Link from "next/link";
import ListingCard from "@/app/_components/ListingCard";
import { getListings } from "@/app/_lib/listings";

const fieldClass =
  "rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-ink-soft";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string;
    maxPrice?: string;
    bedrooms?: string;
  }>;
}) {
  const params = await searchParams;
  const city = params.city?.trim() || undefined;
  const maxPriceNum = params.maxPrice ? Number(params.maxPrice) : undefined;
  const bedroomsNum = params.bedrooms ? Number(params.bedrooms) : undefined;
  // Ignore junk like ?maxPrice=abc rather than passing NaN to the query.
  const maxPrice = Number.isFinite(maxPriceNum) ? maxPriceNum : undefined;
  const bedrooms = Number.isFinite(bedroomsNum) ? bedroomsNum : undefined;

  const listings = await getListings({ city, maxPrice, bedrooms });
  const isFiltered = Boolean(city || maxPrice || bedrooms);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Browse listings</h1>
      <p className="mt-2 text-ink-soft">
        {listings.length === 0
          ? isFiltered
            ? "No sublets match your search"
            : "No sublets posted yet"
          : `${listings.length} summer ${
              listings.length === 1 ? "sublet" : "sublets"
            }${isFiltered ? " match your search" : " near campus"}`}
      </p>

      {/* Plain GET form: submitting puts the fields in the URL
          (?city=…&maxPrice=…&bedrooms=…), which this page reads. No JS. */}
      <form
        method="get"
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <input
          name="city"
          type="text"
          defaultValue={city ?? ""}
          placeholder="City (e.g. Austin)"
          className={`${fieldClass} sm:flex-1`}
          aria-label="City"
        />
        <input
          name="maxPrice"
          type="number"
          min="0"
          defaultValue={maxPrice ?? ""}
          placeholder="Max $/month"
          className={fieldClass}
          aria-label="Maximum price per month"
        />
        <select
          name="bedrooms"
          defaultValue={bedrooms ?? ""}
          className={fieldClass}
          aria-label="Minimum bedrooms"
        >
          <option value="">Any beds</option>
          <option value="1">1+ beds</option>
          <option value="2">2+ beds</option>
          <option value="3">3+ beds</option>
          <option value="4">4+ beds</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Search
        </button>
        {isFiltered && (
          <Link
            href="/listings"
            className="text-center text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            Clear
          </Link>
        )}
      </form>

      {listings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-card p-12 text-center">
          <p className="font-medium">
            {isFiltered ? "No matches" : "Nothing here yet"}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
            {isFiltered
              ? "Try widening your search — a higher price or fewer bedrooms."
              : "No one has posted a summer sublet yet. Be the first to list your place."}
          </p>
          {isFiltered ? (
            <Link
              href="/listings"
              className="mt-6 inline-block rounded-full border border-line bg-card px-6 py-3 font-medium transition-colors hover:border-ink-soft"
            >
              Clear filters
            </Link>
          ) : (
            <Link
              href="/host"
              className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
            >
              List your place
            </Link>
          )}
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
