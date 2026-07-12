"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
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

// What the listing form renders back: an error message, or nothing on success
// (a successful submit redirects instead of returning).
export type HostFormState = { error?: string };

// The columns a listing form writes. Shared by create and update.
type ListingFields = {
  title: string;
  city: string;
  neighborhood: string;
  pricePerMonth: number;
  bedrooms: number;
  bathrooms: number;
  distanceToCampus: string;
  availability: string;
  description: string;
  amenities: string;
  imageUrl: string;
};

// Read + validate the form fields once, so create and update stay in sync.
// Returns either an error message or the clean data to write.
function readListingFields(
  formData: FormData,
): { error: string } | { data: ListingFields } {
  const text = (name: string) => String(formData.get(name) ?? "").trim();

  const title = text("title");
  const city = text("city");
  const neighborhood = text("neighborhood");
  const distanceToCampus = text("distanceToCampus");
  const availability = text("availability");
  const description = text("description");

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

  const priceRaw = text("pricePerMonth");
  const bedroomsRaw = text("bedrooms");
  const bathroomsRaw = text("bathrooms");
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

  return {
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
  };
}

// Create a new listing owned by the logged-in user.
export async function createListing(
  _prev: HostFormState,
  formData: FormData,
): Promise<HostFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to post a listing." };
  }

  const parsed = readListingFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  const listing = await prisma.listing.create({
    data: { ...parsed.data, ownerId: session.user.id },
  });

  revalidatePath("/");
  revalidatePath("/listings");
  redirect(`/listings/${listing.id}`);
}

// Update an existing listing — only the user who owns it may do so.
export async function updateListing(
  _prev: HostFormState,
  formData: FormData,
): Promise<HostFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const id = String(formData.get("id") ?? "");
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return { error: "That listing no longer exists." };
  if (existing.ownerId !== session.user.id) {
    return { error: "You can only edit your own listings." };
  }

  const parsed = readListingFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  await prisma.listing.update({ where: { id }, data: parsed.data });

  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath(`/listings/${id}`);
  redirect(`/listings/${id}`);
}

// Delete a listing — only the owner may do so. Throws (rather than returning)
// on an unauthorized attempt, since the UI only ever shows delete to owners.
export async function deleteListing(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated.");

  const id = String(formData.get("id") ?? "");
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== session.user.id) {
    throw new Error("You are not allowed to delete this listing.");
  }

  await prisma.listing.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/listings");
  redirect("/listings");
}
