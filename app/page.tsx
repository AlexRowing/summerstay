import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import ListingCard from "@/app/_components/ListingCard";
import SearchBar from "@/app/_components/SearchBar";
import { button, size } from "@/app/_components/ui";
import { TERMS, formatPrice } from "@/app/_lib/format";
import {
  countListings,
  getFeaturedListings,
  getNeighborhoods,
  type Listing,
} from "@/app/_lib/listings";

const renterSteps = [
  {
    title: "Search by what matters",
    body: "Filter by neighborhood, rent, and bedrooms. Every place shows its dates up front.",
  },
  {
    title: "Message the student",
    body: "Send a note right from the listing. No account needed to reach out.",
  },
  {
    title: "Sort out the handoff",
    body: "Agree on dates, sign your complex's sublease form, and grab the keys.",
  },
];

const hostSteps = [
  {
    title: "Post in a few minutes",
    body: "Price, dates, a photo, and a few lines about the place. That's it.",
  },
  {
    title: "Get interest from students",
    body: "Students reach out from your listing with their name, email, and the dates they need.",
  },
  {
    title: "Stop paying for an empty room",
    body: "Hand off your lease for the summer, a semester, or winter break.",
  },
];

// Three listing photos stacked into a small collage beside the hero. Each one
// links to its listing and carries its price, so the hero is real inventory,
// not stock art.
function HeroCollage({ listings }: { listings: Listing[] }) {
  const [a, b, c] = listings;
  if (!a || !b || !c) return null;

  const tile = (listing: Listing, className: string, sizes: string) => (
    <Link
      href={`/listings/${listing.id}`}
      className={`group relative block overflow-hidden rounded-2xl bg-sunken ${className}`}
    >
      <Image
        src={listing.imageUrl}
        alt={listing.title}
        fill
        priority
        sizes={sizes}
        className="object-cover transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
      />
      <span className="absolute bottom-3 left-3 rounded-lg bg-card/95 px-2.5 py-1.5 text-[13px] font-semibold text-ink shadow-sm">
        <span>{formatPrice(listing.pricePerMonth)}</span>
        <span className="font-normal text-ink-soft">
          /mo · {listing.neighborhood}
        </span>
      </span>
    </Link>
  );

  return (
    <div
      className="grid h-[440px] grid-cols-[1.15fr_1fr] grid-rows-2 gap-3"
      aria-label="Recently listed"
    >
      {tile(a, "row-span-2", "(max-width: 1280px) 0px, 340px")}
      {tile(b, "", "(max-width: 1280px) 0px, 300px")}
      {tile(c, "", "(max-width: 1280px) 0px, 300px")}
    </div>
  );
}

export default async function Home() {
  const [featured, neighborhoods, total] = await Promise.all([
    getFeaturedListings(9),
    getNeighborhoods(),
    countListings(),
  ]);
  const collage = featured.slice(0, 3);
  const grid =
    featured.slice(3, 9).length === 6
      ? featured.slice(3, 9)
      : featured.slice(0, 6);

  return (
    <div>
      {/* Hero: the headline and the search bar do the work; real listings
          sit beside them on wide screens. */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:pb-24 lg:pt-20 xl:grid-cols-[1.1fr_1fr]">
        <div className="max-w-3xl">
          <p className="flex items-center gap-1.5 text-[15px] font-semibold text-brand-ink">
            <MapPin className="size-4" aria-hidden="true" />
            Blacksburg, VA
          </p>
          <h1 className="mt-4 text-[2.5rem] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[3.5rem] lg:text-[4rem]">
            Blacksburg subleases, without the group chat chaos.
          </h1>
          <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-ink-soft">
            Find a room for the summer, a semester, or winter break. Or hand off
            your lease while you&apos;re away. Posted by students, for students.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[15px] text-ink-soft">Jump to</span>
            {TERMS.map((term) => (
              <Link
                key={term}
                href={`/listings?term=${encodeURIComponent(term)}`}
                className="flex h-8 items-center rounded-full border border-line-strong px-3.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink-faint hover:text-ink"
              >
                {term}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-[15px] text-ink-soft">
            Leaving town?{" "}
            <Link
              href="/host"
              className="font-semibold text-brand-ink underline-offset-4 hover:underline"
            >
              List your place
            </Link>{" "}
            and stop paying for an empty room.
          </p>
        </div>
        <div className="hidden xl:block">
          <HeroCollage listings={collage} />
        </div>
      </section>

      {/* Fresh listings */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.02em] sm:text-[1.75rem]">
              Just listed near campus
            </h2>
            <p className="mt-1 text-ink-soft">
              The newest places from students heading out.
            </p>
          </div>
          <Link
            href="/listings"
            className="group hidden shrink-0 items-center gap-1.5 text-[15px] font-semibold text-brand-ink sm:flex"
          >
            See all {total} places
            <ArrowRight
              className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        <Link
          href="/listings"
          className={`${button.secondary} ${size.md} mt-10 w-full sm:hidden`}
        >
          See all {total} places
        </Link>
      </section>

      {/* Neighborhoods: a quick way in for people who already know the town. */}
      {neighborhoods.length > 0 && (
        <section className="border-y border-line bg-sunken">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold tracking-[-0.02em] sm:text-[1.75rem]">
              Browse by neighborhood
            </h2>
            <p className="mt-1 text-ink-soft">
              From Downtown walk-to-class rooms to quieter spots off Prices
              Fork.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {neighborhoods.map((n) => (
                <li key={n.name} className="border-t border-line-strong">
                  <Link
                    href={`/listings?q=${encodeURIComponent(n.name)}`}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span>
                      <span className="block font-semibold group-hover:underline group-hover:underline-offset-4">
                        {n.name}
                      </span>
                      <span className="text-[15px] text-ink-soft">
                        {n.count} {n.count === 1 ? "place" : "places"} · from{" "}
                        {formatPrice(n.fromPrice)}/mo
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 text-ink-faint transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-ink"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* How it works, told from both sides of the handoff. */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="max-w-xl text-2xl font-bold tracking-[-0.02em] sm:text-[1.75rem]">
          One place for both sides of the handoff
        </h2>
        <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
          {[
            {
              heading: "Looking for a place",
              steps: renterSteps,
              cta: { href: "/listings", label: "Find a place" },
            },
            {
              heading: "Leaving for a while",
              steps: hostSteps,
              cta: { href: "/host", label: "List your place" },
            },
          ].map((side) => (
            <div key={side.heading}>
              <h3 className="text-lg font-bold">{side.heading}</h3>
              <ol className="mt-5 space-y-6">
                {side.steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="tabular flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong text-sm font-bold text-ink-soft">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link
                href={side.cta.href}
                className="group mt-7 inline-flex items-center gap-1.5 font-semibold text-brand-ink"
              >
                {side.cta.label}
                <ArrowRight
                  className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Closing call to action: the one drenched maroon moment on the page. */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-brand px-6 py-14 text-on-brand sm:px-14 sm:py-16">
          <svg
            viewBox="0 0 200 240"
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-4 h-[130%] opacity-[0.12] sm:right-10"
          >
            <path d="M30 240V90a70 70 0 0 1 140 0v150Z" fill="currentColor" />
          </svg>
          <div className="relative max-w-xl">
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.025em] sm:text-4xl">
              Leaving Blacksburg for a while?
            </h2>
            <p className="mt-3 text-lg text-on-brand/80">
              Someone&apos;s looking for exactly your place. Post it in a few
              minutes, for free.
            </p>
            <Link
              href="/host"
              className={`${size.lg} mt-8 inline-flex items-center justify-center gap-2 rounded-[10px] bg-card font-semibold text-ink transition-colors duration-150 hover:bg-sunken`}
            >
              List your place
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
