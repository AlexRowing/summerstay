"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { field } from "@/app/_components/ui";

// A password field with a show/hide toggle, so people can check what they
// typed on a phone keyboard.
export default function PasswordInput(
  props: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "className"
  >,
) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${field} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-sunken hover:text-ink"
      >
        <Icon className="size-[18px]" aria-hidden="true" />
      </button>
    </div>
  );
}
