// Turns the browser's native constraint-validation state into friendly,
// in-app messages so we can show inline errors instead of the default browser
// popups. Used by the client forms (they set `noValidate` and call this on
// submit). Server-side validation in the actions is unchanged and remains the
// real gate.

type FormField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function messageFor(el: FormField): string | null {
  const v = el.validity;
  if (v.valid) return null;

  const label = el.getAttribute("data-label") || "This field";
  if (v.valueMissing) return `${label} is required.`;
  if (v.typeMismatch) {
    if (el instanceof HTMLInputElement && el.type === "email") {
      return "Enter a valid email address.";
    }
    if (el instanceof HTMLInputElement && el.type === "url") {
      return "Enter a valid URL (or leave it blank).";
    }
    return "That value doesn't look right.";
  }
  if (v.rangeUnderflow) return `${label} can't be negative.`;
  if (v.tooShort) return `${label} is too short.`;
  return "Please check this field.";
}

// Collect a { fieldName: message } map for every invalid field in the form.
// Skips Next.js's server-action hidden fields (their names start with "$").
export function collectFieldErrors(
  form: HTMLFormElement,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const el of Array.from(form.elements)) {
    const field = el as FormField;
    if (!field.name || field.name.startsWith("$")) continue;
    const message = messageFor(field);
    if (message) errors[field.name] = message;
  }
  return errors;
}
