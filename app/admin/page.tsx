import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flag } from "lucide-react";
import {
  dismissReports,
  removeListing,
  restoreListing,
} from "@/app/admin/actions";
import { button, size } from "@/app/_components/ui";
import { getAdminSession } from "@/app/_lib/admin";
import { prisma } from "@/app/_lib/db";
import { REPORT_REASONS, formatPrice, timeAgo } from "@/app/_lib/format";

export const metadata: Metadata = {
  title: "Moderation",
  robots: { index: false },
};

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const reasonText = (reason: string) =>
  REPORT_REASONS[reason as keyof typeof REPORT_REASONS] ?? reason;

function statusOf(l: {
  removedAt: Date | null;
  isTaken: boolean;
  endDate: Date | null;
  ownerId: string | null;
}) {
  if (l.removedAt)
    return { text: "Removed", tone: "bg-danger-soft text-danger" };
  if (!l.ownerId) return { text: "Sample", tone: "bg-sunken text-ink-soft" };
  if (l.isTaken) return { text: "Taken", tone: "bg-sunken text-ink-soft" };
  if (l.endDate && l.endDate < new Date())
    return { text: "Ended", tone: "bg-sunken text-ink-soft" };
  return { text: "Live", tone: "bg-success-soft text-success" };
}

// Moderators only (ADMIN_EMAILS). Everyone else gets a plain 404 so the page
// doesn't advertise that it exists.
export default async function AdminPage() {
  if (!(await getAdminSession())) notFound();

  const weekAgo = daysAgo(7);
  const [reported, listings, users, messagesThisWeek, verified] =
    await Promise.all([
      prisma.listing.findMany({
        where: { reports: { some: { resolvedAt: null } } },
        include: {
          owner: { select: { email: true } },
          reports: {
            where: { resolvedAt: null },
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.listing.findMany({
        orderBy: { createdAt: "desc" },
        include: { owner: { select: { email: true } } },
      }),
      prisma.user.count(),
      prisma.inquiry.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { vtVerifiedAt: { not: null } } }),
    ]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
      <h1 className="text-3xl font-bold tracking-[-0.025em]">Moderation</h1>
      <p className="mt-1.5 text-ink-soft">
        {users} {users === 1 ? "account" : "accounts"} · {verified} verified ·{" "}
        {listings.length} listings · {messagesThisWeek} messages this week
      </p>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Flag className="size-5 text-danger" aria-hidden="true" />
          Open reports
          <span className="text-base font-normal text-ink-soft">
            ({reported.length})
          </span>
        </h2>
        {reported.length === 0 ? (
          <p className="mt-3 rounded-xl bg-sunken px-4 py-3 text-[15px] text-ink-soft">
            Nothing to review. Reports from the &quot;Report this listing&quot;
            link show up here and are emailed to moderators.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reported.map((l) => (
              <li key={l.id} className="rounded-2xl border border-line p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <Link
                      href={`/listings/${l.id}`}
                      className="font-semibold underline-offset-4 hover:underline"
                    >
                      {l.title}
                    </Link>
                    <p className="text-sm text-ink-soft">
                      {l.owner?.email ?? "No owner (sample)"} ·{" "}
                      {formatPrice(l.pricePerMonth)}/mo
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <form action={dismissReports}>
                      <input type="hidden" name="id" value={l.id} />
                      <button
                        type="submit"
                        className={`${button.secondary} ${size.sm}`}
                      >
                        Dismiss
                      </button>
                    </form>
                    <form action={removeListing}>
                      <input type="hidden" name="id" value={l.id} />
                      <button
                        type="submit"
                        className={`${button.danger} ${size.sm}`}
                      >
                        Take down
                      </button>
                    </form>
                  </div>
                </div>
                <ul className="mt-4 space-y-3 border-t border-line pt-4">
                  {l.reports.map((r) => (
                    <li key={r.id} className="text-[15px]">
                      <p>
                        <span className="font-semibold">
                          {reasonText(r.reason)}
                        </span>{" "}
                        <span className="text-ink-soft">
                          · {timeAgo(r.createdAt)}
                          {r.email && <> · {r.email}</>}
                        </span>
                      </p>
                      {r.details && (
                        <p className="mt-0.5 whitespace-pre-line text-ink-soft">
                          {r.details}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">All listings</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[15px]">
            <thead className="border-b border-line text-sm text-ink-soft">
              <tr>
                <th className="py-2 pr-4 font-semibold">Listing</th>
                <th className="py-2 pr-4 font-semibold">Host</th>
                <th className="py-2 pr-4 font-semibold">Status</th>
                <th className="py-2 pr-4 font-semibold">Posted</th>
                <th className="py-2 font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {listings.map((l) => {
                const status = statusOf(l);
                return (
                  <tr key={l.id}>
                    <td className="max-w-[16rem] py-3 pr-4">
                      <Link
                        href={`/listings/${l.id}`}
                        className="line-clamp-1 font-medium underline-offset-4 hover:underline"
                      >
                        {l.title}
                      </Link>
                    </td>
                    <td className="max-w-[12rem] truncate py-3 pr-4 text-ink-soft">
                      {l.owner?.email ?? "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${status.tone}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-ink-soft">
                      {timeAgo(l.createdAt)}
                    </td>
                    <td className="py-3 text-right">
                      <form
                        action={l.removedAt ? restoreListing : removeListing}
                      >
                        <input type="hidden" name="id" value={l.id} />
                        <button
                          type="submit"
                          className={`${l.removedAt ? button.secondary : button.dangerOutline} ${size.sm}`}
                        >
                          {l.removedAt ? "Restore" : "Take down"}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
