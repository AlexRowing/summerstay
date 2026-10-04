import "server-only";
import { Resend } from "resend";

// Transactional email through Resend. Needs two env vars:
//   RESEND_API_KEY  from resend.com → API Keys
//   EMAIL_FROM      a sender on a domain verified in Resend,
//                   e.g. "SummerStay <hello@yourdomain.com>"
// Without them, emails aren't sent. In local development the email is
// printed to the server console instead, so links can still be clicked.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://summerstay.vercel.app";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// A paragraph of (already escaped) email HTML.
const para = (html: string) => `<p style="font-size:15px">${html}</p>`;

// The shared frame every email uses: a few blocks of HTML and one button.
function layout(
  blocks: string[],
  button?: { label: string; url: string },
  footer?: string,
) {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#2a1a1f;line-height:1.55">
  ${blocks.join("\n  ")}
  ${
    button
      ? `<p style="margin-top:24px"><a href="${button.url}" style="display:inline-block;background:#82203f;color:#fff;text-decoration:none;font-weight:600;padding:10px 18px;border-radius:10px">${escapeHtml(button.label)}</a></p>`
      : ""
  }
  ${footer ? `<p style="font-size:13px;color:#6b5a5f;margin-top:32px">${footer}</p>` : ""}
</div>`;
}

type Email = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

// Send one email. Returns false when it wasn't sent (not configured, or the
// provider refused), so callers can tell the user.
async function send(email: Email): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.EMAIL_FROM;
  if (!apiKey || !sender) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `\n[email not configured: printing instead]\nTo: ${email.to}\nSubject: ${email.subject}\n\n${email.text}\n`,
      );
    } else {
      console.warn("Email skipped: RESEND_API_KEY or EMAIL_FROM is not set.");
    }
    return false;
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: sender,
    to: email.to,
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
  if (error) {
    console.error(`Email "${email.subject}" failed:`, error.message);
    return false;
  }
  return true;
}

// Tell a host that a student messaged them about a listing. Reply-To is the
// student, so the host can answer straight from their mail app.
export async function sendInquiryEmail(email: {
  to: string;
  hostName: string | null;
  listing: { id: string; title: string };
  from: { name: string; email: string; message: string };
}): Promise<void> {
  const greeting = email.hostName
    ? `Hi ${email.hostName.split(" ")[0]},`
    : "Hi,";
  const inboxUrl = `${SITE_URL}/account/inbox`;
  const listingUrl = `${SITE_URL}/listings/${email.listing.id}`;

  await send({
    to: email.to,
    replyTo: email.from.email,
    subject: `${email.from.name} is interested in ${email.listing.title}`,
    text: [
      greeting,
      "",
      `${email.from.name} (${email.from.email}) is interested in "${email.listing.title}":`,
      "",
      email.from.message,
      "",
      "Reply to this email to answer them directly.",
      "",
      `Your inbox: ${inboxUrl}`,
      `Your listing: ${listingUrl}`,
    ].join("\n"),
    html: layout(
      [
        para(escapeHtml(greeting)),
        para(
          `<strong>${escapeHtml(email.from.name)}</strong> (${escapeHtml(email.from.email)}) is interested in <a href="${listingUrl}" style="color:#82203f;font-weight:600">${escapeHtml(email.listing.title)}</a>:`,
        ),
        `<div style="background:#f6f2f3;border-radius:12px;padding:16px 18px;font-size:15px;white-space:pre-line">${escapeHtml(email.from.message)}</div>`,
        para("Hit reply to answer them directly."),
      ],
      { label: "Open your inbox", url: inboxUrl },
      "You're getting this because you posted a listing on SummerStay. Once the place is taken, mark it as taken on the listing page and the messages stop.",
    ),
  });
}

// The link that proves someone owns a @vt.edu address.
export async function sendVerifyEmail(
  to: string,
  url: string,
): Promise<boolean> {
  return send({
    to,
    subject: "Confirm your Virginia Tech email for SummerStay",
    text: [
      "Confirm this is your Virginia Tech email to get the Verified Hokie badge on your SummerStay listings:",
      "",
      url,
      "",
      "The link works for 24 hours. If you didn't ask for this, ignore this email.",
    ].join("\n"),
    html: layout(
      [
        para(
          "Confirm this is your Virginia Tech email to get the <strong>Verified Hokie</strong> badge on your SummerStay listings.",
        ),
      ],
      { label: "Confirm my VT email", url },
      "The link works for 24 hours. If you didn't ask for this, you can ignore this email.",
    ),
  });
}

// A password reset link. Sent only to the account's own email.
export async function sendPasswordResetEmail(
  to: string,
  url: string,
): Promise<boolean> {
  return send({
    to,
    subject: "Reset your SummerStay password",
    text: [
      "Someone (hopefully you) asked to reset your SummerStay password. Choose a new one here:",
      "",
      url,
      "",
      "The link works for 1 hour. If you didn't ask for this, ignore this email; your password won't change.",
    ].join("\n"),
    html: layout(
      [
        para(
          "Someone (hopefully you) asked to reset your SummerStay password.",
        ),
      ],
      { label: "Choose a new password", url },
      "The link works for 1 hour. If you didn't ask for this, ignore this email; your password won't change.",
    ),
  });
}
