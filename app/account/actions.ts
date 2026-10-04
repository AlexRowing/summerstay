"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/app/_lib/db";
import { emailConfigured, sendVerifyEmail } from "@/app/_lib/email";
import { alertHref, isTerm } from "@/app/_lib/format";
import { linkOrigin } from "@/app/_lib/origin";
import {
  consumeEmailToken,
  createEmailToken,
  sentRecently,
} from "@/app/_lib/tokens";

export type VerifyState =
  | { status: "idle" }
  | { status: "sent"; email: string; devNote?: boolean }
  | { status: "error"; error: string };

const VT_EMAIL = /^[^@\s]+@vt\.edu$/;

// Step 1: email a confirmation link to a @vt.edu address.
export async function requestVtVerification(
  _prev: VerifyState,
  formData: FormData,
): Promise<VerifyState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { status: "error", error: "Log in first." };

  const email = String(formData.get("vtEmail") ?? "")
    .trim()
    .toLowerCase();
  if (!VT_EMAIL.test(email)) {
    return {
      status: "error",
      error: "Use your Virginia Tech address, ending in @vt.edu.",
    };
  }

  const taken = await prisma.user.findFirst({
    where: { vtEmail: email, NOT: { id: userId } },
  });
  if (taken) {
    return {
      status: "error",
      error: "That address is already verified on another account.",
    };
  }

  if (await sentRecently(userId, "verify_vt")) {
    return {
      status: "error",
      error:
        "We just sent a link. Give it a couple of minutes, then try again.",
    };
  }

  const token = await createEmailToken(userId, "verify_vt", email, 24 * 60);
  const url = `${await linkOrigin()}/verify?token=${token}`;
  const sent = await sendVerifyEmail(email, url);

  if (!sent) {
    if (!emailConfigured() && process.env.NODE_ENV !== "production") {
      // Local dev without Resend: the link is printed in the server console.
      return { status: "sent", email, devNote: true };
    }
    return {
      status: "error",
      error: "We couldn't send the email right now. Try again in a bit.",
    };
  }
  return { status: "sent", email };
}

// Step 2: the person clicked the link and pressed Confirm.
export async function confirmVtVerification(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  const row = await consumeEmailToken(token, "verify_vt");
  if (!row) redirect("/verify?token=invalid");

  const taken = await prisma.user.findFirst({
    where: { vtEmail: row.email, NOT: { id: row.userId } },
  });
  if (taken) redirect("/verify?token=invalid");

  await prisma.user.update({
    where: { id: row.userId },
    data: { vtEmail: row.email, vtVerifiedAt: new Date() },
  });

  // The badge shows on every listing this person posted.
  revalidatePath("/", "layout");
  redirect("/account?verified=1");
}

// Heart or un-heart a listing. Returns false when nobody is logged in.
export async function setSaved(
  listingId: string,
  saved: boolean,
): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return false;

  if (saved) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });
    if (!listing) return false;
    await prisma.savedListing.upsert({
      where: { userId_listingId: { userId, listingId } },
      create: { userId, listingId },
      update: {},
    });
  } else {
    await prisma.savedListing.deleteMany({ where: { userId, listingId } });
  }
  revalidatePath("/account/saved");
  return true;
}

const MAX_ALERTS = 10;

// Save the browse page's current filters as an email alert, then go back to
// the same search with a confirmation.
export async function createSearchAlert(formData: FormData): Promise<void> {
  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const num = (name: string) => {
    const n = Number(text(name));
    return text(name) !== "" && Number.isFinite(n) && n >= 0
      ? Math.round(n)
      : null;
  };
  const filters = {
    q: text("q").slice(0, 100) || null,
    maxPrice: num("maxPrice"),
    bedrooms: num("bedrooms"),
    term: isTerm(text("term")) ? text("term") : null,
    verified: text("verified") === "1",
  };
  const back = alertHref(filters);
  const withFlag = (flag: string) =>
    `${back}${back.includes("?") ? "&" : "?"}alert=${flag}`;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect(`/login?next=${encodeURIComponent(back)}`);

  const existing = await prisma.searchAlert.findMany({ where: { userId } });
  const duplicate = existing.some(
    (a) =>
      a.q === filters.q &&
      a.maxPrice === filters.maxPrice &&
      a.bedrooms === filters.bedrooms &&
      a.term === filters.term &&
      a.verified === filters.verified,
  );
  if (!duplicate) {
    if (existing.length >= MAX_ALERTS) redirect(withFlag("full"));
    await prisma.searchAlert.create({ data: { userId, ...filters } });
  }
  revalidatePath("/account/saved");
  redirect(withFlag("saved"));
}

export async function deleteSearchAlert(formData: FormData): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return;
  await prisma.searchAlert.deleteMany({
    where: { id: String(formData.get("id") ?? ""), userId },
  });
  revalidatePath("/account/saved");
}
