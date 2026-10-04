"use client";

import { useActionState } from "react";
import { BadgeCheck, MailCheck } from "lucide-react";
import { requestVtVerification, type VerifyState } from "@/app/account/actions";
import { button, field, fieldError, label, size } from "@/app/_components/ui";

const initialState: VerifyState = { status: "idle" };

// Profile section for the Verified Hokie badge: shows the verified address,
// or a form that emails a confirmation link to a @vt.edu address.
export default function VtVerifyCard({
  verifiedEmail,
  loginEmail,
}: {
  verifiedEmail: string | null;
  loginEmail: string;
}) {
  const [state, formAction, pending] = useActionState(
    requestVtVerification,
    initialState,
  );

  if (verifiedEmail) {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-brand-soft p-5">
        <BadgeCheck
          className="mt-0.5 size-6 shrink-0 text-brand-ink"
          aria-hidden="true"
        />
        <div>
          <p className="font-bold">You&apos;re a Verified Hokie</p>
          <p className="mt-0.5 text-[15px] text-ink-soft">
            Confirmed as {verifiedEmail}. Your listings show the badge, so
            students know you&apos;re one of them.
          </p>
        </div>
      </div>
    );
  }

  if (state.status === "sent") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-2xl bg-success-soft p-5"
      >
        <MailCheck
          className="mt-0.5 size-6 shrink-0 text-success"
          aria-hidden="true"
        />
        <div>
          <p className="font-bold">Check {state.email}</p>
          <p className="mt-0.5 text-[15px] text-ink-soft">
            We sent a confirmation link. It works for 24 hours.
            {state.devNote &&
              " (Email isn't set up on this machine, so the link was printed in the server console.)"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line p-5 sm:p-6">
      <p className="flex items-center gap-2 font-bold">
        <BadgeCheck className="size-5 text-brand-ink" aria-hidden="true" />
        Get the Verified Hokie badge
      </p>
      <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
        Confirm a @vt.edu email and your listings get a badge. Students trust
        verified hosts more, and it keeps scammers out.
      </p>
      <form
        action={formAction}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="vtEmail" className={label}>
            Virginia Tech email
          </label>
          <input
            id="vtEmail"
            name="vtEmail"
            type="email"
            required
            autoComplete="email"
            defaultValue={loginEmail.endsWith("@vt.edu") ? loginEmail : ""}
            placeholder="pid@vt.edu"
            aria-invalid={state.status === "error" ? true : undefined}
            className={field}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className={`${button.primary} ${size.md}`}
        >
          {pending ? "Sending…" : "Send link"}
        </button>
      </form>
      {state.status === "error" && (
        <p role="alert" className={fieldError}>
          {state.error}
        </p>
      )}
    </div>
  );
}
