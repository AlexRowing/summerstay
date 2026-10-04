"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/app/_lib/db";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { emailConfigured, sendPasswordResetEmail } from "@/app/_lib/email";
import { linkOrigin } from "@/app/_lib/origin";
import {
  consumeEmailToken,
  createEmailToken,
  sentRecently,
} from "@/app/_lib/tokens";

// What the login/signup forms render back: an error message, or nothing on
// success (a successful auth redirects instead of returning).
export type AuthState = { error?: string };

// Where to land after logging in. Only same-site paths are allowed, so a
// crafted ?next= link can't bounce someone to another website.
function safeNext(formData: FormData): string {
  const next = String(formData.get("next") ?? "");
  return next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\")
    ? next
    : "/";
}

// Sign the current user out and return home. Used by the navbar user menu.
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

// Log an existing user in. signIn throws a redirect on success (which must
// propagate) and an AuthError on bad credentials (which we turn into a
// deliberately generic message so we never reveal which field was wrong).
export async function authenticate(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  // Slow down password guessing: 8 failed tries per email per 15 minutes.
  const windowStart = new Date(Date.now() - 15 * 60 * 1000);
  const failures = await prisma.loginAttempt.count({
    where: { email, createdAt: { gte: windowStart } },
  });
  if (failures >= 8) {
    return {
      error:
        "Too many attempts. Wait 15 minutes, or reset your password if you've forgotten it.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password: String(formData.get("password") ?? ""),
      redirectTo: safeNext(formData),
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      await prisma.$transaction([
        prisma.loginAttempt.create({ data: { email } }),
        // Keep the table small: drop anything older than a day.
        prisma.loginAttempt.deleteMany({
          where: {
            createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
        }),
      ]);
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

// Create a new account, then sign the user in.
export async function register(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  // Honeypot field real people never see; bots that fill it get nowhere.
  if (String(formData.get("website") ?? "") !== "") {
    return { error: "Something went wrong. Please try again." };
  }

  const name = String(formData.get("name") ?? "")
    .trim()
    .slice(0, 80);
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, passwordHash, name: name || null },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: safeNext(formData),
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      // Account was created but auto-login failed; send them to log in.
      return { error: "Account created. Please log in." };
    }
    throw error;
  }
}

export type ResetRequestState = { status: "idle" | "sent"; devNote?: boolean };

// Email a password reset link. Always reports success, so the form can't be
// used to find out which emails have accounts.
export async function requestPasswordReset(
  _prev: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const user = email
    ? await prisma.user.findUnique({ where: { email } })
    : null;

  if (user && !(await sentRecently(user.id, "reset_password"))) {
    const token = await createEmailToken(user.id, "reset_password", email, 60);
    const url = `${await linkOrigin()}/reset-password?token=${token}`;
    const sent = await sendPasswordResetEmail(user.email, url);
    if (!sent && !emailConfigured() && process.env.NODE_ENV !== "production") {
      return { status: "sent", devNote: true };
    }
  }
  return { status: "sent" };
}

// Set a new password from a reset link.
export async function resetPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const row = await consumeEmailToken(token, "reset_password");
  if (!row) {
    return {
      error:
        "This reset link has expired or was already used. Request a new one.",
    };
  }

  // New password, and every existing session (other devices, or whoever
  // knew the old password) gets signed out.
  await prisma.user.update({
    where: { id: row.userId },
    data: {
      passwordHash: await bcrypt.hash(password, 10),
      sessionVersion: { increment: 1 },
    },
  });
  await prisma.loginAttempt.deleteMany({ where: { email: row.email } });
  redirect("/login?reset=1");
}
