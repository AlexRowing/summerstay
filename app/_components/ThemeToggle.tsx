"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/*
  One button, two icons stacked. CSS swaps them: in light mode the sun shows
  and the moon is rotated away at zero size; the .dark class flips both.
*/
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative flex size-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-card hover:text-ink"
    >
      <Sun className="size-[18px] rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-[18px] rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
