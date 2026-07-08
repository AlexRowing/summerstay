import Link from "next/link";
import ListingCard from "@/app/_components/ListingCard";
import { listings } from "@/app/_lib/listings";

export default function Home() {
  const featuredListings = listings.slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Sublet your college apartment for the summer.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
          SummerStay connects students who need a place to stay for the
          summer with students who need someone to take over their lease.
        </p>
        <Link
          href="/listings"
          className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Browse Listings
        </Link>
      </section>

      <section className="mt-20">
        <h2 className="text-xl font-semibold">Featured listings</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
