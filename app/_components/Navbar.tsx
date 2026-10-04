import Link from "next/link";
import { Search } from "lucide-react";
import { auth } from "@/auth";
import Logo from "@/app/_components/Logo";
import NavLink from "@/app/_components/NavLink";
import UserMenu from "@/app/_components/UserMenu";
import { button, size } from "@/app/_components/ui";
import { isAdminEmail } from "@/app/_lib/admin";
import { countUnread } from "@/app/_lib/listings";

export default async function Navbar() {
  const session = await auth();
  const unread = session?.user?.id ? await countUnread(session.user.id) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center sm:flex">
            <NavLink href="/listings">Find a place</NavLink>
          </div>
          {/* On phones the browse link collapses to an icon so it's always
              reachable, logged in or not. */}
          <Link
            href="/listings"
            aria-label="Find a place"
            className="flex size-10 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-sunken hover:text-ink sm:hidden"
          >
            <Search className="size-5" strokeWidth={2} />
          </Link>

          {session?.user ? (
            <>
              <Link
                href="/host"
                className={`${button.primary} ${size.sm} ml-1 hidden sm:inline-flex`}
              >
                List your place
              </Link>
              <UserMenu
                name={session.user.name ?? null}
                email={session.user.email ?? ""}
                unread={unread}
                isAdmin={isAdminEmail(session.user.email)}
              />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap rounded-lg px-2 py-2 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink sm:px-3"
              >
                Log in
              </Link>
              <Link
                href="/host"
                className={`${button.primary} ${size.sm} ml-1`}
              >
                <span className="sm:hidden">Post</span>
                <span className="hidden sm:inline">List your place</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
