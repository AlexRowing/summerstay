import Link from "next/link";
import ListingCard from "@/app/_components/ListingCard";
import { getListings } from "@/app/_lib/listings";

const steps = [
  {
    number: "1",
    title: "Browse",
    description: "Find sublets posted by students near your campus.",
  },
  {
    number: "2",
    title: "Connect",
    description: "Reach out to the host and agree on dates that work.",
  },
  {
    number: "3",
    title: "Move in",
    description: "Show up in June, leave in August. No year-long lease.",
  },
];

export default async function Home() {
  const listings = await getListings();
  const featuredListings = listings.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          Student summer sublets
        </p>
        <h1 className="mt-4 text-balance text-5xl font-bold tracking-tight sm:text-6xl">
          A summer home near any campus.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">
          SummerStay connects students who need a place for the summer with
          students who need someone to take over their lease.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/listings"
            className="rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Browse listings
          </Link>
          <Link
            href="/host"
            className="rounded-full border border-line bg-card px-6 py-3 font-medium transition-colors hover:border-ink-soft"
          >
            List your place
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            How it works
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 text-center sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number}>
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand">
                  {step.number}
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Featured listings
          </h2>
          <Link
            href="/listings"
            className="text-sm font-medium text-brand transition-colors hover:text-brand-dark"
          >
            View all →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
