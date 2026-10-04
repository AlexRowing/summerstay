import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { confirmVtVerification } from "@/app/account/actions";
import { button, size } from "@/app/_components/ui";
import { peekEmailToken } from "@/app/_lib/tokens";

export const metadata: Metadata = {
  title: "Confirm your VT email",
  robots: { index: false },
};

// The page a verification email links to. Confirming takes a button press
// rather than happening on page load, so email scanners that pre-open links
// can't use up the token.
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const row = token ? await peekEmailToken(token, "verify_vt") : null;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center sm:py-28">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
        <BadgeCheck className="size-7" aria-hidden="true" />
      </span>
      {row ? (
        <>
          <h1 className="mt-5 text-[1.75rem] font-bold tracking-[-0.025em]">
            Confirm your VT email
          </h1>
          <p className="mt-2 text-ink-soft">
            Confirm <span className="font-semibold text-ink">{row.email}</span>{" "}
            to get the Verified Hokie badge on your listings.
          </p>
          <form action={confirmVtVerification} className="mt-8">
            <input type="hidden" name="token" value={token} />
            <button type="submit" className={`${button.primary} ${size.lg}`}>
              Confirm and verify
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="mt-5 text-[1.75rem] font-bold tracking-[-0.025em]">
            This link has expired
          </h1>
          <p className="mt-2 text-ink-soft">
            Verification links work once, for 24 hours. Send yourself a new one
            from your profile.
          </p>
          <Link href="/account" className={`${button.primary} ${size.md} mt-8`}>
            Go to my profile
          </Link>
        </>
      )}
    </div>
  );
}
