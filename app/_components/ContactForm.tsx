"use client";

import { useActionState, useState } from "react";
import { createInquiry, type InquiryState } from "@/app/listings/actions";
import { collectFieldErrors } from "@/app/_lib/form-validation";

const initialState: InquiryState = { status: "idle" };
const fieldClass =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-ink-soft";
const errorClass = "mt-1 text-sm text-red-600 dark:text-red-400";

export default function ContactForm({ listingId }: { listingId: string }) {
  const [state, formAction, pending] = useActionState(
    createInquiry,
    initialState,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const found = collectFieldErrors(e.currentTarget);
    if (Object.keys(found).length > 0) {
      e.preventDefault();
      setErrors(found);
    }
  }

  function clearError(name: string) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  if (state.status === "sent") {
    return (
      <div className="mt-5 rounded-xl border border-line bg-brand-soft p-4 text-center text-sm">
        <p className="font-medium text-ink">Message sent</p>
        <p className="mt-1 text-ink-soft">
          The host will reach out with your details.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="mt-5 space-y-3">
      <input type="hidden" name="listingId" value={listingId} />
      <div>
        <label htmlFor="name" className="sr-only">
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          data-label="Name"
          placeholder="Your name"
          className={fieldClass}
          onInput={() => clearError("name")}
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email" className="sr-only">
          Your email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          data-label="Email"
          placeholder="you@school.edu"
          className={fieldClass}
          onInput={() => clearError("email")}
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={3}
          data-label="Message"
          placeholder="Hi! I'm interested in subletting your place..."
          className={fieldClass}
          onInput={() => clearError("message")}
        />
        {errors.message && <p className={errorClass}>{errors.message}</p>}
      </div>
      {state.status === "error" && (
        <p className={errorClass}>{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Sending..." : "Contact host"}
      </button>
    </form>
  );
}
