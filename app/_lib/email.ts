import "server-only";
import { Resend } from "resend";

// Transactional email through Resend. Needs two env vars:
//   RESEND_API_KEY  from resend.com → API Keys
//   EMAIL_FROM      a sender on a domain verified in Resend,
//                   e.g. "SummerStay <hello@yourdomain.com>"
// Without them, emails are skipped (and logged) so local dev and previews
// still work; messages always land in the host's inbox regardless.

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://summerstay.vercel.app";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type InquiryEmail = {
  to: string;
  hostName: string | null;
  listing: { id: string; title: string };
  from: { name: string; email: string; message: string };
};

// Tell a host that a student messaged them about a listing. Reply-To is the
// student, so the host can answer straight from their mail app.
export async function sendInquiryEmail(email: InquiryEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.EMAIL_FROM;
  if (!apiKey || !sender) {
    console.warn("Email skipped: RESEND_API_KEY or EMAIL_FROM is not set.");
    return;
  }

  const greeting = email.hostName
    ? `Hi ${email.hostName.split(" ")[0]},`
    : "Hi,";
  const inboxUrl = `${SITE_URL}/account/inbox`;
  const listingUrl = `${SITE_URL}/listings/${email.listing.id}`;

  const text = [
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
  ].join("\n");

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#2a1a1f;line-height:1.55">
  <p style="font-size:15px">${escapeHtml(greeting)}</p>
  <p style="font-size:15px"><strong>${escapeHtml(email.from.name)}</strong> (${escapeHtml(email.from.email)}) is interested in
    <a href="${listingUrl}" style="color:#82203f;font-weight:600">${escapeHtml(email.listing.title)}</a>:</p>
  <div style="background:#f6f2f3;border-radius:12px;padding:16px 18px;font-size:15px;white-space:pre-line">${escapeHtml(email.from.message)}</div>
  <p style="font-size:15px">Hit reply to answer them directly.</p>
  <p style="margin-top:24px"><a href="${inboxUrl}" style="display:inline-block;background:#82203f;color:#fff;text-decoration:none;font-weight:600;padding:10px 18px;border-radius:10px">Open your inbox</a></p>
  <p style="font-size:13px;color:#6b5a5f;margin-top:32px">You're getting this because you posted a listing on SummerStay. Once the place is taken, mark it as taken on the listing page and the messages stop.</p>
</div>`;

  const { error } = await new Resend(apiKey).emails.send({
    from: sender,
    to: email.to,
    replyTo: email.from.email,
    subject: `${email.from.name} is interested in ${email.listing.title}`,
    text,
    html,
  });
  if (error) console.error("Inquiry email failed:", error.message);
}
