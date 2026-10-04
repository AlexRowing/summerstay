import { BadgeCheck } from "lucide-react";

// Shown wherever a host has confirmed a @vt.edu email address.
export default function VerifiedBadge({
  variant = "inline",
}: {
  variant?: "inline" | "overlay";
}) {
  if (variant === "overlay") {
    return (
      <span className="flex items-center gap-1 rounded-md bg-card/95 px-2 py-1 text-xs font-semibold text-brand-ink shadow-sm">
        <BadgeCheck className="size-3.5" aria-hidden="true" />
        Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-0.5 text-[13px] font-semibold text-brand-ink">
      <BadgeCheck className="size-4" aria-hidden="true" />
      Verified Hokie
    </span>
  );
}
