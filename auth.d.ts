import type { DefaultSession } from "next-auth";

// Add `id` to the session user so server code can read session.user.id.
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & { id: string };
  }
}
