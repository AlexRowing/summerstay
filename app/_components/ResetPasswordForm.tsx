"use client";

import { useActionState, useState } from "react";
import { resetPassword, type AuthState } from "@/app/_lib/auth-actions";
import PasswordInput from "@/app/_components/PasswordInput";
import { button, fieldError, hint, label, size } from "@/app/_components/ui";

const initialState: AuthState = {};

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState,
  );
  const [tooShort, setTooShort] = useState(false);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        const value = new FormData(e.currentTarget).get("password");
        if (String(value ?? "").length < 8) {
          e.preventDefault();
          setTooShort(true);
        }
      }}
      noValidate
      className="mt-8 space-y-5"
    >
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="password" className={label}>
          New password
        </label>
        <PasswordInput
          id="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          aria-invalid={tooShort ? true : undefined}
          onInput={() => setTooShort(false)}
        />
        {tooShort ? (
          <p className={fieldError}>Use at least 8 characters.</p>
        ) : (
          <p className={hint}>At least 8 characters.</p>
        )}
      </div>
      {state.error && (
        <p
          role="alert"
          className="rounded-lg bg-danger-soft px-3.5 py-2.5 text-[15px] font-medium text-danger"
        >
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={`${button.primary} ${size.lg} w-full`}
      >
        {pending ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
