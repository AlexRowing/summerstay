import Link from "next/link";

// The brand mark: an open doorway (a place handed from one student to the
// next) with a burnt-orange knob. Drawn inline so it follows the theme tokens.
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="9" className="fill-brand" />
      <path
        d="M10.5 25.5V14.25a5.5 5.5 0 0 1 11 0V25.5Z"
        className="fill-on-brand"
      />
      <circle cx="18.6" cy="19.6" r="1.35" className="fill-accent" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-lg"
      aria-label="SummerStay home"
    >
      <LogoMark />
      <span className="text-[19px] font-bold tracking-[-0.02em] text-ink">
        SummerStay
      </span>
    </Link>
  );
}
