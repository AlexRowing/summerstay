import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flag, Mail, MessageCircle } from "lucide-react";
import { button, size } from "@/app/_components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with SummerStay, or learn how to reach a host about a listing.",
};

const SUPPORT_EMAIL = "hello@summerstay.app";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-3xl font-bold tracking-[-0.025em] sm:text-[2.25rem]">
        Get in touch
      </h1>
      <p className="mt-2 max-w-xl text-lg leading-relaxed text-ink-soft">
        SummerStay is run by a student in Blacksburg. Questions, bugs, or a
        listing that looks off? Here&apos;s how to reach us.
      </p>

      <div className="mt-10 divide-y divide-line border-y border-line">
        <section className="flex gap-4 py-8">
          <Mail
            className="mt-0.5 size-5 shrink-0 text-ink-soft"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-lg font-bold">Questions and support</h2>
            <p className="mt-1.5 leading-relaxed text-ink-soft">
              Email us and we&apos;ll reply as soon as we can, usually within a
              couple of days.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className={`${button.primary} ${size.md} mt-4`}
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </section>

        <section className="flex gap-4 py-8">
          <MessageCircle
            className="mt-0.5 size-5 shrink-0 text-ink-soft"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-lg font-bold">Asking about a place</h2>
            <p className="mt-1.5 leading-relaxed text-ink-soft">
              No need to email us. Open the listing and use the message form on
              that page.
            </p>
            <Link
              href="/listings"
              className="group mt-3 inline-flex items-center gap-1.5 font-semibold text-brand-ink"
            >
              Find a place
              <ArrowRight
                className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>

        <section className="flex gap-4 py-8">
          <Flag
            className="mt-0.5 size-5 shrink-0 text-ink-soft"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-lg font-bold">Reporting a listing</h2>
            <p className="mt-1.5 leading-relaxed text-ink-soft">
              If a listing looks inaccurate, suspicious, or inappropriate, email{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Listing%20report`}
                className="font-semibold text-brand-ink underline-offset-4 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>{" "}
              with a link to it and we&apos;ll take a look.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
