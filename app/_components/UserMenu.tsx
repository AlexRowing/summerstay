"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOutAction } from "@/app/_lib/auth-actions";

const itemClass =
  "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface";

// The signed-in menu in the navbar: shows the user's name/email and a small
// dropdown (Account, My listings, Log out). Client component because it toggles
// open/closed and closes on an outside click.
export default function UserMenu({
  name,
  email,
}: {
  name: string | null;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const displayName = name || email;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 transition-colors hover:border-ink-soft"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:block">
          {displayName}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-line bg-card p-1 shadow-lg"
        >
          <p className="truncate px-3 py-2 text-xs text-ink-soft">{email}</p>
          <div className="my-1 h-px bg-line" />
          <Link href="/account" className={itemClass} onClick={() => setOpen(false)}>
            Account
          </Link>
          <Link
            href="/account/listings"
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            My listings
          </Link>
          <form action={signOutAction}>
            <button type="submit" className={itemClass}>
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
