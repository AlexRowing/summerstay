"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import { sendMessage, type MessageState } from "@/app/messages/actions";

type Message = { id: string; body: string; createdAt: string; fromMe: boolean };

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

// The message list and composer. New messages from the other person show up
// by re-fetching the page every few seconds while the tab is visible; that's
// plenty for a sublease chat and needs no socket server.
export default function Thread({
  conversationId,
  messages,
  otherName,
  closed,
}: {
  conversationId: string;
  messages: Message[];
  otherName: string;
  closed: boolean;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<MessageState, FormData>(
    sendMessage,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Clear the box once a message goes through.
  useEffect(() => {
    if (state.sentAt) formRef.current?.reset();
  }, [state.sentAt]);

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  // Poll for replies while the page is visible.
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const timer = setInterval(tick, 8000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [router]);

  return (
    <div className="flex flex-1 flex-col">
      <ol
        aria-label={`Messages with ${otherName}`}
        className="flex-1 space-y-1.5 py-6"
      >
        {messages.map((m, i) => {
          const day = dayLabel(m.createdAt);
          const prev = messages[i - 1];
          const showDay = !prev || dayLabel(prev.createdAt) !== day;
          const next = messages[i + 1];
          const endOfRun = !next || next.fromMe !== m.fromMe;
          return (
            <li key={m.id}>
              {showDay && (
                <p className="py-3 text-center text-xs font-semibold text-ink-faint">
                  {day}
                </p>
              )}
              <div
                className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-line break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                    m.fromMe
                      ? "rounded-br-md bg-brand text-on-brand"
                      : "rounded-bl-md bg-sunken text-ink"
                  }`}
                >
                  <span className="sr-only">
                    {m.fromMe ? "You: " : `${otherName}: `}
                  </span>
                  {m.body}
                </div>
              </div>
              {endOfRun && (
                <p
                  className={`mt-1 px-1 text-xs text-ink-faint ${m.fromMe ? "text-right" : ""}`}
                >
                  {timeLabel(m.createdAt)}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <div ref={endRef} />

      {closed ? (
        <p className="sticky bottom-0 border-t border-line bg-surface py-4 text-center text-[15px] text-ink-soft">
          This listing is no longer available, so the conversation is closed.
        </p>
      ) : (
        <form
          ref={formRef}
          action={formAction}
          className="sticky bottom-0 border-t border-line bg-surface pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
        >
          <input type="hidden" name="conversationId" value={conversationId} />
          <div className="flex items-end gap-2">
            <label htmlFor="body" className="sr-only">
              Message {otherName}
            </label>
            <textarea
              id="body"
              name="body"
              rows={1}
              required
              maxLength={2000}
              placeholder={`Message ${otherName}`}
              onKeyDown={(e) => {
                // Enter sends; Shift+Enter makes a new line.
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              className="field-sizing-content max-h-40 min-h-11 flex-1 resize-none rounded-[22px] border border-line-strong bg-card px-4 py-2.5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-faint focus:border-brand-ink focus:shadow-[0_0_0_3px_var(--brand-soft)]"
            />
            <button
              type="submit"
              disabled={pending}
              aria-label="Send message"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand transition-colors hover:bg-brand-hover disabled:opacity-55"
            >
              <SendHorizontal className="size-5" aria-hidden="true" />
            </button>
          </div>
          {state.error && (
            <p
              role="alert"
              className="mt-2 text-[13px] font-medium text-danger"
            >
              {state.error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
