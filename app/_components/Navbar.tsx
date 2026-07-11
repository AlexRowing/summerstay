import Link from "next/link";
import { auth, signOut } from "@/auth";

const brandButton =
  "whitespace-nowrap rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark";
const textLink =
  "text-sm font-medium text-ink-soft transition-colors hover:text-ink";

export default async function Navbar() {
  const session = await auth();

  return (
    /* sticky + backdrop-blur keeps the navbar pinned on top of content
       as you scroll, with a frosted-glass effect. */
    <header className="sticky top-0 z-50 border-b border-line bg-card/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            S
          </span>
          <span className="text-lg font-semibold tracking-tight">
            SummerStay
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/listings" className={`hidden sm:block ${textLink}`}>
            Browse listings
          </Link>
          {session?.user ? (
            <>
              <Link href="/host" className={brandButton}>
                List your place
              </Link>
              {/* Inline server action: signing out clears the session cookie
                  and returns home. */}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className={textLink}>
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={textLink}>
                Log in
              </Link>
              <Link href="/host" className={brandButton}>
                List your place
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
