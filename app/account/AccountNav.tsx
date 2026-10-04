"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/account/listings", label: "My listings" },
  { href: "/account", label: "Profile" },
];

// Tabs shared by the two account pages.
export default function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="mt-6 flex gap-1 border-b border-line">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 px-3 pb-3 pt-1 text-[15px] font-semibold transition-colors ${
              active
                ? "border-brand-ink text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
