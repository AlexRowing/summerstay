import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SummerStay collects, uses, and protects your information as a student summer-sublet marketplace.",
};

const LAST_UPDATED = "July 18, 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-12 pb-20">
      <p className="text-sm font-medium text-brand">Legal</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated {LAST_UPDATED}</p>

      <div className="mt-8 space-y-10 leading-relaxed text-ink-soft">
        <p>
          SummerStay is a student-to-student marketplace for summer sublets near
          campus. This policy explains what we collect, why we collect it, and
          the choices you have. We aim to collect only what we need to run the
          platform, and we do not sell your personal information.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">
            Information we collect
          </h2>
          <p>We collect the following to operate SummerStay:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <span className="font-medium text-ink">Account details.</span>{" "}
              When you sign up, our authentication provider, Clerk, handles your
              login and stores credentials such as your email address and name.
              We receive a user identifier and basic profile details from Clerk
              so we can associate listings and messages with your account.
            </li>
            <li>
              <span className="font-medium text-ink">Listing content.</span>{" "}
              When you post a sublet, we store the details you enter, such as the
              title, description, location, dates, price, and amenities.
            </li>
            <li>
              <span className="font-medium text-ink">Photos.</span> Images you
              upload for a listing are stored through our file-hosting provider,
              UploadThing.
            </li>
            <li>
              <span className="font-medium text-ink">Inquiries.</span> When you
              contact a host about a listing, we store the name, email, and
              message you submit so the host can respond.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">
            How we use your information
          </h2>
          <p>We use the information above to:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Create and manage your account and listings.</li>
            <li>Display listings and connect interested renters with hosts.</li>
            <li>Keep the platform secure and prevent abuse.</li>
            <li>Respond to questions you send us.</li>
          </ul>
          <p>
            We do not use your information for advertising, and we do not build
            profiles to sell to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">
            How your information is shared
          </h2>
          <p>
            We share information only where it is necessary to run SummerStay:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <span className="font-medium text-ink">With other users.</span>{" "}
              Details you add to a public listing are visible to anyone browsing
              the site. When you send an inquiry, the contact details you
              provide are shared with that host.
            </li>
            <li>
              <span className="font-medium text-ink">
                With service providers.
              </span>{" "}
              We rely on Clerk for authentication, UploadThing for image
              hosting, and Neon for our database. These providers process data
              on our behalf so the platform can function.
            </li>
            <li>
              <span className="font-medium text-ink">When required by law.</span>{" "}
              We may disclose information if we are legally compelled to do so.
            </li>
          </ul>
          <p className="font-medium text-ink">We do not sell your personal data.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">Data storage</h2>
          <p>
            Listing and inquiry data is stored in a Neon Postgres database, and
            uploaded images are stored with UploadThing. We keep your
            information for as long as your account is active or as needed to
            operate the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">Your choices</h2>
          <p>You stay in control of the content you add:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              You can edit or delete any listing you create at any time from
              your account.
            </li>
            <li>
              You can manage your login details through Clerk, and you can ask
              us to delete your account and its associated listings.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">Changes to this policy</h2>
          <p>
            We may update this policy as SummerStay evolves. When we do, we will
            revise the &ldquo;last updated&rdquo; date above.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">Contact us</h2>
          <p>
            Questions about this policy? Reach us through our{" "}
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
