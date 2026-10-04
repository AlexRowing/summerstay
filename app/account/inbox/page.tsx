import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, Reply } from "lucide-react";
import { auth } from "@/auth";
import AccountNav from "@/app/account/AccountNav";
import { button, size } from "@/app/_components/ui";
import { timeAgo } from "@/app/_lib/format";
import { getInbox, markInboxRead } from "@/app/_lib/listings";

export const metadata: Metadata = { title: "Inbox" };

// Messages students sent about this host's listings. Opening the page marks
// them read; the ones that were new on arrival keep a "New" tag this visit.
export default async function InboxPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login?next=/account/inbox");

  const messages = await getInbox(userId);
  if (messages.some((m) => m.unread)) await markInboxRead(userId);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
      <h1 className="text-3xl font-bold tracking-[-0.025em]">Your account</h1>
      <AccountNav />

      {messages.length === 0 ? (
        <div className="mx-auto mt-16 max-w-sm text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-sunken text-ink-soft">
            <Inbox className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl font-bold">No messages yet</h2>
          <p className="mt-2 text-ink-soft">
            When a student reaches out about one of your listings, their message
            shows up here with their email so you can reply.
          </p>
          <Link
            href="/account/listings"
            className={`${button.secondary} ${size.md} mt-6`}
          >
            View my listings
          </Link>
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {messages.map((m) => {
            const subject = `Re: ${m.listing.title} on SummerStay`;
            const mailto = `mailto:${m.email}?subject=${encodeURIComponent(subject)}`;
            return (
              <li key={m.id} className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-semibold">
                      {m.name}
                      {m.unread && (
                        <span className="rounded-md bg-accent px-1.5 py-0.5 text-[11px] font-bold text-[oklch(0.2_0.03_50)]">
                          New
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-[15px] text-ink-soft">
                      {m.email} · about{" "}
                      <Link
                        href={`/listings/${m.listing.id}`}
                        className="font-medium text-ink underline-offset-4 hover:underline"
                      >
                        {m.listing.title}
                      </Link>
                    </p>
                  </div>
                  <time
                    dateTime={m.createdAt.toISOString()}
                    className="shrink-0 text-sm text-ink-soft"
                  >
                    {timeAgo(m.createdAt)}
                  </time>
                </div>
                <p className="mt-3 max-w-[65ch] whitespace-pre-line leading-relaxed">
                  {m.message}
                </p>
                <a
                  href={mailto}
                  className={`${button.secondary} ${size.sm} mt-4`}
                >
                  <Reply className="size-4" aria-hidden="true" />
                  Reply by email
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
