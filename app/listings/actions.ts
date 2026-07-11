"use server";

import { prisma } from "@/app/_lib/db";

// What the contact form renders back: idle (fresh), sent (success), or error.
export type InquiryState = { status: "idle" | "sent" | "error"; error?: string };

// Server Action for the "Contact host" form. useActionState calls it as
// (previousState, formData) and re-renders the form with whatever we return.
export async function createInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const listingId = String(formData.get("listingId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return {
      status: "error",
      error: "Please fill in your name, email, and a message.",
    };
  }
  // Light sanity check, not full validation — just catches obvious typos.
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: "error", error: "That email doesn't look right." };
  }

  // Confirm the listing still exists before recording interest in it.
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    return { status: "error", error: "This listing is no longer available." };
  }

  await prisma.inquiry.create({ data: { listingId, name, email, message } });
  return { status: "sent" };
}
