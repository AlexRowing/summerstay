import { Search } from "lucide-react";
import { button } from "@/app/_components/ui";

const PRICE_STEPS = [600, 800, 1000, 1500, 2000];
const BED_STEPS = [1, 2, 3, 4];

const selectClass =
  "w-full cursor-pointer appearance-none bg-transparent pr-6 text-[15px] font-medium text-ink outline-none";
const segmentClass =
  "relative flex min-w-0 flex-col justify-center rounded-xl px-4 py-2.5 transition-colors focus-within:bg-sunken hover:bg-sunken";
const segmentLabel = "text-xs font-semibold text-ink-soft";

// A chevron drawn by CSS-free SVG so native <select>s keep their keyboard and
// mobile pickers while looking like the rest of the bar.
function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-3.5 right-4 size-3.5 fill-none stroke-ink-soft stroke-2"
    >
      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The main search control. A plain GET form to /listings, so it works with
// no JavaScript and every search is a shareable URL.
export default function SearchBar({
  q,
  maxPrice,
  bedrooms,
  sort,
}: {
  q?: string;
  maxPrice?: number;
  bedrooms?: number;
  sort?: string;
}) {
  const prices =
    maxPrice !== undefined && !PRICE_STEPS.includes(maxPrice)
      ? [...PRICE_STEPS, maxPrice].sort((a, b) => a - b)
      : PRICE_STEPS;

  return (
    <form
      action="/listings"
      method="get"
      role="search"
      className="grid grid-cols-2 gap-1 rounded-2xl border border-line-strong bg-card p-1.5 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.12)] md:grid-cols-[1.35fr_1fr_0.8fr_auto] md:items-stretch"
    >
      <label className={`${segmentClass} col-span-2 md:col-span-1`}>
        <span className={segmentLabel}>Where</span>
        <input
          name="q"
          type="search"
          defaultValue={q ?? ""}
          placeholder="Any neighborhood"
          className="w-full bg-transparent text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden"
        />
      </label>

      <label className={segmentClass}>
        <span className={segmentLabel}>Max rent</span>
        <select
          name="maxPrice"
          defaultValue={maxPrice ?? ""}
          className={selectClass}
        >
          <option value="">Any price</option>
          {prices.map((p) => (
            <option key={p} value={p}>
              Up to ${p.toLocaleString("en-US")}
            </option>
          ))}
        </select>
        <Chevron />
      </label>

      <label className={segmentClass}>
        <span className={segmentLabel}>Bedrooms</span>
        <select
          name="bedrooms"
          defaultValue={bedrooms ?? ""}
          className={selectClass}
        >
          <option value="">Any</option>
          {BED_STEPS.map((b) => (
            <option key={b} value={b}>
              {b}+ beds
            </option>
          ))}
        </select>
        <Chevron />
      </label>

      {sort && <input type="hidden" name="sort" value={sort} />}

      <button
        type="submit"
        className={`${button.primary} col-span-2 h-12 rounded-xl px-6 text-base md:col-span-1 md:h-auto`}
      >
        <Search className="size-[18px]" strokeWidth={2.25} aria-hidden="true" />
        Search
      </button>
    </form>
  );
}
