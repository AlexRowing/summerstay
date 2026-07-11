"use client";

import { useActionState } from "react";
import { createInquiry, type InquiryState } from "@/app/listings/actions";

const initialState: InquiryState = { status: "idle" };

const fieldClass =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-ink-soft";

export default function ContactForm({ listingId }: { listingId: string }) {
  // useActionState wires the form to the Server Action and hands back the
  // returned state plus a `pending` flag while the request is in flight.
  const [state, formAction, pending] = useActionState(
    createInquiry,
    initialState,
  );

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
    <form action={formAction} className="mt-5 space-y-3">
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
          placeholder="Your name"
          className={fieldClass}
        />
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
          placeholder="you@school.edu"
          className={fieldClass}
        />
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
          placeholder="Hi! I'm interested in subletting your place..."
          className={fieldClass}
        />
      </div>
      {state.status === "error" && (
        <p className="text-sm text-red-600">{state.error}</p>
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
