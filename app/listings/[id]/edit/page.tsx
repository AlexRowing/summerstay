import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/auth";
import ListingForm from "@/app/_components/ListingForm";
import { updateListing } from "@/app/host/actions";
import { getListingById } from "@/app/_lib/listings";

export const metadata: Metadata = { title: "Edit listing" };

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) redirect("/login");

  const listing = await getListingById(id);
  if (!listing) notFound();

  // Only the owner may edit; send anyone else back to the listing.
  if (listing.ownerId !== session.user.id) {
    redirect(`/listings/${id}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6">
      <Link
        href={`/listings/${id}`}
        className="-ml-1 inline-flex items-center gap-0.5 rounded-lg py-1 pr-2 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Back to listing
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-[-0.025em] sm:text-[2.25rem]">
        Edit listing
      </h1>
      <p className="mt-1.5 text-ink-soft">
        Changes go live as soon as you save.
      </p>
      <ListingForm
        action={updateListing}
        listing={listing}
        submitLabel="Save changes"
      />
    </div>
  );
}
