import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById } from "@/app/_lib/listings";

// In Next.js 16, `params` is a Promise, so it must be awaited before use.
export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  // The key facts, kept as data so the markup below stays a simple loop.
  const facts = [
    { label: "Bedrooms", value: listing.bedrooms },
    { label: "Bathrooms", value: listing.bathrooms },
    { label: "To campus", value: listing.distanceToCampus },
    { label: "Available", value: listing.availability },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <Link
        href="/listings"
        className="inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        ← Back to listings
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight">{listing.title}</h1>
        <p className="mt-1 text-ink-soft">
          {listing.neighborhood}, {listing.city}
        </p>
      </div>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
          priority
        />
      </div>

      {/* Two columns on desktop: details on the left, a contact card on the
          right. Stacks into one column on smaller screens. */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Facts as small stat cards instead of a plain list */}
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-xl border border-line bg-card p-4"
              >
                <dt className="text-xs text-ink-soft">{fact.label}</dt>
                <dd className="mt-1 font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">About this place</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              {listing.description}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Amenities</h2>
            {/* Pills read as scannable tags rather than a bullet list */}
            <ul className="mt-3 flex flex-wrap gap-2">
              {listing.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-full border border-line bg-card px-4 py-1.5 text-sm"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact card. `sticky top-24` keeps it in view as the long
            left column scrolls past on desktop. */}
        <aside>
          <div className="sticky top-24 rounded-2xl border border-line bg-card p-6 shadow-sm">
            <p className="text-2xl font-bold">
              ${listing.pricePerMonth}
              <span className="text-base font-normal text-ink-soft">
                {" "}
                / month
              </span>
            </p>
            <p className="mt-1 text-sm text-ink-soft">{listing.availability}</p>
            <button
              type="button"
              className="mt-5 w-full rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
            >
              Contact host
            </button>
            <p className="mt-3 text-center text-xs text-ink-soft">
              Messaging coming soon
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
