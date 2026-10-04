import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, X } from "lucide-react";
import ListingCard from "@/app/_components/ListingCard";
import SearchBar from "@/app/_components/SearchBar";
import { button, size } from "@/app/_components/ui";
import { TERMS, isTerm } from "@/app/_lib/format";
import { SORTS, getListings, isSort, type Sort } from "@/app/_lib/listings";

export const metadata: Metadata = { title: "Find a place" };

type Params = {
  q?: string;
  city?: string; // older links used ?city=
  maxPrice?: string;
  bedrooms?: string;
  term?: string;
  sort?: string;
};

function toNumber(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw);
  // Ignore junk like ?maxPrice=abc rather than passing NaN to the query.
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const q = (params.q ?? params.city)?.trim() || undefined;
  const maxPrice = toNumber(params.maxPrice);
  const bedrooms = toNumber(params.bedrooms);
  const sort: Sort = isSort(params.sort) ? params.sort : "new";
  const term = isTerm(params.term) ? params.term : undefined;

  const listings = await getListings({ q, maxPrice, bedrooms, term, sort });
  const isFiltered = Boolean(
    q || maxPrice !== undefined || bedrooms !== undefined || term,
  );

  // Build a /listings URL from the current params with some keys changed.
  const hrefWith = (
    changes: Partial<Record<keyof Params, string | undefined>>,
  ) => {
    const next = new URLSearchParams();
    const merged = {
      q,
      maxPrice: maxPrice?.toString(),
      bedrooms: bedrooms?.toString(),
      term,
      sort: sort === "new" ? undefined : sort,
      ...changes,
    };
    for (const [key, value] of Object.entries(merged)) {
      if (value) next.set(key, value);
    }
    const qs = next.toString();
    return qs ? `/listings?${qs}` : "/listings";
  };

  const chips = [
    q && { label: `“${q}”`, href: hrefWith({ q: undefined }) },
    maxPrice !== undefined && {
      label: `Up to $${maxPrice.toLocaleString("en-US")}`,
      href: hrefWith({ maxPrice: undefined }),
    },
    bedrooms !== undefined && {
      label: `${bedrooms}+ beds`,
      href: hrefWith({ bedrooms: undefined }),
    },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
      <h1 className="text-3xl font-bold tracking-[-0.025em] sm:text-[2.25rem]">
        Find a place
      </h1>
      <p className="mt-1.5 text-ink-soft">
        Subleases from students near campus, for any term.
      </p>

      <div className="mt-6">
        <SearchBar
          q={q}
          maxPrice={maxPrice}
          bedrooms={bedrooms}
          term={term}
          sort={sort === "new" ? undefined : sort}
        />
      </div>

      {/* Term tabs: the first thing most students know is *when*. */}
      <nav
        aria-label="Term"
        className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
      >
        {[undefined, ...TERMS].map((t) => {
          const active = term === t;
          return (
            <Link
              key={t ?? "any"}
              href={hrefWith({ term: t })}
              aria-current={active ? "true" : undefined}
              className={`flex h-9 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
                active
                  ? "border-ink bg-ink text-surface"
                  : "border-line-strong text-ink-soft hover:border-ink-faint hover:text-ink"
              }`}
            >
              {t ?? "Any term"}
            </Link>
          );
        })}
      </nav>

      {/* Toolbar: result count + active filters on the left, sort on the
          right. Sort options are plain links so they work without JS. */}
      <div className="mt-6 flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <p className="tabular mr-1 font-semibold" aria-live="polite">
            {listings.length} {listings.length === 1 ? "place" : "places"}
          </p>
          {chips.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              aria-label={`Remove filter ${chip.label}`}
              className="flex h-8 items-center gap-1 rounded-lg bg-sunken pl-2.5 pr-2 text-sm font-medium text-ink transition-colors hover:bg-line"
            >
              {chip.label}
              <X className="size-3.5 text-ink-soft" aria-hidden="true" />
            </Link>
          ))}
          {chips.length > 1 && (
            <Link
              href={hrefWith({
                q: undefined,
                maxPrice: undefined,
                bedrooms: undefined,
              })}
              className="px-1 text-sm font-semibold text-brand-ink underline-offset-4 hover:underline"
            >
              Clear all
            </Link>
          )}
        </div>

        <nav aria-label="Sort" className="flex items-center gap-1 text-sm">
          <span className="mr-1 text-ink-soft">Sort</span>
          {(Object.keys(SORTS) as Sort[]).map((key) => (
            <Link
              key={key}
              href={hrefWith({ sort: key === "new" ? undefined : key })}
              aria-current={sort === key ? "true" : undefined}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors ${
                sort === key
                  ? "bg-ink text-surface"
                  : "text-ink-soft hover:bg-sunken hover:text-ink"
              }`}
            >
              {SORTS[key]}
            </Link>
          ))}
        </nav>
      </div>

      {listings.length === 0 ? (
        <div className="mx-auto mt-16 max-w-md text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-sunken text-ink-soft">
            <SearchX className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl font-bold">
            {isFiltered
              ? "No places match that search"
              : "No places posted yet"}
          </h2>
          <p className="mt-2 text-ink-soft">
            {isFiltered
              ? "Try a nearby neighborhood, a higher max rent, or fewer bedrooms."
              : "Be the first to post a sublease. It takes a few minutes."}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {isFiltered ? (
              <Link
                href="/listings"
                className={`${button.secondary} ${size.md}`}
              >
                Clear search
              </Link>
            ) : (
              <Link href="/host" className={`${button.primary} ${size.md}`}>
                List your place
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
