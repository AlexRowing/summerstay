"use client";

import { useActionState } from "react";
import { startConversation, type MessageState } from "@/app/messages/actions";
import { button, field, fieldError, label, size } from "@/app/_components/ui";

// The contact form for logged-in students: the first message opens an
// in-app conversation with the host.
export default function StartConversation({
  listingId,
  listingTitle,
  hostFirstName,
}: {
  listingId: string;
  listingTitle: string;
  hostFirstName: string;
}) {
  const [state, formAction, pending] = useActionState<MessageState, FormData>(
    startConversation,
    {},
  );

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <input type="hidden" name="listingId" value={listingId} />
      <div>
        <label htmlFor="body" className={label}>
          Message {hostFirstName}
        </label>
        <textarea
          id="body"
          name="body"
          rows={5}
          required
          maxLength={2000}
          defaultValue={`Hi! Is "${listingTitle}" still available? I'm looking for a place for `}
          className={`${field} resize-y`}
        />
      </div>
      {state.error && (
        <p role="alert" className={fieldError}>
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={`${button.primary} ${size.lg} w-full`}
      >
        {pending ? "Sending…" : "Send message"}
      </button>
      <p className="text-center text-[13px] text-ink-soft">
        You&apos;ll chat in your SummerStay messages. We email you when they
        reply.
      </p>
    </form>
  );
}
