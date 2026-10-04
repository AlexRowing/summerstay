import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { House, Pencil, Plus } from "lucide-react";
import { auth } from "@/auth";
import AccountNav from "@/app/account/AccountNav";
import { button, size } from "@/app/_components/ui";
import { formatPrice } from "@/app/_lib/format";
import { getInquiryCounts, getListingsByOwner } from "@/app/_lib/listings";

export const metadata: Metadata = { title: "My listings" };

export default async function MyListingsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login?next=/account/listings");

  const listings = await getListingsByOwner(userId);
  const inquiries = await getInquiryCounts(listings.map((l) => l.id));

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-[-0.025em]">Your account</h1>
        {listings.length > 0 && (
          <Link href="/host" className={`${button.primary} ${size.sm}`}>
            <Plus className="size-4" aria-hidden="true" />
            New listing
          </Link>
        )}
      </div>
      <AccountNav />

      {listings.length === 0 ? (
        <div className="mx-auto mt-16 max-w-sm text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-sunken text-ink-soft">
            <House className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl font-bold">No listings yet</h2>
          <p className="mt-2 text-ink-soft">
            Leaving Blacksburg for a while? Post your place and it&apos;ll show
            up here, ready to edit anytime.
          </p>
          <Link href="/host" className={`${button.primary} ${size.md} mt-6`}>
            List your place
          </Link>
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {listings.map((listing) => {
            const count = inquiries[listing.id] ?? 0;
            return (
              <li key={listing.id} className="flex items-center gap-4 py-5">
                <Link
                  href={`/listings/${listing.id}`}
                  className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sunken sm:h-20 sm:w-28"
                >
                  <Image
                    src={listing.imageUrl}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="line-clamp-1 font-semibold underline-offset-4 hover:underline"
                  >
                    {listing.title}
                  </Link>
                  <p className="mt-0.5 line-clamp-1 text-[15px] text-ink-soft">
                    {formatPrice(listing.pricePerMonth)}/mo ·{" "}
                    {listing.availability}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {count === 0 ? (
                      <span className="text-ink-faint">No messages yet</span>
                    ) : (
                      <span className="text-success">
                        {count} {count === 1 ? "person" : "people"} interested
                      </span>
                    )}
                  </p>
                </div>
                <Link
                  href={`/listings/${listing.id}/edit`}
                  aria-label={`Edit ${listing.title}`}
                  className={`${button.secondary} ${size.sm}`}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
