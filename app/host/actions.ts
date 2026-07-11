"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/_lib/db";

// Used when the host leaves the photo field blank, or pastes a URL we can't
// safely display (see note below).
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=60";

// next/image only loads photos from hosts allow-listed in next.config.ts
// (currently just Unsplash). Accepting an arbitrary URL would crash the page
// when it renders, so anything else falls back to the placeholder.
function safeImageUrl(raw: string): string {
  return raw.startsWith("https://images.unsplash.com") ? raw : DEFAULT_IMAGE;
}

/*
  A Server Action: this runs on the server when the host submits the form.
  The form passes its fields as FormData. We read them, do light validation,
  save a new row, refresh the pages that list apartments, then send the host
  to their new listing.
*/
export async function createListing(formData: FormData) {
  // Read text fields, trimming whitespace.
  const text = (name: string) => String(formData.get(name) ?? "").trim();
  // Read number fields as whole numbers (the DB columns are integers).
  const number = (name: string) => Math.round(Number(formData.get(name)));

  const title = text("title");
  const city = text("city");
  const neighborhood = text("neighborhood");
  const pricePerMonth = number("pricePerMonth");
  const bedrooms = number("bedrooms");
  const bathrooms = number("bathrooms");
  const distanceToCampus = text("distanceToCampus");
  const availability = text("availability");
  const description = text("description");

  // The form collects amenities as a comma-separated string; split it into a
  // clean array (drop blanks) to match how listings store amenities.
  const amenities = text("amenities")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const imageUrl = safeImageUrl(text("imageUrl"));

  // Safety net behind the form's own required/number validation. If bad data
  // still arrives (e.g. the action is called directly), stop with a clear
  // error instead of writing a broken listing.
  if (!title || !city || !neighborhood || !distanceToCampus || !availability || !description) {
    throw new Error("Please fill in all required fields.");
  }
  if (
    !Number.isFinite(pricePerMonth) ||
    !Number.isFinite(bedrooms) ||
    !Number.isFinite(bathrooms) ||
    pricePerMonth < 0 ||
    bedrooms < 0 ||
    bathrooms < 0
  ) {
    throw new Error("Price, bedrooms, and bathrooms must be valid numbers.");
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      city,
      neighborhood,
      pricePerMonth,
      bedrooms,
      bathrooms,
      distanceToCampus,
      availability,
      description,
      amenities: JSON.stringify(amenities),
      imageUrl,
    },
  });

  // Tell Next.js the listing pages are now stale so the new one shows up.
  revalidatePath("/");
  revalidatePath("/listings");

  // Send the host to their freshly created listing.
  redirect(`/listings/${listing.id}`);
}
