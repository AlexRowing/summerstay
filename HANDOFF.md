# SummerStay: Project Handoff

> Last updated: 2026-10-04. Written so another developer or AI can pick this up with no prior context.
> Live: https://summerstay.vercel.app · Repo: https://github.com/AlexRowing/summerstay · Branch: `master` (auto-deploys to Vercel on push)

## 1. What it is

A student-to-student **sublease marketplace for Blacksburg / Virginia Tech**, covering any term (summer, fall, spring, winter break). The name is a legacy of the original summer-only scope; the owner decided to keep it. The goal is a real product the owner can advertise on campus. It is not affiliated with Virginia Tech and must never look official (no VT logos or marks).

Design direction and rules live in `PRODUCT.md` (strategy) and `DESIGN.md` (visual system: maroon + burnt orange, Schibsted Grotesk, doorway logo).

## 2. Stack

- Next.js 16 (App Router) + React 19 + TypeScript. **Read `node_modules/next/dist/docs/` before using Next APIs** (see `AGENTS.md`).
- Tailwind v4, with tokens in `app/globals.css` (OKLCH, light + `.dark`). Shared class strings are in `app/_components/ui.ts`.
- Prisma 7 + Postgres on Neon via `@prisma/adapter-pg`. The client is generated to `app/generated/prisma/` (gitignored).
- Auth.js v5: credentials provider, JWT sessions, bcryptjs.
- Resend for email, Vercel Blob for photo uploads, lucide-react for icons, next-themes for dark mode.

## 3. Features

- **Browse** (`/listings`): free-text search (city, neighborhood, title), max rent, bedrooms, term tabs, a "Verified hosts" filter, and sorting. Everything lives in URL params. Only *live* listings appear: not taken, and end date not passed.
- **Listing page** (`/listings/[id]`): photo gallery (grid, swipe strip on phones, full-screen `<dialog>` viewer), facts, amenities, "Posted by" with the Verified Hokie badge, a safety-tips box, and a sticky contact panel with a phone action bar. Ownerless listings show "Sample listing" and don't take messages. Taken or expired listings show a banner and no contact form.
- **Contact a host**: saves an `Inquiry`, then emails the host via `after()` (Reply-To is the student). Has a honeypot field and a limit of one message per sender per listing every 10 minutes.
- **Host flow** (`/host`, `/listings/[id]/edit`): sectioned form with a live card preview, move-in/move-out date pickers with term presets, amenity chips, and photo uploads (up to 8, shrunk in the browser, first photo is the cover). Owners can mark a listing taken or available, or delete it (two-step confirm). Removed photos are deleted from Blob after the response.
- **Account**: `/account/inbox` (messages, marked read on open, unread badge in the navbar menu), `/account/listings` (status and message counts), `/account` (profile plus Verified Hokie card).
- **Verified Hokie**: the user enters a `@vt.edu` address, gets an email link to `/verify?token=…`, and presses Confirm (a button, so email scanners can't use up the link). Sets `User.vtEmail` and `vtVerifiedAt`.
- **Password reset**: `/forgot-password` always shows success (no account enumeration) and emails a 1-hour link to `/reset-password?token=…`.
- **Auth**: signup and login support a safe `?next=` redirect (same-site paths only).

## 4. Data model (`prisma/schema.prisma`)

- `Listing`: core fields plus `startDate`/`endDate` (nullable; older rows only have the free-text `availability`, which is generated from the dates for new rows), `isTaken`, `photos String[]` (`imageUrl` = the cover), `ownerId` (nullable; null means sample).
- `User`: email, passwordHash, name, `vtEmail` (unique), `vtVerifiedAt`.
- `Inquiry`: listing (cascade delete), name, email, message, `readAt`.
- `EmailToken`: one-time links. Only a SHA-256 hash is stored, with purpose `verify_vt` or `reset_password`. Cascades with the user.

`amenities` is still a JSON string (a SQLite carryover) and is parsed in `app/_lib/listings.ts`.

**Local dev and production share the same Neon database.** Migrations run locally hit production. Keep them additive. `prisma migrate dev` sometimes refuses to run in non-interactive shells. The workaround: `prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script` into a new migration folder, then `prisma migrate deploy`.

Current data: the 10 Blacksburg sample listings (no owner), also stored in `prisma/seed.ts`, plus the owner's own account.

## 5. Environment variables (see `.env.example`)

| Var | Needed for | Status |
|---|---|---|
| `DATABASE_URL` | everything | set |
| `AUTH_SECRET` | everything (the app 500s without it) | set |
| `RESEND_API_KEY`, `EMAIL_FROM` | host alerts, VT verification, password reset | **not set yet**. Requires a custom domain verified in Resend (a `vercel.app` address can't be verified). Without them: production skips email; dev prints emails, including links, to the server console. |
| `BLOB_READ_WRITE_TOKEN` | photo uploads | **not set yet**. Create a Blob store in Vercel → Storage and connect it to the project. |
| `NEXT_PUBLIC_SITE_URL` | links in emails | optional; defaults to the vercel.app URL |

Email links in production always use `SITE_URL`, never the request Host header, to prevent reset-link poisoning (`app/_lib/origin.ts`).

## 6. Where things live

- `app/_lib/listings.ts`: every listing, inbox, and count query. `liveWhere()` defines what counts as live.
- `app/_lib/format.ts`: client-safe helpers (terms, dates in UTC, prices, allowed photo hosts).
- `app/_lib/email.ts`, `app/_lib/tokens.ts`, `app/_lib/origin.ts`: email and one-time links.
- Server actions: `app/host/actions.ts` (listings), `app/listings/actions.ts` (inquiries), `app/_lib/auth-actions.ts` (auth and reset), `app/account/actions.ts` (VT verification).
- `app/api/upload/route.ts`: issues Vercel Blob client-upload tokens (signed-in users only, JPG/PNG/WebP, 10 MB).

## 7. Gotchas

- Don't run `npm run build` while `next dev` is running; it corrupts `.next`.
- The project folder is synced by OneDrive, which sometimes makes the dev server flaky or deletes `.claude/launch.json`.
- `npx tsx` scripts can hang in this environment. Plain `node` `.mjs` scripts using `pg` work.
- `next/image` only loads `images.unsplash.com` and `*.public.blob.vercel-storage.com` (see `next.config.ts`).
- Commit style: one line, no body, no co-author lines.

## 8. Ideas not built yet

- Saved/favorite listings, and "alert me when a new place matches".
- Map view (deliberately skipped so far).
- Messaging threads in-app (today the reply goes over email).
- Admin tools to remove reported listings (reports come in over email for now).
- Moving `amenities` to a native Postgres array.
