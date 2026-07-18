import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the SummerStay team, or learn how to reach a host about a listing.",
};

const SUPPORT_EMAIL = "hello@summerstay.app";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-12 pb-20">
      <p className="text-sm font-medium text-brand">Support</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Contact us</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
        We&apos;re a small team helping students find and offer summer sublets.
        Whether you have a question, ran into a problem, or want to report a
        listing, here&apos;s how to reach us.
      </p>

      <div className="mt-10 space-y-4">
        <section className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-lg font-semibold">General questions & support</h2>
          <p className="mt-2 leading-relaxed text-ink-soft">
            Email us and we&apos;ll get back to you as soon as we can, usually
            within a couple of business days.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-4 inline-flex items-center rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
          >
            {SUPPORT_EMAIL}
          </a>
        </section>

        <section className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-lg font-semibold">Contacting a host</h2>
          <p className="mt-2 leading-relaxed text-ink-soft">
            Interested in a specific place? You don&apos;t need to email us. Open
            the listing and use the contact form on that page to message the
            host directly.
          </p>
          <Link
            href="/listings"
            className="mt-4 inline-flex items-center rounded-full border border-line bg-card px-6 py-3 font-medium transition-colors hover:border-ink-soft"
          >
            Browse listings
          </Link>
        </section>

        <section className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-lg font-semibold">Reporting a listing</h2>
          <p className="mt-2 leading-relaxed text-ink-soft">
            If a listing looks inaccurate or inappropriate, let us know at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-brand hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            with a link to the listing, and we&apos;ll review it.
          </p>
        </section>
      </div>
    </div>
  );
}
