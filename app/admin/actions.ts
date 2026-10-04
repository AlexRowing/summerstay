"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/app/_lib/admin";
import { prisma } from "@/app/_lib/db";

async function requireAdmin() {
  if (!(await getAdminSession())) throw new Error("Not allowed.");
}

function refresh(listingId: string) {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath(`/listings/${listingId}`);
}

// Take a listing down and close its open reports.
export async function removeListing(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.$transaction([
    prisma.listing.update({ where: { id }, data: { removedAt: new Date() } }),
    prisma.report.updateMany({
      where: { listingId: id, resolvedAt: null },
      data: { resolvedAt: new Date() },
    }),
  ]);
  refresh(id);
}

// Put a removed listing back.
export async function restoreListing(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.listing.update({ where: { id }, data: { removedAt: null } });
  refresh(id);
}

// Close a listing's open reports without taking it down.
export async function dismissReports(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.report.updateMany({
    where: { listingId: id, resolvedAt: null },
    data: { resolvedAt: new Date() },
  });
  refresh(id);
}
