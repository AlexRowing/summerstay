import { prisma } from "@/app/_lib/db";
import { termFor, type Term } from "@/app/_lib/format";
import type {
  Listing as ListingRow,
  Prisma,
} from "@/app/generated/prisma/client";

// The shape the rest of the app uses for a listing.
export type Listing = {
  id: string;
  title: string;
  city: string;
  neighborhood: string;
  pricePerMonth: number;
  bedrooms: number;
  bathrooms: number;
  distanceToCampus: string;
  lat: number | null;
  lng: number | null;
  availability: string;
  startDate: Date | null;
  endDate: Date | null;
  isTaken: boolean;
  removedAt: Date | null;
  description: string;
  amenities: string[];
  imageUrl: string;
  // All photos in display order; older listings get their single imageUrl.
  photos: string[];
  ownerId: string | null;
  // The host confirmed a @vt.edu email address.
  hostVerified: boolean;
  createdAt: Date;
};

// Every listing query pulls just enough of the owner to show the badge.
const withOwner = { owner: { select: { vtVerifiedAt: true } } } as const;
type Row = ListingRow & { owner?: { vtVerifiedAt: Date | null } | null };

// The one place that translates a raw database row into a Listing. The DB
// stores amenities as a JSON string, so we parse it back into an array here.
function toListing(row: Row): Listing {
  return {
    id: row.id,
    title: row.title,
    city: row.city,
    neighborhood: row.neighborhood,
    pricePerMonth: row.pricePerMonth,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    distanceToCampus: row.distanceToCampus,
    lat: row.lat,
    lng: row.lng,
    availability: row.availability,
    startDate: row.startDate,
    endDate: row.endDate,
    isTaken: row.isTaken,
    removedAt: row.removedAt,
    description: row.description,
    amenities: JSON.parse(row.amenities) as string[],
    imageUrl: row.imageUrl,
    photos: row.photos.length > 0 ? row.photos : [row.imageUrl],
    ownerId: row.ownerId,
    hostVerified: Boolean(row.owner?.vtVerifiedAt),
    createdAt: row.createdAt,
  };
}

// A listing is "live" (shown in search and on the homepage) until the host
// marks it taken or its end date passes. Listings without real dates (older
// posts) stay live until taken.
function liveWhere(): Prisma.ListingWhereInput {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return {
    isTaken: false,
    removedAt: null,
    OR: [{ endDate: null }, { endDate: { gte: today } }],
  };
}

// Whether a listing has passed its end date.
export function hasEnded(listing: Listing): boolean {
  if (!listing.endDate) return false;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return listing.endDate < today;
}

export const SORTS = {
  new: "Newest",
  "price-asc": "Lowest price",
  "price-desc": "Highest price",
} as const;
export type Sort = keyof typeof SORTS;

export function isSort(value: string | undefined): value is Sort {
  return !!value && Object.hasOwn(SORTS, value);
}

// Optional filters for the browse page, all combined with AND.
export type ListingFilters = {
  // Free text matched against the city, neighborhood, and title.
  q?: string;
  maxPrice?: number;
  bedrooms?: number;
  term?: Term;
  verifiedOnly?: boolean;
  sort?: Sort;
};

const orderBys: Record<Sort, Prisma.ListingOrderByWithRelationInput> = {
  new: { createdAt: "desc" },
  "price-asc": { pricePerMonth: "asc" },
  "price-desc": { pricePerMonth: "desc" },
};

// Every live listing, optionally narrowed by the search filters.
export async function getListings(
  filters: ListingFilters = {},
): Promise<Listing[]> {
  const and: Prisma.ListingWhereInput[] = [liveWhere()];
  if (filters.q) {
    const contains = { contains: filters.q, mode: "insensitive" as const };
    and.push({
      OR: [{ city: contains }, { neighborhood: contains }, { title: contains }],
    });
  }
  if (filters.maxPrice !== undefined) {
    and.push({ pricePerMonth: { lte: filters.maxPrice } });
  }
  if (filters.bedrooms !== undefined) {
    and.push({ bedrooms: { gte: filters.bedrooms } });
  }
  if (filters.verifiedOnly) {
    and.push({ owner: { vtVerifiedAt: { not: null } } });
  }

  const rows = await prisma.listing.findMany({
    where: { AND: and },
    orderBy: orderBys[filters.sort ?? "new"],
    include: withOwner,
  });
  const listings = rows.map(toListing);
  // The term is derived from the dates (or the older free-text availability),
  // so it's filtered here rather than in SQL. Listing counts are small.
  return filters.term
    ? listings.filter(
        (l) => termFor(l.availability, l.startDate) === filters.term,
      )
    : listings;
}

export const HOME_CITY = "Blacksburg";

// Live listings for the homepage: Blacksburg first, newest first.
export async function getFeaturedListings(take: number): Promise<Listing[]> {
  const rows = await prisma.listing.findMany({
    where: {
      AND: [
        liveWhere(),
        { city: { contains: HOME_CITY, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take,
    include: withOwner,
  });
  if (rows.length >= take) return rows.map(toListing);
  // Not enough local listings yet: top up with the newest from anywhere.
  const extra = await prisma.listing.findMany({
    where: { AND: [liveWhere(), { id: { notIn: rows.map((r) => r.id) } }] },
    orderBy: { createdAt: "desc" },
    take: take - rows.length,
    include: withOwner,
  });
  return [...rows, ...extra].map(toListing);
}

export async function countListings(): Promise<number> {
  return prisma.listing.count({ where: liveWhere() });
}

export type NeighborhoodSummary = {
  name: string;
  count: number;
  fromPrice: number;
};

// Blacksburg neighborhoods that currently have live listings, busiest first.
export async function getNeighborhoods(): Promise<NeighborhoodSummary[]> {
  const groups = await prisma.listing.groupBy({
    by: ["neighborhood"],
    where: {
      AND: [
        liveWhere(),
        { city: { contains: HOME_CITY, mode: "insensitive" } },
      ],
    },
    _count: { _all: true },
    _min: { pricePerMonth: true },
  });
  return groups
    .map((g) => ({
      name: g.neighborhood,
      count: g._count._all,
      fromPrice: g._min.pricePerMonth ?? 0,
    }))
    .sort((a, b) => b.count - a.count || a.fromPrice - b.fromPrice);
}

// A single listing, or null if no listing has that id.
export async function getListingById(id: string): Promise<Listing | null> {
  const row = await prisma.listing.findUnique({
    where: { id },
    include: withOwner,
  });
  return row ? toListing(row) : null;
}

export type Host = {
  name: string | null;
  memberSince: Date;
  verified: boolean;
};

// A listing plus the public bits of whoever posted it.
export async function getListingWithHost(
  id: string,
): Promise<{ listing: Listing; host: Host | null } | null> {
  const row = await prisma.listing.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true, createdAt: true, vtVerifiedAt: true } },
    },
  });
  if (!row) return null;
  return {
    listing: toListing(row),
    host: row.owner
      ? {
          name: row.owner.name,
          memberSince: row.owner.createdAt,
          verified: Boolean(row.owner.vtVerifiedAt),
        }
      : null,
  };
}

// Listings owned by one user, newest first (for the "My listings" page).
export async function getListingsByOwner(ownerId: string): Promise<Listing[]> {
  const rows = await prisma.listing.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    include: withOwner,
  });
  return rows.map(toListing);
}

// How many people reached out about each listing (email inquiries plus
// in-app conversations), keyed by listing id.
export async function getInquiryCounts(
  listingIds: string[],
): Promise<Record<string, number>> {
  if (listingIds.length === 0) return {};
  const where = { listingId: { in: listingIds } };
  const [inquiries, conversations] = await Promise.all([
    prisma.inquiry.groupBy({
      by: ["listingId"],
      where,
      _count: { _all: true },
    }),
    prisma.conversation.groupBy({
      by: ["listingId"],
      where,
      _count: { _all: true },
    }),
  ]);
  const counts: Record<string, number> = {};
  for (const g of [...inquiries, ...conversations]) {
    counts[g.listingId] = (counts[g.listingId] ?? 0) + g._count._all;
  }
  return counts;
}

export type InboxMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  unread: boolean;
  listing: { id: string; title: string };
};

// Every message sent about one host's listings, newest first.
export async function getInbox(ownerId: string): Promise<InboxMessage[]> {
  const rows = await prisma.inquiry.findMany({
    where: { listing: { ownerId } },
    orderBy: { createdAt: "desc" },
    include: { listing: { select: { id: true, title: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    message: r.message,
    createdAt: r.createdAt,
    unread: r.readAt === null,
    listing: r.listing,
  }));
}

// Mark every unread message for this host as read (they've opened the inbox).
export async function markInboxRead(ownerId: string): Promise<void> {
  await prisma.inquiry.updateMany({
    where: { readAt: null, listing: { ownerId } },
    data: { readAt: new Date() },
  });
}

// Ids of the listings this user has saved, for filling in the hearts.
export async function getSavedIds(
  userId: string | undefined,
): Promise<Set<string>> {
  if (!userId) return new Set();
  const rows = await prisma.savedListing.findMany({
    where: { userId },
    select: { listingId: true },
  });
  return new Set(rows.map((r) => r.listingId));
}

// Everything a user saved, most recently saved first. Includes places that
// have since been taken, so the page can say so instead of silently dropping
// them; moderator-removed listings are left out.
export async function getSavedListings(userId: string): Promise<Listing[]> {
  const rows = await prisma.savedListing.findMany({
    where: { userId, listing: { removedAt: null } },
    orderBy: { createdAt: "desc" },
    include: { listing: { include: withOwner } },
  });
  return rows.map((r) => toListing(r.listing));
}
