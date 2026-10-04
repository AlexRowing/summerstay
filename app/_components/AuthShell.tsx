import { Check } from "lucide-react";

const points = [
  "Free to post, free to browse",
  "Subleases for summer, fall, spring, or winter break",
  "Manage and edit your listing anytime",
];

// Shared frame for the login and signup pages: the form on the left, a quiet
// maroon panel on the right (wide screens only) that says why to bother.
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16">
      <div className="mx-auto w-full max-w-sm lg:py-8">
        <h1 className="text-[1.75rem] font-bold tracking-[-0.025em]">
          {title}
        </h1>
        <p className="mt-1.5 text-ink-soft">{subtitle}</p>
        {children}
      </div>

      <div className="relative hidden overflow-hidden rounded-3xl bg-brand p-10 text-on-brand lg:flex lg:flex-col lg:justify-end">
        <svg
          viewBox="0 0 200 240"
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-8 h-[85%] opacity-[0.12]"
        >
          <path d="M30 240V90a70 70 0 0 1 140 0v150Z" fill="currentColor" />
        </svg>
        <p className="relative max-w-sm text-[1.75rem] font-bold leading-tight tracking-[-0.02em]">
          The easiest way to hand off a Blacksburg lease.
        </p>
        <ul className="relative mt-6 space-y-3">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-center gap-3 text-on-brand/85"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-on-brand/15">
                <Check
                  className="size-3.5"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
