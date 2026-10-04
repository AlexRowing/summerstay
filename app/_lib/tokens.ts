import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/app/_lib/db";

export type TokenPurpose = "verify_vt" | "reset_password";

const hash = (token: string) =>
  createHash("sha256").update(token).digest("hex");

// Create a one-time link token. Any older unused tokens for the same purpose
// are dropped, so only the newest email's link works. Returns the raw token
// (goes in the link); only its hash is stored.
export async function createEmailToken(
  userId: string,
  purpose: TokenPurpose,
  email: string,
  ttlMinutes: number,
): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await prisma.$transaction([
    prisma.emailToken.deleteMany({ where: { userId, purpose } }),
    prisma.emailToken.create({
      data: {
        tokenHash: hash(token),
        purpose,
        email,
        userId,
        expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000),
      },
    }),
  ]);
  return token;
}

// Whether a link for this user and purpose was sent in the last `minutes`.
// Stops someone from using the forms to spam an inbox.
export async function sentRecently(
  userId: string,
  purpose: TokenPurpose,
  minutes = 2,
): Promise<boolean> {
  const recent = await prisma.emailToken.findFirst({
    where: {
      userId,
      purpose,
      createdAt: { gte: new Date(Date.now() - minutes * 60 * 1000) },
    },
  });
  return recent !== null;
}

// Look up a token without using it (to show the right page).
export async function peekEmailToken(token: string, purpose: TokenPurpose) {
  const row = await prisma.emailToken.findUnique({
    where: { tokenHash: hash(token) },
  });
  if (!row || row.purpose !== purpose || row.expiresAt < new Date()) {
    return null;
  }
  return row;
}

// Use a token: returns its row and deletes it, or null if it's unknown,
// expired, or for a different purpose.
export async function consumeEmailToken(token: string, purpose: TokenPurpose) {
  const row = await peekEmailToken(token, purpose);
  if (!row) return null;
  // deleteMany so two simultaneous clicks can't both succeed.
  const { count } = await prisma.emailToken.deleteMany({
    where: { id: row.id },
  });
  return count === 1 ? row : null;
}
