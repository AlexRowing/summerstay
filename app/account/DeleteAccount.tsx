"use client";

import { useActionState, useState } from "react";
import { deleteAccount, type DeleteAccountState } from "@/app/account/actions";
import PasswordInput from "@/app/_components/PasswordInput";
import { button, fieldError, label, size } from "@/app/_components/ui";

// Danger zone on the profile page: a button that expands into a password
// confirmation before anything is deleted.
export default function DeleteAccount({
  listingCount,
}: {
  listingCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<
    DeleteAccountState,
    FormData
  >(deleteAccount, {});

  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2 className="font-bold">Delete account</h2>
      <p className="mt-1 text-[15px] text-ink-soft">
        Permanently removes your account
        {listingCount > 0 &&
          `, your ${listingCount} ${listingCount === 1 ? "listing" : "listings"}`}
        , your messages, saved places, and alerts. This can&apos;t be undone.
      </p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`${button.dangerOutline} ${size.md} mt-4`}
        >
          Delete my account
        </button>
      ) : (
        <form
          action={formAction}
          className="mt-4 max-w-sm rounded-xl border border-danger/30 bg-danger-soft p-4 motion-safe:animate-[rise-in_180ms_var(--ease-out-quart)]"
        >
          <label htmlFor="delete-password" className={label}>
            Enter your password to confirm
          </label>
          <PasswordInput
            id="delete-password"
            name="password"
            required
            autoComplete="current-password"
          />
          {state.error && (
            <p role="alert" className={fieldError}>
              {state.error}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`${button.secondary} ${size.sm} flex-1`}
            >
              Keep my account
            </button>
            <button
              type="submit"
              disabled={pending}
              className={`${button.danger} ${size.sm} flex-1`}
            >
              {pending ? "Deleting…" : "Delete forever"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
