import Link from "next/link";
import { LogoMark } from "@/app/_components/Logo";
import ThemeToggle from "@/app/_components/ThemeToggle";

const linkClass = "text-[15px] text-ink-soft transition-colors hover:text-ink";

const columns = [
  {
    heading: "Students",
    links: [
      { href: "/listings", label: "Find a place" },
      { href: "/host", label: "List your place" },
      { href: "/account/listings", label: "My listings" },
    ],
  },
  {
    heading: "SummerStay",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-sunken">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-7" />
            <span className="text-lg font-bold tracking-[-0.02em]">
              SummerStay
            </span>
          </div>
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-soft">
            Subleases from Hokies, for Hokies. Built by a student in Blacksburg.
            Not affiliated with Virginia Tech.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="text-sm font-semibold text-ink">{col.heading}</h2>
            <ul className="mt-3 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <p className="text-[13px] text-ink-soft">
            © {new Date().getFullYear()} SummerStay · Made by{" "}
            <a
              href="https://www.linkedin.com/in/alex-garcia-7174702b0/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:underline"
            >
              Alex Garcia
            </a>
          </p>
          <div className="flex items-center gap-1">
            <a
              href="https://github.com/AlexRowing"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex size-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-card hover:text-ink"
            >
              {/* GitHub's mark, inlined (lucide removed brand icons) */}
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-[18px]"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
