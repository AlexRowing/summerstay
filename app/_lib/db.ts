import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";

/*
  A single shared Prisma client for the whole app.

  In development, Next.js hot-reloads your code on every save. Without this
  guard, each reload would create a brand-new PrismaClient and open another
  batch of database connections until the database refuses more. Stashing the
  client on `globalThis` reuses the same one across reloads. In production the
  module only loads once, so the guard isn't needed there.
*/
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 connects through a driver adapter; better-sqlite3 reads the
// local SQLite file named in DATABASE_URL (.env, auto-loaded by Next.js).
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
