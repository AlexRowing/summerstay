"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/*
  next-themes needs to run in the browser (it reads localStorage and the
  OS theme), so this thin wrapper is a Client Component. Wrapping only
  {children} in the layout keeps the rest of the app as Server Components.

  - attribute="class"  → toggles the .dark class our CSS expects
  - defaultTheme="system" + enableSystem → follow the OS until the
    visitor picks a theme; their pick is saved in localStorage
*/
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
