import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ListingForm from "@/app/_components/ListingForm";
import { createListing } from "@/app/host/actions";

export const metadata: Metadata = { title: "List your place" };

export default async function HostPage() {
  // Posting requires an account; send signed-out visitors to log in first.
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">List your place</h1>
      <p className="mt-2 text-ink-soft">
        Post your apartment and find a subletter for the summer.
      </p>
      <ListingForm action={createListing} submitLabel="Publish listing" />
    </div>
  );
}
