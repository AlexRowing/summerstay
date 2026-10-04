// Shared class strings for the small, repeated component vocabulary (buttons,
// fields, labels). Every screen pulls from here so a primary button or an
// input looks identical everywhere.

const buttonBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-[var(--ease-out-quart)] active:translate-y-px disabled:pointer-events-none disabled:opacity-55";

export const button = {
  primary: `${buttonBase} bg-brand text-on-brand hover:bg-brand-hover`,
  secondary: `${buttonBase} border border-line-strong bg-card text-ink hover:border-ink-soft hover:bg-sunken`,
  ghost: `${buttonBase} text-ink-soft hover:bg-sunken hover:text-ink`,
  danger: `${buttonBase} bg-danger text-white hover:opacity-90`,
  dangerOutline: `${buttonBase} border border-danger/40 text-danger hover:bg-danger-soft`,
};

export const size = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base",
};

export const field =
  "block w-full rounded-[10px] border border-line-strong bg-card px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-faint outline-none transition-[border-color,box-shadow] duration-150 hover:border-ink-faint focus:border-brand-ink focus:shadow-[0_0_0_3px_var(--brand-soft)] aria-[invalid=true]:border-danger";

export const label = "mb-1.5 block text-sm font-semibold text-ink";

export const hint = "mt-1.5 text-[13px] text-ink-soft";

export const fieldError = "mt-1.5 text-[13px] font-medium text-danger";

export const textLink =
  "font-semibold text-brand-ink underline-offset-4 hover:underline";
