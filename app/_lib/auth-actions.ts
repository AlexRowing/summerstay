"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/app/_lib/db";
import { signIn, signOut } from "@/auth";

// What the login/signup forms render back: an error message, or nothing on
// success (a successful auth redirects instead of returning).
export type AuthState = { error?: string };

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
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
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
  const name = String(formData.get("name") ?? "").trim();
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
    await signIn("credentials", { email, password, redirectTo: "/" });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      // Account was created but auto-login failed; send them to log in.
      return { error: "Account created. Please log in." };
    }
    throw error;
  }
}
