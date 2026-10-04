import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/auth";
import Thread from "@/app/messages/[id]/Thread";
import VerifiedBadge from "@/app/_components/VerifiedBadge";
import { formatPrice } from "@/app/_lib/format";
import { getThread, markThreadRead } from "@/app/_lib/messages";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false },
};

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect(`/login?next=/messages/${id}`);

  const thread = await getThread(id, userId);
  if (!thread) notFound();
  await markThreadRead(thread.id, thread.role);

  const { listing } = thread;
  const closed = listing.isTaken || listing.removedAt !== null;

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col px-4 sm:px-6">
      <div className="sticky top-16 z-10 border-b border-line bg-surface/95 pb-3 pt-4 backdrop-blur-md">
        <Link
          href="/messages"
          className="-ml-1 inline-flex items-center gap-0.5 rounded-lg py-1 pr-2 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Messages
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <Link
            href={`/listings/${listing.id}`}
            className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-sunken"
          >
            <Image
              src={listing.imageUrl}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          </Link>
          <div className="min-w-0">
            <h1 className="flex flex-wrap items-center gap-2 text-lg font-bold leading-tight">
              {thread.other.name}
              {thread.other.verified && <VerifiedBadge />}
            </h1>
            <p className="truncate text-[15px] text-ink-soft">
              {thread.role === "host" ? "Interested in " : "Host of "}
              <Link
                href={`/listings/${listing.id}`}
                className="font-medium text-ink underline-offset-4 hover:underline"
              >
                {listing.title}
              </Link>{" "}
              · {formatPrice(listing.pricePerMonth)}/mo
            </p>
          </div>
        </div>
      </div>

      <Thread
        conversationId={thread.id}
        otherName={thread.other.name.split(" ")[0]}
        closed={closed}
        messages={thread.messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
