import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/app/_lib/listings";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    /* `group` lets children react when the whole card is hovered,
       e.g. the photo zoom below. */
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
          {listing.availability}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-semibold leading-snug">{listing.title}</h3>
        <p className="mt-1 text-sm text-ink-soft">
          {listing.neighborhood}, {listing.city}
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          {listing.bedrooms} bd · {listing.bathrooms} ba ·{" "}
          {listing.distanceToCampus}
        </p>
        <p className="mt-3 text-lg font-semibold">
          ${listing.pricePerMonth}
          <span className="text-sm font-normal text-ink-soft"> / month</span>
        </p>
      </div>
    </Link>
  );
}
