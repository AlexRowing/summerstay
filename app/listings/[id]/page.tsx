import { notFound } from "next/navigation";
import { getListingById } from "@/app/_lib/listings";

// In Next.js 16, `params` is a Promise, so it must be awaited before use.
export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex h-56 items-center justify-center rounded-xl bg-gradient-to-br from-sky-200 to-sky-400 text-sky-900 dark:from-sky-900 dark:to-sky-700 dark:text-sky-100">
        {listing.bedrooms} BR · {listing.bathrooms} BA
      </div>

      <h1 className="mt-6 text-3xl font-bold">{listing.title}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        {listing.neighborhood}, {listing.city}
      </p>
      <p className="mt-4 text-xl font-semibold">
        ${listing.pricePerMonth}/month
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-zinc-500">Distance to campus</dt>
          <dd>{listing.distanceToCampus}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Available</dt>
          <dd>{listing.availability}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Bedrooms / Bathrooms</dt>
          <dd>
            {listing.bedrooms} / {listing.bathrooms}
          </dd>
        </div>
      </dl>

      <p className="mt-6">{listing.description}</p>

      <h2 className="mt-6 font-semibold">Amenities</h2>
      <ul className="mt-2 list-disc pl-5 text-sm">
        {listing.amenities.map((amenity) => (
          <li key={amenity}>{amenity}</li>
        ))}
      </ul>
    </div>
  );
}
