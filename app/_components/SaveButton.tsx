"use client";

import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { setSaved } from "@/app/account/actions";

// The heart. Flips instantly (optimistic) and saves in the background.
// Logged-out visitors are sent to log in and brought back here.
export default function SaveButton({
  listingId,
  initialSaved,
  loggedIn,
  variant = "overlay",
}: {
  listingId: string;
  initialSaved: boolean;
  loggedIn: boolean;
  variant?: "overlay" | "button";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSavedState] = useState(initialSaved);
  const [optimistic, setOptimistic] = useOptimistic(saved);
  const [, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!loggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    const next = !optimistic;
    startTransition(async () => {
      setOptimistic(next);
      const ok = await setSaved(listingId, next);
      if (ok) setSavedState(next);
    });
  }

  const label = optimistic ? "Remove from saved" : "Save this place";
  const heart = (
    <Heart
      className={`size-5 transition-transform duration-150 ${
        optimistic ? "scale-110 fill-brand stroke-brand" : ""
      }`}
      aria-hidden="true"
    />
  );

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={optimistic}
        className="inline-flex h-10 items-center gap-2 rounded-[10px] px-3 text-[15px] font-semibold text-ink transition-colors hover:bg-sunken"
      >
        {heart}
        {optimistic ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={optimistic}
      aria-label={label}
      title={label}
      className="flex size-10 items-center justify-center rounded-full bg-card/90 text-ink shadow-sm backdrop-blur-sm transition-[background-color,transform] duration-150 hover:bg-card active:scale-90"
    >
      {heart}
    </button>
  );
}
