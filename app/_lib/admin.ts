import "server-only";
import { auth } from "@/auth";

// Moderators are whoever's email is in ADMIN_EMAILS (comma-separated), so
// there's no admin flag in the database to manage or leak.
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && adminEmails().includes(email.toLowerCase());
}

// The current session if it belongs to a moderator, otherwise null.
export async function getAdminSession() {
  const session = await auth();
  return isAdminEmail(session?.user?.email) ? session : null;
}
