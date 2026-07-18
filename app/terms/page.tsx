import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of SummerStay, a student-to-student marketplace for summer sublets.",
};

const LAST_UPDATED = "July 18, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-12 pb-20">
      <p className="text-sm font-medium text-brand">Legal</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated {LAST_UPDATED}</p>

      <div className="mt-8 space-y-10 leading-relaxed text-ink-soft">
        <p>
          Welcome to SummerStay. These terms cover your use of our platform,
          where students post and browse summer sublets near campus. By creating
          an account or using the site, you agree to what follows.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">
            Who can use SummerStay
          </h2>
          <p>
            SummerStay is built for students looking to sublet housing for the
            summer. You need an account to post a listing, and you are
            responsible for keeping your login secure. You agree to provide
            accurate information and to use the platform only for lawful
            purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">
            Your listings and content
          </h2>
          <p>
            You can create, edit, and delete your own listings at any time. You
            are responsible for the accuracy of what you post, including prices,
            dates, locations, and photos. You agree that:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>You have the right to sublet the property you list.</li>
            <li>
              Your listing details and images are truthful and are yours to
              share.
            </li>
            <li>
              You will not post content that is misleading, unlawful, or
              infringes someone else&apos;s rights.
            </li>
          </ul>
          <p>
            You keep ownership of the content you post. By posting, you allow us
            to display it on SummerStay so others can find your listing. We may
            remove content that violates these terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">
            Agreements between users
          </h2>
          <p>
            SummerStay is a place to discover listings and get in touch. It is
            not a party to any sublease, rental agreement, or arrangement you
            make with another user.
          </p>
          <p className="font-medium text-ink">
            SummerStay is not responsible for agreements or disputes between
            renters and the landlords or tenants they connect with.
          </p>
          <p>
            You are responsible for verifying the other party, reviewing any
            lease terms, and complying with your own lease and local laws. We
            recommend meeting safely and confirming details in writing before
            exchanging money.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">Acceptable use</h2>
          <p>When using SummerStay, you agree not to:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Post fake, fraudulent, or duplicate listings.</li>
            <li>Harass other users or misuse their contact details.</li>
            <li>
              Attempt to disrupt, scrape, or gain unauthorized access to the
              platform.
            </li>
          </ul>
          <p>
            We may suspend or remove accounts that break these rules or misuse
            the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">Availability</h2>
          <p>
            We work to keep SummerStay running smoothly, but we provide the
            platform &ldquo;as is&rdquo; and cannot guarantee it will always be
            available or error-free. Features may change as the product evolves.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">Changes to these terms</h2>
          <p>
            We may update these terms as SummerStay grows. When we do, we will
            update the &ldquo;last updated&rdquo; date above. Continuing to use
            the platform means you accept the current terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">Contact us</h2>
          <p>
            Questions about these terms? Reach us through our{" "}
            <Link href="/contact" className="text-brand hover:underline">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
