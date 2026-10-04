import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

// Prisma 7 talks to the database through a driver adapter; PrismaPg connects
// to the Postgres database named in DATABASE_URL. dotenv (above) loads .env
// because tsx does not auto-load it.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Sample Blacksburg listings so a fresh database isn't empty. They have no
// owner, so the site labels them "Sample listing" and doesn't take messages
// for them. `createdAt` is set explicitly and increasing
// so newest-first ordering is stable across seeds.
const base = new Date("2026-02-01T05:00:00Z").getTime();

const seedListings = [
  {
    id: "cmrhfygaz0000c0c2cmqs9h8v",
    lat: 37.2392,
    lng: -80.417,
    title: "Sunny 2BR near the Drillfield",
    city: "Blacksburg, VA",
    neighborhood: "North Main",
    pricePerMonth: 780,
    bedrooms: 2,
    bathrooms: 1,
    distanceToCampus: "0.3 miles from campus",
    availability: "May 15 - Aug 15",
    description:
      "Bright 2-bedroom a short walk to the Drillfield, ideal for a summer at Virginia Tech.",
    amenities: ["Wi-Fi", "Air conditioning", "Parking spot"],
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "cmrhfygaz0001c0c2ds2ftek1",
    lat: 37.2338,
    lng: -80.4108,
    title: "4BR House on Progress Street",
    city: "Blacksburg, VA",
    neighborhood: "Progress Street",
    pricePerMonth: 1600,
    bedrooms: 4,
    bathrooms: 2,
    distanceToCampus: "0.6 miles from campus",
    availability: "June 1 - Aug 20",
    description:
      "Whole house for a group subletting over the summer. Big porch and backyard.",
    amenities: ["Wi-Fi", "Backyard", "In-unit laundry", "Parking spot"],
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "cmrhfygaz0002c0c20tcl88ql",
    lat: 37.2296,
    lng: -80.4142,
    title: "Room in a friendly 3BR downtown",
    city: "Blacksburg, VA",
    neighborhood: "Downtown Blacksburg",
    pricePerMonth: 550,
    bedrooms: 3,
    bathrooms: 2,
    distanceToCampus: "0.4 miles from campus",
    availability: "May 20 - Aug 10",
    description:
      "One room open in a 3-bed, steps from Main Street restaurants.",
    amenities: ["Wi-Fi", "Furnished", "Shared kitchen"],
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "cmrhfygaz0003c0c2oy192yg8",
    lat: 37.2378,
    lng: -80.4293,
    title: "Quiet studio on University City Blvd",
    city: "Blacksburg, VA",
    neighborhood: "University City",
    pricePerMonth: 700,
    bedrooms: 1,
    bathrooms: 1,
    distanceToCampus: "0.9 miles from campus",
    availability: "May 15 - Aug 15",
    description:
      "Quiet studio on the bus line to campus, great for summer research.",
    amenities: ["Wi-Fi", "Air conditioning", "Bus route"],
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "cmrhfygaz0004c0c2cm3b9lcs",
    lat: 37.2398,
    lng: -80.4393,
    title: "2BR at Foxridge with pool access",
    city: "Blacksburg, VA",
    neighborhood: "Foxridge",
    pricePerMonth: 900,
    bedrooms: 2,
    bathrooms: 2,
    distanceToCampus: "1.2 miles from campus",
    availability: "June 1 - Aug 31",
    description:
      "Apartment-complex 2-bed with pool access, on the BT bus route.",
    amenities: ["Wi-Fi", "Pool", "Parking spot", "Bus route"],
    imageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "cmrhfygaz0005c0c2gotx0es3",
    lat: 37.2318,
    lng: -80.4385,
    title: "5BR house near Prices Fork",
    city: "Blacksburg, VA",
    neighborhood: "Prices Fork",
    pricePerMonth: 2000,
    bedrooms: 5,
    bathrooms: 3,
    distanceToCampus: "0.7 miles from campus",
    availability: "June 1 - Aug 15",
    description:
      "Large house for a big group, plenty of parking and a grill out back.",
    amenities: ["Wi-Fi", "Backyard", "Parking spot", "In-unit laundry"],
    imageUrl:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "cmrhfygaz0006c0c2683zok4s",
    lat: 37.2472,
    lng: -80.433,
    title: "Cozy 1BR on Toms Creek Rd",
    city: "Blacksburg, VA",
    neighborhood: "Toms Creek",
    pricePerMonth: 720,
    bedrooms: 1,
    bathrooms: 1,
    distanceToCampus: "1.0 miles from campus",
    availability: "May 10 - Aug 10",
    description: "Cozy one-bedroom close to the Huckleberry Trail.",
    amenities: ["Wi-Fi", "Air conditioning", "Trail access"],
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "cmrhfygaz0007c0c2vruyuc2a",
    lat: 37.2142,
    lng: -80.4452,
    title: "Furnished 2BR in Hethwood",
    city: "Blacksburg, VA",
    neighborhood: "Hethwood",
    pricePerMonth: 850,
    bedrooms: 2,
    bathrooms: 1,
    distanceToCampus: "1.4 miles from campus",
    availability: "May 15 - Aug 20",
    description: "Fully furnished, just bring a suitcase. On the bus line.",
    amenities: ["Wi-Fi", "Furnished", "Bus route", "Parking spot"],
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "cmrhfygaz0008c0c26fp27w9b",
    lat: 37.2437,
    lng: -80.4232,
    title: "3BR townhouse near Patrick Henry",
    city: "Blacksburg, VA",
    neighborhood: "Patrick Henry",
    pricePerMonth: 1350,
    bedrooms: 3,
    bathrooms: 2,
    distanceToCampus: "0.8 miles from campus",
    availability: "June 1 - Aug 25",
    description: "Townhouse with a garage, good for three roommates.",
    amenities: ["Wi-Fi", "Garage", "In-unit laundry"],
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "cmrhfygaz0009c0c2fowdsgok",
    lat: 37.2311,
    lng: -80.4126,
    title: "Room in 4BR steps from Squires",
    city: "Blacksburg, VA",
    neighborhood: "Downtown Blacksburg",
    pricePerMonth: 600,
    bedrooms: 4,
    bathrooms: 2,
    distanceToCampus: "0.2 miles from campus",
    availability: "May 20 - Aug 15",
    description:
      "About the closest sublet to campus you will find, one room in a 4-bed.",
    amenities: ["Wi-Fi", "Furnished", "Shared kitchen"],
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=60",
  },
];

async function main() {
  for (const [index, listing] of seedListings.entries()) {
    const data = {
      ...listing,
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
