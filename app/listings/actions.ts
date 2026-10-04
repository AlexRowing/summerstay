"use server";

import { after } from "next/server";
import { prisma } from "@/app/_lib/db";
import { sendInquiryEmail, sendReportEmail } from "@/app/_lib/email";
import { REPORT_REASONS, type ReportReason } from "@/app/_lib/format";

// What the contact form renders back: idle (fresh), sent (success), or error.
export type InquiryState = {
  status: "idle" | "sent" | "error";
  error?: string;
};

// Server Action for the "Contact host" form. useActionState calls it as
// (previousState, formData) and re-renders the form with whatever we return.
export async function createInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot: a field real people never see. Bots that fill every input get
  // a fake success and nothing is saved.
  if (String(formData.get("website") ?? "") !== "") return { status: "sent" };

  const listingId = String(formData.get("listingId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length > 100 || email.length > 200 || message.length > 2000) {
    return { status: "error", error: "That message is too long." };
  }
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
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { owner: { select: { email: true, name: true } } },
  });
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (
    !listing ||
    !listing.ownerId ||
    listing.isTaken ||
    listing.removedAt !== null ||
    (listing.endDate !== null && listing.endDate < today)
  ) {
    return { status: "error", error: "This listing is no longer available." };
  }

  // Light spam guard: one message per sender per listing every 10 minutes,
  // so a double-tap or a script can't flood a host's inbox and email.
  const recent = await prisma.inquiry.findFirst({
    where: {
      listingId,
      email: { equals: email, mode: "insensitive" },
      createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
    },
  });
  if (recent) {
    return {
      status: "error",
      error: "You just messaged this host. Give them a little time to reply.",
    };
  }

  await prisma.inquiry.create({ data: { listingId, name, email, message } });

  // Email the host once the response is on its way, so a slow mail provider
  // never holds up the student's confirmation.
  const owner = listing.owner;
  if (owner) {
    after(() =>
      sendInquiryEmail({
        to: owner.email,
        hostName: owner.name,
        listing: { id: listing.id, title: listing.title },
        from: { name, email, message },
      }),
    );
  }

  return { status: "sent" };
}

export type ReportState = { status: "idle" | "sent" | "error"; error?: string };

// Flag a listing for a moderator. Anyone can report; no account needed.
export async function reportListing(
  _prev: ReportState,
  formData: FormData,
): Promise<ReportState> {
  if (String(formData.get("website") ?? "") !== "") return { status: "sent" };

  const listingId = String(formData.get("listingId") ?? "");
  const reason = String(formData.get("reason") ?? "") as ReportReason;
  const details = String(formData.get("details") ?? "")
    .trim()
    .slice(0, 1000);
  const email = String(formData.get("email") ?? "")
    .trim()
    .slice(0, 200);

  if (!Object.hasOwn(REPORT_REASONS, reason)) {
    return { status: "error", error: "Pick a reason." };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, title: true },
  });
  if (!listing) return { status: "error", error: "That listing is gone." };

  // A cap so one listing can't be used to flood the moderation queue.
  const open = await prisma.report.count({
    where: { listingId, resolvedAt: null },
  });
  if (open < 20) {
    await prisma.report.create({
      data: {
        listingId,
        reason,
        details: details || null,
        email: email || null,
      },
    });
    after(() =>
      sendReportEmail({
        listing,
        reason: REPORT_REASONS[reason],
        details,
      }),
    );
  }
  return { status: "sent" };
}
