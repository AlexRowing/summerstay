"use client";

import Link from "next/link";
import { useActionState } from "react";
import { MailCheck } from "lucide-react";
import {
  requestPasswordReset,
  type ResetRequestState,
} from "@/app/_lib/auth-actions";
import { button, field, label, size, textLink } from "@/app/_components/ui";

const initialState: ResetRequestState = { status: "idle" };

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  if (state.status === "sent") {
    return (
      <div role="status" className="mt-8 rounded-xl bg-success-soft p-5">
        <p className="flex items-center gap-2 font-semibold">
          <MailCheck className="size-5 text-success" aria-hidden="true" />
          Check your email
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
          If there&apos;s an account with that email, we sent a link to reset
          the password. It works for 1 hour.
          {state.devNote &&
            " (Email isn't set up on this machine, so the link was printed in the server console.)"}
        </p>
        <Link href="/login" className={`${textLink} mt-4 inline-block`}>
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@vt.edu"
          className={field}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className={`${button.primary} ${size.lg} w-full`}
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
      <p className="text-center text-[15px] text-ink-soft">
        Remembered it?{" "}
        <Link href="/login" className={textLink}>
          Log in
        </Link>
      </p>
    </form>
  );
}
