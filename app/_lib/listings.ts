// Fake apartment data. Later this will come from a real database instead.
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
};

export const listings: Listing[] = [
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
  },
];

export function getListingById(id: string): Listing | undefined {
  return listings.find((listing) => listing.id === id);
}
