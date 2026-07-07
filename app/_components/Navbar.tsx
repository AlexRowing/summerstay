import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          SummerStay
        </Link>
        <Link href="/listings" className="text-sm font-medium hover:underline">
          Browse Listings
        </Link>
      </nav>
    </header>
  );
}
