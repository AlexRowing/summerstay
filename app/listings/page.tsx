import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  BellRing,
  LayoutGrid,
  Map as MapIcon,
  SearchX,
  X,
} from "lucide-react";
import ListingsMap from "@/app/_components/map/ListingsMap";
import { createSearchAlert } from "@/app/account/actions";
import ListingCard from "@/app/_components/ListingCard";
import SearchBar from "@/app/_components/SearchBar";
import { button, size } from "@/app/_components/ui";
import { TERMS, isTerm } from "@/app/_lib/format";
import { auth } from "@/auth";
import {
  SORTS,
  getListings,
  getSavedIds,
  isSort,
  type Sort,
} from "@/app/_lib/listings";

export const metadata: Metadata = { title: "Find a place" };

type Params = {
  q?: string;
  city?: string; // older links used ?city=
  maxPrice?: string;
  bedrooms?: string;
  term?: string;
  verified?: string;
  sort?: string;
  alert?: string;
  view?: string;
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
  const verifiedOnly = params.verified === "1";
  const view = params.view === "map" ? "map" : "list";

  const session = await auth();
  const loggedIn = Boolean(session?.user?.id);
  const savedIds = await getSavedIds(session?.user?.id);
  const listings = await getListings({
    q,
    maxPrice,
    bedrooms,
    term,
    verifiedOnly,
    sort,
  });
  const isFiltered = Boolean(
    q ||
    maxPrice !== undefined ||
    bedrooms !== undefined ||
    term ||
    verifiedOnly,
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
      verified: verifiedOnly ? "1" : undefined,
      sort: sort === "new" ? undefined : sort,
      view: view === "map" ? "map" : undefined,
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
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.025em] sm:text-[2.25rem]">
            Find a place
          </h1>
          <p className="mt-1.5 text-ink-soft">
            Subleases from students near campus, for any term.
          </p>
        </div>
        <nav
          aria-label="View"
          className="flex shrink-0 rounded-[10px] border border-line-strong p-0.5"
        >
          {(
            [
              { key: "list", label: "List", icon: LayoutGrid },
              { key: "map", label: "Map", icon: MapIcon },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <Link
              key={key}
              href={hrefWith({ view: key === "map" ? "map" : undefined })}
              aria-current={view === key ? "true" : undefined}
              className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors ${
                view === key
                  ? "bg-ink text-surface"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <SearchBar
          q={q}
          maxPrice={maxPrice}
          bedrooms={bedrooms}
          term={term}
          verified={verifiedOnly}
          view={view === "map" ? "map" : undefined}
          sort={sort === "new" ? undefined : sort}
        />
      </div>

      {/* Term tabs: the first thing most students know is *when*. */}
      <nav
        aria-label="Filters"
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
        <span
          aria-hidden="true"
          className="mx-1 w-px shrink-0 self-stretch bg-line"
        />
        <Link
          href={hrefWith({ verified: verifiedOnly ? undefined : "1" })}
          aria-current={verifiedOnly ? "true" : undefined}
          className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors ${
            verifiedOnly
              ? "border-brand-ink bg-brand-soft text-brand-ink"
              : "border-line-strong text-ink-soft hover:border-ink-faint hover:text-ink"
          }`}
        >
          <BadgeCheck className="size-4" aria-hidden="true" />
          Verified hosts
        </Link>
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

      {/* Saved-search alert: emails when a new place matches these filters. */}
      <form
        action={createSearchAlert}
        className="mt-4 flex flex-col gap-3 rounded-xl bg-sunken px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        {q && <input type="hidden" name="q" value={q} />}
        {maxPrice !== undefined && (
          <input type="hidden" name="maxPrice" value={maxPrice} />
        )}
        {bedrooms !== undefined && (
          <input type="hidden" name="bedrooms" value={bedrooms} />
        )}
        {term && <input type="hidden" name="term" value={term} />}
        {verifiedOnly && <input type="hidden" name="verified" value="1" />}
        <p
          className="flex items-start gap-2.5 text-[15px]"
          role={params.alert ? "status" : undefined}
        >
          <BellRing
            className="mt-0.5 size-[18px] shrink-0 text-brand-ink"
            aria-hidden="true"
          />
          {params.alert === "saved" ? (
            <span>
              <span className="font-semibold">Alert on.</span>{" "}
              <span className="text-ink-soft">
                We&apos;ll email you when a new place matches this search.
              </span>
            </span>
          ) : params.alert === "full" ? (
            <span className="text-ink-soft">
              You have the maximum of 10 alerts. Remove one to add another.
            </span>
          ) : (
            <span className="text-ink-soft">
              {listings.length === 0
                ? "Nothing yet. Get an email the moment a matching place is posted."
                : "Get an email when a new place matches this search."}
            </span>
          )}
        </p>
        {params.alert ? (
          <Link
            href="/account/saved"
            className={`${button.secondary} ${size.sm} shrink-0`}
          >
            Manage alerts
          </Link>
        ) : (
          <button
            type="submit"
            className={`${button.secondary} ${size.sm} shrink-0`}
          >
            Turn on alerts
          </button>
        )}
      </form>

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
      ) : view === "map" ? (
        <div className="mt-6">
          <ListingsMap
            listings={listings.flatMap((l) =>
              l.lat !== null && l.lng !== null
                ? [
                    {
                      id: l.id,
                      title: l.title,
                      pricePerMonth: l.pricePerMonth,
                      neighborhood: l.neighborhood,
                      imageUrl: l.imageUrl,
                      lat: l.lat,
                      lng: l.lng,
                    },
                  ]
                : [],
            )}
          />
          {(() => {
            const missing = listings.filter((l) => l.lat === null).length;
            return missing > 0 ? (
              <p className="mt-3 text-sm text-ink-soft">
                {missing} {missing === 1 ? "place doesn't" : "places don't"}{" "}
                have a map pin yet.{" "}
                <Link
                  href={hrefWith({ view: undefined })}
                  className="font-semibold text-brand-ink underline-offset-4 hover:underline"
                >
                  See the list
                </Link>
              </p>
            ) : null;
          })()}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, i) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              priority={i < 3}
              save={{ saved: savedIds.has(listing.id), loggedIn }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
