// Small display helpers shared by server and client components. Kept free of
// database imports so client components can use them.

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

// Which academic term a free-text availability ("May 15 - Aug 20") mostly
// covers, judged by its start month. Null when there's no month to read.
export function termFor(availability: string): string | null {
  const words = availability.toLowerCase().match(/[a-z]{3}/g);
  const month = words?.map((w) => MONTHS.indexOf(w)).find((i) => i >= 0);
  if (month === undefined) return null;
  if (month === 11) return "Winter break";
  if (month <= 3) return "Spring";
  if (month <= 6) return "Summer";
  return "Fall";
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

// Used when a host leaves the photo blank, or pastes a URL we can't safely
// display: next/image only loads hosts allow-listed in next.config.ts.
export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=60";

export function safeImageUrl(raw: string): string {
  return raw.startsWith("https://images.unsplash.com/")
    ? raw
    : PLACEHOLDER_IMAGE;
}
