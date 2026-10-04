import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/_lib/db";

/*
  Auth.js (NextAuth v5) configured for email/password login.

  - Sessions are JWTs (the credentials provider can't use database sessions).
  - authorize() is the security core: look up the user, compare the submitted
    password against the stored bcrypt hash, and return the user only on a
    match. Returning null makes the sign-in fail with a generic error, so we
    never reveal whether the email or the password was the wrong one.
*/
// How often a session is re-validated against the database. Tokens can't be
// rewritten from Server Components, so in practice most requests after this
// window do one quick lookup by primary key.
const RECHECK_MS = 5 * 60 * 1000;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    // Carry the user id from the sign-in through the JWT into the session, so
    // server code can read session.user.id (used for listing ownership).
    //
    // Every few minutes the token is re-checked against the database: if the
    // account was deleted, or its password was reset since this session
    // started (sessionVersion bumped), the session ends.
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.sv = (user as { sessionVersion?: number }).sessionVersion ?? 0;
        token.checkedAt = Date.now();
        return token;
      }
      if (typeof token.id !== "string") return token;
      const checkedAt =
        typeof token.checkedAt === "number" ? token.checkedAt : 0;
      if (Date.now() - checkedAt < RECHECK_MS) return token;

      const current = await prisma.user.findUnique({
        where: { id: token.id },
        select: { sessionVersion: true },
      });
      if (!current || current.sessionVersion !== (token.sv ?? 0)) return null;
      token.checkedAt = Date.now();
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
