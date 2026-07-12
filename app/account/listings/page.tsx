import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ListingCard from "@/app/_components/ListingCard";
import { getListingsByOwner } from "@/app/_lib/listings";

export default async function MyListingsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const listings = await getListingsByOwner(userId);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">My listings</h1>
      <p className="mt-2 text-ink-soft">
        {listings.length === 0
          ? "You haven't posted any listings yet."
          : `${listings.length} listing${listings.length === 1 ? "" : "s"} you posted`}
      </p>

      {listings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-card p-12 text-center">
          <p className="font-medium">Nothing posted yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
            List your place for the summer and it will show up here.
          </p>
          <Link
            href="/host"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Post your first listing
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
