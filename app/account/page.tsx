import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/app/_lib/db";
import { countUnread } from "@/app/_lib/listings";
import { signOutAction } from "@/app/_lib/auth-actions";
import AccountNav from "@/app/account/AccountNav";
import { button, size } from "@/app/_components/ui";

export const metadata: Metadata = { title: "Profile" };

export default async function AccountPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login?next=/account");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { _count: { select: { listings: true } } },
  });
  if (!user) redirect("/login");
  const unread = await countUnread(userId);

  const memberSince = user.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
  const displayName = user.name || user.email;

  const rows = [
    { label: "Name", value: user.name || "Not set" },
    { label: "Email", value: user.email },
    { label: "Member since", value: memberSince },
    {
      label: "Listings posted",
      value: String(user._count.listings),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
      <h1 className="text-3xl font-bold tracking-[-0.025em]">Your account</h1>
      <AccountNav unread={unread} />

      <div className="mt-8 flex items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand-soft text-2xl font-bold text-brand-ink">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{displayName}</p>
          <p className="text-[15px] text-ink-soft">
            On SummerStay since {memberSince}
          </p>
        </div>
      </div>

      <dl className="mt-8 divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-0.5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <dt className="text-[15px] text-ink-soft">{row.label}</dt>
            <dd className="truncate font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>

      <form action={signOutAction} className="mt-8">
        <button type="submit" className={`${button.secondary} ${size.md}`}>
          Log out
        </button>
      </form>
    </div>
  );
}
