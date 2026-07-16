import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/app/_lib/db";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) redirect("/login");

  const memberSince = user.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Account</h1>
      <p className="mt-2 text-ink-soft">Your SummerStay profile.</p>

      <dl className="mt-8 divide-y divide-line rounded-2xl border border-line bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <dt className="text-sm text-ink-soft">Name</dt>
          <dd className="font-medium">{user.name || "Not set"}</dd>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <dt className="text-sm text-ink-soft">Email</dt>
          <dd className="font-medium">{user.email}</dd>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <dt className="text-sm text-ink-soft">Member since</dt>
          <dd className="font-medium">{memberSince}</dd>
        </div>
      </dl>

      <Link
        href="/account/listings"
        className="mt-6 inline-block text-sm font-medium text-brand transition-colors hover:text-brand-dark"
      >
        View my listings →
      </Link>
    </div>
  );
}
