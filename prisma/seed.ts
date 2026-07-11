import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

// Prisma 7 talks to the database through a driver adapter; PrismaPg connects
// to the Postgres database named in DATABASE_URL. dotenv (above) loads .env
// because tsx does not auto-load it.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// The starter apartments. `amenities` is stored as a JSON string;
// app/_lib/listings.ts parses it back to an array. `createdAt` is set
// explicitly and increasing so newest-first ordering is stable across seeds.
const base = new Date("2026-01-01T00:00:00Z").getTime();

const seedListings = [
  {
    id: "1",
    title: "Sunny 2BR Near Central Campus",
    city: "Ann Arbor, MI",
    neighborhood: "Kerrytown",
    pricePerMonth: 950,
    bedrooms: 2,
    bathrooms: 1,
    distanceToCampus: "0.4 miles from campus",
    availability: "June 1 - Aug 20",
    description:
      "Bright and quiet 2-bedroom apartment a short walk from central campus. Perfect for a summer sublet while the school year is out.",
    amenities: ["Wi-Fi", "Air conditioning", "In-unit laundry", "Parking spot"],
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "2",
    title: "Cozy Studio Steps from Sproul Plaza",
    city: "Berkeley, CA",
    neighborhood: "Southside",
    pricePerMonth: 1400,
    bedrooms: 1,
    bathrooms: 1,
    distanceToCampus: "0.1 miles from campus",
    availability: "May 15 - Aug 15",
    description:
      "Fully furnished studio in the heart of Southside. Great for a single student staying for summer research or an internship.",
    amenities: ["Wi-Fi", "Furnished", "Rooftop access"],
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "3",
    title: "3BR House with Backyard",
    city: "Austin, TX",
    neighborhood: "West Campus",
    pricePerMonth: 1800,
    bedrooms: 3,
    bathrooms: 2,
    distanceToCampus: "0.6 miles from campus",
    availability: "June 1 - Aug 31",
    description:
      "Whole house sublet, great for a group of friends splitting rent over the summer. Fenced backyard and off-street parking.",
    amenities: ["Wi-Fi", "Backyard", "Dishwasher", "Off-street parking"],
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "4",
    title: "Modern 1BR Near the T",
    city: "Boston, MA",
    neighborhood: "Allston",
    pricePerMonth: 1600,
    bedrooms: 1,
    bathrooms: 1,
    distanceToCampus: "0.8 miles from campus",
    availability: "May 20 - Aug 25",
    description:
      "Recently renovated 1-bedroom close to the Green Line. Ideal for a summer internship in the city.",
    amenities: ["Wi-Fi", "In-unit laundry", "Air conditioning"],
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "5",
    title: "Shared 4BR Near State Street",
    city: "Madison, WI",
    neighborhood: "State Street",
    pricePerMonth: 700,
    bedrooms: 4,
    bathrooms: 2,
    distanceToCampus: "0.3 miles from campus",
    availability: "June 1 - Aug 15",
    description:
      "One room available in a 4-bedroom sublet. Roommates are friendly and mostly gone during the day for internships.",
    amenities: ["Wi-Fi", "Shared kitchen", "Bike storage"],
    imageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "6",
    title: "Quiet 2BR Near Franklin Street",
    city: "Chapel Hill, NC",
    neighborhood: "Northside",
    pricePerMonth: 1100,
    bedrooms: 2,
    bathrooms: 1,
    distanceToCampus: "0.5 miles from campus",
    availability: "May 10 - Aug 10",
    description:
      "Peaceful street close to campus, great for summer classes. Includes a small porch and shared laundry in the building.",
    amenities: ["Wi-Fi", "Porch", "Laundry in building"],
    imageUrl:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=60",
  },
];

async function main() {
  for (const [index, listing] of seedListings.entries()) {
    const { amenities, ...rest } = listing;
    const data = {
      ...rest,
      amenities: JSON.stringify(amenities),
      createdAt: new Date(base + index * 60_000),
    };
    // upsert = create it, or overwrite it if this id already exists, so
    // re-running the seed is safe and doesn't create duplicates.
    await prisma.listing.upsert({
      where: { id: listing.id },
      create: data,
      update: data,
    });
  }
  console.log(`Seeded ${seedListings.length} listings.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
