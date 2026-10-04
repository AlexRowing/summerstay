import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ListingForm from "@/app/_components/ListingForm";
import { createListing } from "@/app/host/actions";

export const metadata: Metadata = { title: "List your place" };

export default async function HostPage() {
  // Posting requires an account; send signed-out visitors to log in first.
  const session = await auth();
  if (!session?.user) redirect("/login?next=/host");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
      <h1 className="text-3xl font-bold tracking-[-0.025em] sm:text-[2.25rem]">
        List your place
      </h1>
      <p className="mt-1.5 max-w-xl text-ink-soft">
        Leaving for the summer, a semester, or winter break? Post your place and
        let someone take over the rent while you&apos;re gone.
      </p>
      <ListingForm action={createListing} submitLabel="Publish listing" />
    </div>
  );
}
