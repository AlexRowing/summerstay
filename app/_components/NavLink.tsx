"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// A top-bar link that marks itself as the current page. Client-side only
// because it needs the pathname; the rest of the navbar stays a Server
// Component.
export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-lg px-3 py-2 text-[15px] font-medium transition-colors duration-150 ${
        active ? "text-ink" : "text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
