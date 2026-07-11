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

// What the host form renders back: an error message, or nothing on success
// (a successful submit redirects instead of returning).
export type HostFormState = { error?: string };

/*
  Server Action for the "List your place" form. useActionState calls it as
  (previousState, formData). On bad input we return an error string that the
  form shows inline; on success we save the row and redirect to the new listing.
*/
export async function createListing(
  _prev: HostFormState,
  formData: FormData,
): Promise<HostFormState> {
  const text = (name: string) => String(formData.get(name) ?? "").trim();

  const title = text("title");
  const city = text("city");
  const neighborhood = text("neighborhood");
  const distanceToCampus = text("distanceToCampus");
  const availability = text("availability");
  const description = text("description");
  const priceRaw = text("pricePerMonth");
  const bedroomsRaw = text("bedrooms");
  const bathroomsRaw = text("bathrooms");

  if (
    !title ||
    !city ||
    !neighborhood ||
    !distanceToCampus ||
    !availability ||
    !description
  ) {
    return { error: "Please fill in every required field." };
  }

  // Reject empty or non-numeric values explicitly. Number("") is 0, which
  // would otherwise slip through as a valid price/count.
  const pricePerMonth = Number(priceRaw);
  const bedrooms = Number(bedroomsRaw);
  const bathrooms = Number(bathroomsRaw);
  if (
    priceRaw === "" ||
    bedroomsRaw === "" ||
    bathroomsRaw === "" ||
    !Number.isFinite(pricePerMonth) ||
    !Number.isFinite(bedrooms) ||
    !Number.isFinite(bathrooms) ||
    pricePerMonth < 0 ||
    bedrooms < 0 ||
    bathrooms < 0
  ) {
    return { error: "Price, bedrooms, and bathrooms must be valid numbers." };
  }

  const amenities = text("amenities")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const listing = await prisma.listing.create({
    data: {
      title,
      city,
      neighborhood,
      pricePerMonth: Math.round(pricePerMonth),
      bedrooms: Math.round(bedrooms),
      bathrooms: Math.round(bathrooms),
      distanceToCampus,
      availability,
      description,
      amenities: JSON.stringify(amenities),
      imageUrl: safeImageUrl(text("imageUrl")),
    },
  });

  // Refresh the pages that list apartments so the new one shows up.
  revalidatePath("/");
  revalidatePath("/listings");

  // Send the host to their freshly created listing.
  redirect(`/listings/${listing.id}`);
}
