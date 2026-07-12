import { prisma } from "@/app/_lib/db";
import type {
  Listing as ListingRow,
  Prisma,
} from "@/app/generated/prisma/client";

// The shape the rest of the app uses. Same as before the database existed,
// so pages and components didn't need to change how they read a listing.
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
};

// The one place that translates a raw database row into a Listing. The DB
// stores amenities as a JSON string, so we parse it back into an array here
// and drop DB-only fields like createdAt.
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
  };
}

// Optional filters for the browse page, all combined with AND.
export type ListingFilters = {
  city?: string;
  maxPrice?: number;
  bedrooms?: number;
};

// Every listing (newest first), optionally narrowed by the search filters.
export async function getListings(
  filters: ListingFilters = {},
): Promise<Listing[]> {
  const where: Prisma.ListingWhereInput = {};
  if (filters.city) {
    where.city = { contains: filters.city, mode: "insensitive" };
  }
  if (filters.maxPrice !== undefined) {
    where.pricePerMonth = { lte: filters.maxPrice };
  }
  if (filters.bedrooms !== undefined) {
    where.bedrooms = { gte: filters.bedrooms };
  }

  const rows = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toListing);
}

// A single listing, or null if no listing has that id.
export async function getListingById(id: string): Promise<Listing | null> {
  const row = await prisma.listing.findUnique({ where: { id } });
  return row ? toListing(row) : null;
}
