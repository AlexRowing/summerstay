import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BellRing, Heart, X } from "lucide-react";
import { auth } from "@/auth";
import AccountNav from "@/app/account/AccountNav";
import { deleteSearchAlert } from "@/app/account/actions";
import ListingCard from "@/app/_components/ListingCard";
import { button, size } from "@/app/_components/ui";
import { prisma } from "@/app/_lib/db";
import { alertHref, describeAlert } from "@/app/_lib/format";
import { getSavedListings, hasEnded } from "@/app/_lib/listings";
import { countAllUnread } from "@/app/_lib/messages";

export const metadata: Metadata = { title: "Saved" };

export default async function SavedPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login?next=/account/saved");

  const [saved, alerts, unread] = await Promise.all([
    getSavedListings(userId),
    prisma.searchAlert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    countAllUnread(userId),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
      <h1 className="text-3xl font-bold tracking-[-0.025em]">Your account</h1>
      <AccountNav unread={unread} />

      <section className="mt-8">
        <h2 className="text-xl font-bold tracking-[-0.01em]">Saved places</h2>
        {saved.length === 0 ? (
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-sunken p-5">
            <Heart
              className="mt-0.5 size-5 shrink-0 text-ink-soft"
              aria-hidden="true"
            />
            <p className="text-[15px] text-ink-soft">
              Tap the heart on any place to keep it here while you decide.{" "}
              <Link
                href="/listings"
                className="font-semibold text-brand-ink underline-offset-4 hover:underline"
              >
                Find a place
              </Link>
            </p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
            {saved.map((listing) => {
              const gone = listing.isTaken || hasEnded(listing);
              return (
                <div
                  key={listing.id}
                  className={gone ? "opacity-60" : undefined}
                >
                  <ListingCard
                    listing={listing}
                    save={{ saved: true, loggedIn: true }}
                  />
                  {gone && (
                    <p className="mt-1.5 px-0.5 text-sm font-semibold text-ink-soft">
                      {listing.isTaken ? "Taken" : "Dates have passed"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold tracking-[-0.01em]">Search alerts</h2>
        <p className="mt-1 text-[15px] text-ink-soft">
          We email you when a new place matches. Turn one on from any search.
        </p>
        {alerts.length === 0 ? (
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-sunken p-5">
            <BellRing
              className="mt-0.5 size-5 shrink-0 text-ink-soft"
              aria-hidden="true"
            />
            <p className="text-[15px] text-ink-soft">
              No alerts yet. Search for what you need, then press{" "}
              <span className="font-semibold text-ink">Turn on alerts</span>.
            </p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <Link
                  href={alertHref(alert)}
                  className="flex min-w-0 items-center gap-2.5 font-medium underline-offset-4 hover:underline"
                >
                  <BellRing
                    className="size-4 shrink-0 text-brand-ink"
                    aria-hidden="true"
                  />
                  <span className="truncate">{describeAlert(alert)}</span>
                </Link>
                <form action={deleteSearchAlert}>
                  <input type="hidden" name="id" value={alert.id} />
                  <button
                    type="submit"
                    aria-label={`Turn off alert: ${describeAlert(alert)}`}
                    className={`${button.ghost} ${size.sm}`}
                  >
                    <X className="size-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Turn off</span>
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
