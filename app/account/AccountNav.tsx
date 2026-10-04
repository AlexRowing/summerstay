"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Tabs shared by the account pages. `unread` is the number of inbox messages
// the host hasn't opened yet.
export default function AccountNav({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();
  const tabs = [
    { href: "/messages", label: "Messages", badge: unread },
    { href: "/account/saved", label: "Saved", badge: 0 },
    { href: "/account/listings", label: "My listings", badge: 0 },
    { href: "/account", label: "Profile", badge: 0 },
  ];

  return (
    <nav
      aria-label="Account"
      className="mt-6 flex gap-1 overflow-x-auto shadow-[inset_0_-1px_0_var(--line)]"
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-3 pb-3 pt-1 text-[15px] font-semibold transition-colors ${
              active
                ? "border-brand-ink text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.badge > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-bold text-on-brand">
                {tab.badge}
                <span className="sr-only"> unread</span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
