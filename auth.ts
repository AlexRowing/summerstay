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

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    // Carry the user id from the sign-in through the JWT into the session, so
    // server code can read session.user.id (used for listing ownership).
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
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
