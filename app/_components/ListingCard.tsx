import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath } from "lucide-react";
import type { Listing } from "@/app/_lib/listings";
import { formatPrice, isNew, shortDistance, termFor } from "@/app/_lib/format";

// What a card needs to render. A saved listing has an id (the card links to
// it); the host form's live preview passes a draft without one.
export type CardData = Pick<
  Listing,
  | "title"
  | "neighborhood"
  | "distanceToCampus"
  | "availability"
  | "bedrooms"
  | "bathrooms"
  | "pricePerMonth"
  | "imageUrl"
> & { id?: string; createdAt?: Date };

// The signature object of the product: photo first, then the three things a
// student scans for (where, when, how much). Flat at rest; the photo eases in
// a touch on hover.
export default function ListingCard({
  listing,
  priority = false,
}: {
  listing: CardData;
  priority?: boolean;
}) {
  const term = termFor(listing.availability);
  const fresh = listing.createdAt ? isNew(listing.createdAt) : false;

  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sunken">
        <Image
          src={listing.imageUrl}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {fresh && (
            <span className="rounded-md bg-accent px-2 py-1 text-xs font-bold text-[oklch(0.2_0.03_50)]">
              New
            </span>
          )}
          {term && (
            <span className="rounded-md bg-card/95 px-2 py-1 text-xs font-semibold text-ink shadow-sm">
              {term}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 px-0.5">
        <h3 className="line-clamp-1 font-semibold text-ink decoration-ink-faint underline-offset-4 group-hover:underline">
          {listing.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[15px] text-ink-soft">
          {listing.neighborhood} · {shortDistance(listing.distanceToCampus)}
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-[15px] text-ink-soft">
          <span className="truncate">{listing.availability}</span>
          <span
            aria-hidden="true"
            className="h-3.5 w-px shrink-0 bg-line-strong"
          />
          <span className="flex shrink-0 items-center gap-1">
            <BedDouble className="size-4" aria-hidden="true" />
            <span className="sr-only">Bedrooms:</span>
            {listing.bedrooms}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Bath className="size-4" aria-hidden="true" />
            <span className="sr-only">Bathrooms:</span>
            {listing.bathrooms}
          </span>
        </div>
        <p className="mt-2 font-bold">
          {formatPrice(listing.pricePerMonth)}
          <span className="font-normal text-ink-soft"> / month</span>
        </p>
      </div>
    </>
  );

  if (!listing.id) return <div className="group">{body}</div>;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block rounded-2xl outline-offset-4"
    >
      {body}
    </Link>
  );
}
