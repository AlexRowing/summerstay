import Link from "next/link";
import type { Listing } from "@/app/_lib/listings";

// A colored block stands in for a real photo until listings have images.
export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block overflow-hidden rounded-xl border border-black/10 transition-shadow hover:shadow-md dark:border-white/10"
    >
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-sky-200 to-sky-400 text-sm font-medium text-sky-900 dark:from-sky-900 dark:to-sky-700 dark:text-sky-100">
        {listing.bedrooms} BR · {listing.bathrooms} BA
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{listing.title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {listing.neighborhood}, {listing.city}
        </p>
        <p className="mt-2 text-sm">{listing.distanceToCampus}</p>
        <p className="mt-2 font-semibold">${listing.pricePerMonth}/month</p>
      </div>
    </Link>
  );
}
