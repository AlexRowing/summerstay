import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessagesSquare, Reply } from "lucide-react";
import { auth } from "@/auth";
import AccountNav from "@/app/account/AccountNav";
import { button, size } from "@/app/_components/ui";
import { timeAgo } from "@/app/_lib/format";
import { getInbox, markInboxRead } from "@/app/_lib/listings";
import { countAllUnread, getConversations } from "@/app/_lib/messages";

export const metadata: Metadata = { title: "Messages" };

// Every conversation the user is part of, as a host or as a student, plus
// any email-only inquiries from visitors who weren't logged in.
export default async function MessagesPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login?next=/messages");

  const [conversations, inquiries, unread] = await Promise.all([
    getConversations(userId),
    getInbox(userId),
    countAllUnread(userId),
  ]);
  if (inquiries.some((m) => m.unread)) await markInboxRead(userId);

  const empty = conversations.length === 0 && inquiries.length === 0;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
      <h1 className="text-3xl font-bold tracking-[-0.025em]">Your account</h1>
      <AccountNav unread={unread} />

      {empty ? (
        <div className="mx-auto mt-16 max-w-sm text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-sunken text-ink-soft">
            <MessagesSquare className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl font-bold">No messages yet</h2>
          <p className="mt-2 text-ink-soft">
            Message a host from any listing and the conversation lives here.
            When students reach out about your place, you&apos;ll see them here
            too.
          </p>
          <Link
            href="/listings"
            className={`${button.secondary} ${size.md} mt-6`}
          >
            Find a place
          </Link>
        </div>
      ) : (
        <>
          {conversations.length > 0 && (
            <ul className="mt-2 divide-y divide-line">
              {conversations.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/messages/${c.id}`}
                    className="-mx-3 flex items-center gap-4 rounded-xl px-3 py-4 transition-colors hover:bg-sunken"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-sunken">
                      <Image
                        src={c.listing.imageUrl}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span
                          className={`truncate ${c.unread ? "font-bold" : "font-semibold"}`}
                        >
                          {c.other.name}
                        </span>
                        {c.lastMessage && (
                          <span className="shrink-0 text-sm text-ink-soft">
                            {timeAgo(c.lastMessage.createdAt)}
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-sm text-ink-soft">
                        {c.role === "host" ? "About your listing: " : ""}
                        {c.listing.title}
                      </span>
                      {c.lastMessage && (
                        <span
                          className={`mt-0.5 flex items-center gap-2 text-[15px] ${
                            c.unread
                              ? "font-semibold text-ink"
                              : "text-ink-soft"
                          }`}
                        >
                          <span className="truncate">
                            {c.lastMessage.fromMe ? "You: " : ""}
                            {c.lastMessage.body}
                          </span>
                          {c.unread && (
                            <span
                              aria-label="Unread"
                              className="size-2.5 shrink-0 rounded-full bg-brand"
                            />
                          )}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {inquiries.length > 0 && (
            <section className="mt-12">
              <h2 className="text-lg font-bold">Email inquiries</h2>
              <p className="mt-1 text-[15px] text-ink-soft">
                From visitors who weren&apos;t logged in. Reply to them by
                email.
              </p>
              <ul className="mt-2 divide-y divide-line">
                {inquiries.map((m) => {
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
            </section>
          )}
        </>
      )}
    </div>
  );
}
