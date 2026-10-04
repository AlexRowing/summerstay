import { prisma } from "@/app/_lib/db";
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
  availability: string;
  description: string;
  amenities: string[];
  imageUrl: string;
  ownerId: string | null;
  createdAt: Date;
};

// The one place that translates a raw database row into a Listing. The DB
// stores amenities as a JSON string, so we parse it back into an array here.
function toListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    city: row.city,
    neighborhood: row.neighborhood,
    pricePerMonth: row.pricePerMonth,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    distanceToCampus: row.distanceToCampus,
    availability: row.availability,
    description: row.description,
    amenities: JSON.parse(row.amenities) as string[],
    imageUrl: row.imageUrl,
    ownerId: row.ownerId,
    createdAt: row.createdAt,
  };
}

export const SORTS = {
  new: "Newest",
  "price-asc": "Lowest price",
  "price-desc": "Highest price",
} as const;
export type Sort = keyof typeof SORTS;

export function isSort(value: string | undefined): value is Sort {
  return !!value && value in SORTS;
}

// Optional filters for the browse page, all combined with AND.
export type ListingFilters = {
  // Free text matched against the city, neighborhood, and title.
  q?: string;
  maxPrice?: number;
  bedrooms?: number;
  sort?: Sort;
};

const orderBys: Record<Sort, Prisma.ListingOrderByWithRelationInput> = {
  new: { createdAt: "desc" },
  "price-asc": { pricePerMonth: "asc" },
  "price-desc": { pricePerMonth: "desc" },
};

// Every listing, optionally narrowed by the search filters.
export async function getListings(
  filters: ListingFilters = {},
): Promise<Listing[]> {
  const where: Prisma.ListingWhereInput = {};
  if (filters.q) {
    const contains = { contains: filters.q, mode: "insensitive" as const };
    where.OR = [
      { city: contains },
      { neighborhood: contains },
      { title: contains },
    ];
  }
  if (filters.maxPrice !== undefined) {
    where.pricePerMonth = { lte: filters.maxPrice };
  }
  if (filters.bedrooms !== undefined) {
    where.bedrooms = { gte: filters.bedrooms };
  }

  const rows = await prisma.listing.findMany({
    where,
    orderBy: orderBys[filters.sort ?? "new"],
  });
  return rows.map(toListing);
}

export const HOME_CITY = "Blacksburg";

// Listings for the homepage: Blacksburg first, newest first.
export async function getFeaturedListings(take: number): Promise<Listing[]> {
  const rows = await prisma.listing.findMany({
    where: { city: { contains: HOME_CITY, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take,
  });
  if (rows.length >= take) return rows.map(toListing);
  // Not enough local listings yet: top up with the newest from anywhere.
  const extra = await prisma.listing.findMany({
    where: { id: { notIn: rows.map((r) => r.id) } },
    orderBy: { createdAt: "desc" },
    take: take - rows.length,
  });
  return [...rows, ...extra].map(toListing);
}

export async function countListings(): Promise<number> {
  return prisma.listing.count();
}

export type NeighborhoodSummary = {
  name: string;
  count: number;
  fromPrice: number;
};

// Blacksburg neighborhoods that currently have listings, busiest first.
export async function getNeighborhoods(): Promise<NeighborhoodSummary[]> {
  const groups = await prisma.listing.groupBy({
    by: ["neighborhood"],
    where: { city: { contains: HOME_CITY, mode: "insensitive" } },
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
  const row = await prisma.listing.findUnique({ where: { id } });
  return row ? toListing(row) : null;
}

export type Host = { name: string | null; memberSince: Date };

// A listing plus the public bits of whoever posted it.
export async function getListingWithHost(
  id: string,
): Promise<{ listing: Listing; host: Host | null } | null> {
  const row = await prisma.listing.findUnique({
    where: { id },
    include: { owner: { select: { name: true, createdAt: true } } },
  });
  if (!row) return null;
  return {
    listing: toListing(row),
    host: row.owner
      ? { name: row.owner.name, memberSince: row.owner.createdAt }
      : null,
  };
}

// Listings owned by one user, newest first (for the "My listings" page).
export async function getListingsByOwner(ownerId: string): Promise<Listing[]> {
  const rows = await prisma.listing.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toListing);
}

// Inquiry counts per listing for one owner, keyed by listing id.
export async function getInquiryCounts(
  listingIds: string[],
): Promise<Record<string, number>> {
  if (listingIds.length === 0) return {};
  const groups = await prisma.inquiry.groupBy({
    by: ["listingId"],
    where: { listingId: { in: listingIds } },
    _count: { _all: true },
  });
  return Object.fromEntries(groups.map((g) => [g.listingId, g._count._all]));
}
