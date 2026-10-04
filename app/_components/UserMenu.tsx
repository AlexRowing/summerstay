"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  House,
  Inbox,
  LogOut,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { signOutAction } from "@/app/_lib/auth-actions";

const itemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[15px] text-ink transition-colors hover:bg-sunken";
const iconClass = "size-4 text-ink-soft";

// The signed-in menu in the navbar. Client component because it toggles
// open/closed and closes on an outside click or Escape.
export default function UserMenu({
  name,
  email,
  unread,
  isAdmin = false,
}: {
  name: string | null;
  email: string;
  unread: number;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const displayName = name || email;
  const initial = displayName.charAt(0).toUpperCase();
  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative ml-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={
          unread > 0
            ? `Account menu, ${unread} unread ${unread === 1 ? "message" : "messages"}`
            : "Account menu"
        }
        className="flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-sunken sm:pr-3"
      >
        <span className="relative flex size-9 items-center justify-center rounded-full bg-brand-soft text-[15px] font-bold text-brand-ink">
          {initial}
          {unread > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-surface bg-accent"
            />
          )}
        </span>
        <span className="hidden max-w-[9rem] truncate text-[15px] font-medium sm:block">
          {name?.split(" ")[0] || displayName}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-xl border border-line bg-card p-1.5 shadow-[0_12px_32px_-8px_rgb(0_0_0/0.18)] motion-safe:animate-[menu-in_140ms_var(--ease-out-quart)]"
        >
          <div className="px-3 pb-2 pt-1.5">
            <p className="truncate text-[15px] font-semibold">{displayName}</p>
            {name && (
              <p className="truncate text-[13px] text-ink-soft">{email}</p>
            )}
          </div>
          <div className="my-1 h-px bg-line" />
          <Link
            href="/host"
            role="menuitem"
            className={itemClass}
            onClick={close}
          >
            <Plus className={iconClass} /> List your place
          </Link>
          <Link
            href="/messages"
            role="menuitem"
            className={itemClass}
            onClick={close}
          >
            <Inbox className={iconClass} /> Messages
            {unread > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-bold text-on-brand">
                {unread}
              </span>
            )}
          </Link>
          <Link
            href="/account/saved"
            role="menuitem"
            className={itemClass}
            onClick={close}
          >
            <Heart className={iconClass} /> Saved
          </Link>
          <Link
            href="/account/listings"
            role="menuitem"
            className={itemClass}
            onClick={close}
          >
            <House className={iconClass} /> My listings
          </Link>
          <Link
            href="/account"
            role="menuitem"
            className={itemClass}
            onClick={close}
          >
            <UserRound className={iconClass} /> Account
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              role="menuitem"
              className={itemClass}
              onClick={close}
            >
              <ShieldCheck className={iconClass} /> Moderation
            </Link>
          )}
          <div className="my-1 h-px bg-line" />
          <form action={signOutAction}>
            <button type="submit" role="menuitem" className={itemClass}>
              <LogOut className={iconClass} /> Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
