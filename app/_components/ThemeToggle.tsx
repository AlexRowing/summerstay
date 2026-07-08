"use client";

import { useTheme } from "next-themes";

/*
  One button, two icons stacked on top of each other. CSS does the
  animation: in light mode the sun is visible and the moon is rotated
  away at zero size; adding .dark flips both. This is the same pattern
  shadcn/ui uses, with hand-written SVGs instead of an icon library.
*/
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative flex size-8 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:text-ink"
    >
      {/* Sun */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="size-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
      </svg>
      {/* Moon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute size-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
      </svg>
    </button>
  );
}
