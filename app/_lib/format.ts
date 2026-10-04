// Small display helpers shared by server and client components. Kept free of
// database imports so client components can use them.

export const TERMS = ["Summer", "Fall", "Spring", "Winter break"] as const;
export type Term = (typeof TERMS)[number];

export function isTerm(value: string | undefined): value is Term {
  return !!value && (TERMS as readonly string[]).includes(value);
}

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function termForMonth(month: number): Term {
  if (month === 11) return "Winter break";
  if (month <= 3) return "Spring";
  if (month <= 6) return "Summer";
  return "Fall";
}

// Which academic term a listing mostly covers, judged by its start month:
// from the real start date when there is one, otherwise from the free-text
// availability ("May 15 - Aug 20"). Null when there's no month to read.
export function termFor(
  availability: string,
  startDate?: Date | null,
): Term | null {
  if (startDate) return termForMonth(startDate.getUTCMonth());
  const words = availability.toLowerCase().match(/[a-z]{3}/g);
  const month = words?.map((w) => MONTHS.indexOf(w)).find((i) => i >= 0);
  return month === undefined ? null : termForMonth(month);
}

// Posted within the last week.
export function isNew(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000;
}

export function formatPrice(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

// "0.3 miles from campus" → "0.3 mi to campus". Anything else passes through.
export function shortDistance(distance: string): string {
  return distance.replace(/\s*miles?\s+from\s+campus/i, " mi to campus");
}

// Dates are stored at UTC midnight and always formatted in UTC, so a date
// picked as "May 15" reads "May 15" for everyone regardless of time zone.
function shortDate(date: Date, withYear: boolean): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

// "May 15 - Aug 15, 2027", or "Dec 15, 2026 - Jan 15, 2027" across years.
export function formatRange(start: Date, end: Date): string {
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  return `${shortDate(start, !sameYear)} - ${shortDate(end, true)}`;
}

// "2027-05-15" for <input type="date">, from a stored date.
export function toDateInput(date: Date | null | undefined): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

// Parse "2027-05-15" from a date input into a UTC-midnight Date.
export function fromDateInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  // Reject impossible days like Feb 30, which Date would roll into March.
  return Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
    ? null
    : date;
}

// Typical dates for each term at Virginia Tech, as [month, day] pairs
// (months 1-12). The end can fall in the next year (winter break).
const TERM_DATES: Record<Term, [[number, number], [number, number]]> = {
  Summer: [
    [5, 15],
    [8, 15],
  ],
  Fall: [
    [8, 20],
    [12, 20],
  ],
  Spring: [
    [1, 10],
    [5, 15],
  ],
  "Winter break": [
    [12, 15],
    [1, 15],
  ],
};

// The next upcoming dates for a term, as date-input strings.
export function nextTermDates(term: Term, now = new Date()): [string, string] {
  const [[sm, sd], [em, ed]] = TERM_DATES[term];
  let year = now.getUTCFullYear();
  if (Date.UTC(year, sm - 1, sd) < now.getTime()) year += 1;
  const endYear = em < sm ? year + 1 : year;
  const pad = (n: number) => String(n).padStart(2, "0");
  return [`${year}-${pad(sm)}-${pad(sd)}`, `${endYear}-${pad(em)}-${pad(ed)}`];
}

// "3 hours ago", "2 days ago", or a date for anything older than a week.
export function timeAgo(date: Date, now = new Date()): string {
  const minutes = Math.round((now.getTime() - date.getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Used when a host leaves the photo blank, or pastes a URL we can't safely
// display: next/image only loads hosts allow-listed in next.config.ts.
export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=60";

// Photo URLs next/image is allowed to load (see next.config.ts).
export function isAllowedPhotoUrl(raw: string): boolean {
  return (
    raw.startsWith("https://images.unsplash.com/") ||
    /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//.test(raw)
  );
}

export function safeImageUrl(raw: string): string {
  return isAllowedPhotoUrl(raw) ? raw : PLACEHOLDER_IMAGE;
}

export const MAX_PHOTOS = 8;

// Why someone reported a listing (shown on the report form and to moderators).
export const REPORT_REASONS = {
  scam: "Looks like a scam",
  inaccurate: "Details are wrong",
  unavailable: "Already taken",
  inappropriate: "Inappropriate content",
  other: "Something else",
} as const;
export type ReportReason = keyof typeof REPORT_REASONS;

export type AlertFilters = {
  q: string | null;
  maxPrice: number | null;
  bedrooms: number | null;
  term: string | null;
  verified: boolean;
};

// "Summer · Foxridge · up to $800 · 2+ beds · verified hosts"
export function describeAlert(a: AlertFilters): string {
  const parts = [
    a.term,
    a.q && `“${a.q}”`,
    a.maxPrice !== null && `up to ${formatPrice(a.maxPrice)}`,
    a.bedrooms !== null && `${a.bedrooms}+ beds`,
    a.verified && "verified hosts",
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Any new place";
}

// The browse URL for an alert's filters.
export function alertHref(a: AlertFilters): string {
  const params = new URLSearchParams();
  if (a.q) params.set("q", a.q);
  if (a.maxPrice !== null) params.set("maxPrice", String(a.maxPrice));
  if (a.bedrooms !== null) params.set("bedrooms", String(a.bedrooms));
  if (a.term) params.set("term", a.term);
  if (a.verified) params.set("verified", "1");
  const qs = params.toString();
  return qs ? `/listings?${qs}` : "/listings";
}
