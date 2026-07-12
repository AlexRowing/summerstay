import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import ListingForm from "@/app/_components/ListingForm";
import { updateListing } from "@/app/host/actions";
import { getListingById } from "@/app/_lib/listings";

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
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Edit listing</h1>
      <p className="mt-2 text-ink-soft">Update the details for your place.</p>
      <ListingForm
        action={updateListing}
        listing={listing}
        submitLabel="Save changes"
      />
    </div>
  );
}
