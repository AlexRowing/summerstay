# SummerStay — Project Handoff

> Last updated: 2026-07-16. Written so another developer or AI can continue with zero prior context.
> Live: https://summerstay.vercel.app · Repo: https://github.com/AlexRowing/summerstay · Branch: `master`

---

## ⚠️ Read first: current working-tree state

There are **3 uncommitted modified files** right now (built successfully, but NOT browser-verified, NOT committed, NOT pushed):

- `app/_components/ContactForm.tsx` — success-copy honesty fix (P1)
- `app/_components/DeleteListingButton.tsx` — styled two-step inline delete confirm (P3)
- `app/listings/[id]/page.tsx` — mobile sticky contact bar + `#contact` anchor + bottom padding (P2)

These implement three findings from an `/impeccable critique` of the listing detail page. `npm run build` passes. **Step 1 of "next steps" is to verify these in the browser, commit, and push.** A dev server may still be running on port 3000.

---

## 1. Project Overview

**What it does.** SummerStay is a web marketplace where college students sublet their apartment for the summer and where other students find one near campus. Anyone can browse and search listings and contact a host; registered users can post listings and manage (edit/delete) their own.

**Register / intent.** It is a portfolio project — the goal is a cohesive, reliable, production-quality full-stack app that demonstrates engineering judgment to recruiters. Design SERVES the product (it is app UI, not a marketing site).

**Tech stack (exact versions in `package.json`):**
- **Next.js 16.2.10** (App Router) + **React 19.2.4**, **TypeScript 5**
- **Tailwind CSS v4** (`@tailwindcss/postcss`), no `tailwind.config` — theme lives in `app/globals.css` via `@theme inline`
- **Prisma 7.8.0** ORM with **PostgreSQL** (Neon), through the **`@prisma/adapter-pg`** driver adapter (Prisma 7 requires a driver adapter)
- **Auth.js / NextAuth v5** (`next-auth@5.0.0-beta.31`) — credentials provider, JWT sessions
- **bcryptjs 3.0.3** for password hashing (pure JS, no native build — important for Vercel/Windows)
- **next-themes 0.4.6** for light/dark
- Dev: `dotenv`, `tsx`, `eslint`, `eslint-config-next`
- **Deployed on Vercel**; database on **Neon**. Node 20+.

**Folder structure (high level):**
```
app/
  _components/     Reusable UI (client + server components)
  _lib/            Data access (listings.ts), Prisma client (db.ts), auth actions, form validation
  generated/prisma GENERATED Prisma client — gitignored, created by `prisma generate`
  account/         /account (profile) + /account/listings (my listings)
  api/auth/[...nextauth]/  Auth.js route handler
  host/            /host post-a-listing (protected) + actions.ts (create/update/delete listing)
  listings/        /listings (browse+search), /listings/[id] (detail), /listings/[id]/edit, actions.ts (inquiry)
  login/  signup/  Auth pages
  icon.tsx         Generated favicon (coral "S")
  opengraph-image.tsx  Generated social share image
  error.tsx  not-found.tsx  loading.tsx (+ listings loading.tsx)  Route special files
  globals.css      Design tokens + focus ring
  layout.tsx       Root layout (Navbar, Footer, ThemeProvider, metadata)
  page.tsx         Homepage
auth.ts            Auth.js configuration (NextAuth() export)
auth.d.ts          Session type augmentation (adds user.id)
prisma/            schema.prisma, migrations/, seed.ts
prisma.config.ts   Prisma 7 config (loads dotenv, points at schema + seed)
PRODUCT.md  DESIGN.md  README.md   Docs
.impeccable/       impeccable-skill working files (gitignored)
```

---

## 2. Current Implementation

### Completed features (all live in production)
- **Homepage** (`app/page.tsx`): hero, "How it works" 3-step strip, featured listings (3 newest), footer.
- **Browse + search** (`app/listings/page.tsx`): grid of `ListingCard`s. Search/filter by **city** (case-insensitive `contains`), **max price** (`<=`), **bedrooms** (`>=`), driven by URL search params (`/listings?city=Austin&maxPrice=1200&bedrooms=2`) via a plain GET form. Empty state distinguishes "no listings" vs "no matches."
- **Listing detail** (`app/listings/[id]/page.tsx`): back link, title/location, hero image, stat cards (bd/ba/distance/availability), description, amenity pills, sticky sidebar with price + (owner → Edit/Delete) or (non-owner → contact form). Dynamic page `<title>` = listing name. 404 via `notFound()` for bad ids.
- **Post a listing** (`app/host/page.tsx`, protected): full form via `ListingForm` + `createListing` Server Action. Inline validation.
- **Edit listing** (`app/listings/[id]/edit/page.tsx`, protected + owner-only): same `ListingForm` prefilled, `updateListing` action.
- **Delete listing**: owner-only, `deleteListing` action (confirm UI is the uncommitted styled version; the committed version uses `window.confirm`).
- **Contact host / inquiry** (`ContactForm` + `createInquiry` in `app/listings/actions.ts`): records an `Inquiry` row, shows success state. Uses `useActionState`.
- **Auth**: email/password signup, login, logout. bcrypt hashing. Generic login errors (no user enumeration).
- **User menu** (`UserMenu.tsx`): avatar + name dropdown (Account, My listings, Log out); replaces Login/Signup when authed.
- **Account page** (`/account`): name, email, member-since (read-only).
- **My Listings** (`/account/listings`): the user's own listings, empty state.
- **Production states**: `loading.tsx` skeletons (listings + detail), empty states, `error.tsx` boundary, branded `not-found.tsx` 404.
- **Inline form validation** across all forms (login, signup, contact, listing) — native popups suppressed (`noValidate`), friendly per-field messages via `app/_lib/form-validation.ts`. Server-side validation unchanged.
- **Light/dark theme** (next-themes, class-based), theme toggle in footer.
- **Accessibility**: global keyboard `:focus-visible` coral ring (globals.css); WCAG AA contrast; alt text on images.
- **Metadata/SEO**: per-page titles (`%s · SummerStay` template, dynamic listing titles), generated favicon (`icon.tsx`), OpenGraph image (`opengraph-image.tsx`), OG/Twitter tags.
- **Design docs**: `PRODUCT.md` (strategy) and `DESIGN.md` (visual system) committed.

### Partially completed / in-progress
- **Critique fixes (UNCOMMITTED)** — the 3 files above: contact-copy honesty, mobile contact bar, styled delete confirm. Built, not verified/committed.

### Intentionally NOT implemented (deferred by design)
- **Host inbox / inquiry delivery.** Inquiries are stored in the DB but **never delivered or shown to the host**. No email, no notification, no inbox. (The committed contact copy said "the host will reach out," which is untrue; the uncommitted fix softens it to "we've saved your interest.")
- **Multiple photos per listing.** One `imageUrl` per listing; no gallery. Needs a schema change.
- **OAuth / social login, password reset, email verification** — deliberately out of scope; credentials-only.
- **Payments, reviews/ratings, maps, messaging, AI** — explicitly excluded from v1.

---

## 3. Current Architecture

**Frontend.** Next.js App Router. **Server Components by default**; only interactive pieces are Client Components (`"use client"`): all forms (`ContactForm`, `LoginForm`, `SignupForm`, `ListingForm`), `UserMenu`, `DeleteListingButton`, `ThemeProvider`, `ThemeToggle`. Styling is Tailwind v4 utility classes reading CSS-variable design tokens.

**Backend.** No separate backend service. Server-side logic runs in:
- **Server Components** (pages) that read data directly from Prisma.
- **Server Actions** (`"use server"`) for all mutations: `createListing`/`updateListing`/`deleteListing` (`app/host/actions.ts`), `createInquiry` (`app/listings/actions.ts`), `authenticate`/`register`/`signOutAction` (`app/_lib/auth-actions.ts`).
- **One route handler**: `app/api/auth/[...nextauth]/route.ts` (Auth.js endpoints).

**Database.** PostgreSQL on Neon, accessed via Prisma 7 + `@prisma/adapter-pg`. A single shared Prisma client is created in `app/_lib/db.ts` (singleton stashed on `globalThis` to survive dev hot-reload). The client is generated to `app/generated/prisma/` (gitignored).

**Authentication.** Auth.js v5 (`auth.ts`), credentials provider, JWT session strategy. See section 5.

**API routes.** Only `/api/auth/*` (Auth.js). Everything else is Server Components + Server Actions; there is no REST/GraphQL API.

**Data flow (read).** Page (Server Component) → `getListings()` / `getListingById()` / `getListingsByOwner()` in `app/_lib/listings.ts` → Prisma → Neon. `listings.ts` is the single data-access seam; it maps DB rows to the app's `Listing` type (parsing the `amenities` JSON string into an array). Because the navbar calls `auth()` on every page, **all routes render dynamically** (server-rendered per request), so listing data is always fresh.

**Data flow (write).** Client form → Server Action → validate → Prisma write → `revalidatePath('/')` + `revalidatePath('/listings')` (+ the detail path on edit) → `redirect()` to the result. Inquiry/auth actions use `useActionState` and return `{ error }` states rendered inline.

---

## 4. Database

**Provider:** PostgreSQL on **Neon** (serverless). Local dev and production point at the **same Neon database** (decision: dev/prod parity). Connection string in `DATABASE_URL` (`.env` locally, Vercel env var in prod). Use the **pooled** Neon string.

**Prisma schema (`prisma/schema.prisma`), current:**
```prisma
generator client { provider = "prisma-client"  output = "../app/generated/prisma" }
datasource db   { provider = "postgresql" }

model Listing {
  id               String   @id @default(cuid())
  title            String
  city             String
  neighborhood     String
  pricePerMonth    Int
  bedrooms         Int
  bathrooms        Int
  distanceToCampus String
  availability     String
  description      String
  amenities        String            // JSON-encoded string[]; parsed in app/_lib/listings.ts
  imageUrl         String
  createdAt        DateTime @default(now())
  inquiries        Inquiry[]
  owner            User?    @relation(fields: [ownerId], references: [id])
  ownerId          String?           // nullable: seed listings have no owner
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String?
  createdAt    DateTime  @default(now())
  listings     Listing[]
}

model Inquiry {
  id        String   @id @default(cuid())
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  listingId String
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}
```

**Tables:** `Listing`, `User`, `Inquiry`.

**Relationships:**
- `User` 1─* `Listing` (via `Listing.ownerId`, nullable).
- `Listing` 1─* `Inquiry` (via `Inquiry.listingId`, **cascade delete** — deleting a listing deletes its inquiries).

**Migrations:** in `prisma/migrations/` — `..._init` (Postgres), `..._add_inquiry`, `..._add_user_and_owner`. (An earlier SQLite `init` was replaced during the Postgres migration.)

**Seeded data (IMPORTANT nuance):**
- `prisma/seed.ts` seeds **6 starter listings** (ids `"1"`–`"6"`, no owner) via upsert. This is what `npx prisma db seed` / `prisma migrate reset` produces.
- **20 additional Virginia test listings** (10 Blacksburg/VA Tech, 10 Charlottesville/UVA) were inserted via a **one-off throwaway script, NOT added to `seed.ts`.** So the live DB currently has **~26 listings**, but a fresh reseed would only restore 6. ➜ TODO: fold the 20 VA listings into `seed.ts` if they should persist through resets.
- **1 User** exists in the DB (the owner's own account, created while testing on the live site). All test accounts created during development were deleted.
- Inquiries: created during testing were deleted; count ~0.

**Prisma 7 specifics to remember:**
- Client generates to `app/generated/prisma/` (gitignored). Import `PrismaClient` from `@/app/generated/prisma/client`.
- `prisma migrate dev` does **not** auto-generate the client — run `npx prisma generate` separately (a `postinstall` script does this on install).
- Config lives in `prisma.config.ts` (loads `dotenv`, sets schema path, seed command `tsx prisma/seed.ts`). The datasource `url` comes from `DATABASE_URL` via that config.
- Standalone scripts (seed, one-offs) must `import "dotenv/config"` and construct `new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })`.

---

## 5. Authentication

**Library:** Auth.js / NextAuth v5 (`next-auth@5.0.0-beta.31`), configured in `auth.ts` which exports `{ handlers, auth, signIn, signOut }`.

**How it works:**
- **Provider:** Credentials (email + password). No OAuth.
- **`authorize()`** (in `auth.ts`): lowercases/trims email, looks up the `User`, `bcrypt.compare(password, user.passwordHash)`; returns the user on match, `null` otherwise. Returning `null` produces a generic failure (no leak of which field was wrong).
- **Session strategy:** JWT (credentials can't use DB sessions). Callbacks copy `user.id` into the token and then into `session.user.id`.
- **Type augmentation:** `auth.d.ts` adds `id: string` to `Session["user"]` (note: next-auth's own `user.id` is typed `string | undefined`, so pages that pass it to a `string` param narrow it first via `const userId = session?.user?.id; if (!userId) redirect("/login")`).
- **Route handler:** `app/api/auth/[...nextauth]/route.ts` exports `{ GET, POST } = handlers`.
- **Signup:** custom `register` action (`app/_lib/auth-actions.ts`) — validates, checks email uniqueness, `bcrypt.hash(password, 10)`, creates the user, then `signIn("credentials", ...)`. Minimum password length 8.
- **Login/logout:** `authenticate` action (calls `signIn`, catches `AuthError` → generic message, rethrows redirect) and `signOutAction` (calls `signOut`).

**Session management:** JWT stored in an httpOnly secure cookie (Auth.js default). The navbar is an async Server Component that calls `await auth()` on every request to render logged-in vs logged-out state. This makes **every page dynamic** (no static prerendering) — acceptable and keeps data fresh.

**Protected routes (server-side `auth()` checks, redirect to `/login` if unauthenticated):** `/host`, `/account`, `/account/listings`, `/listings/[id]/edit`.

**Authorization (owner-only):** `updateListing` and the edit page verify `listing.ownerId === session.user.id`; `deleteListing` throws if not the owner. Enforced **server-side**, not just hidden in the UI. Verified across logged-out, wrong-user, and owner cases.

**Known limitations:**
- No password reset, no email verification, no OAuth.
- No rate limiting on login/signup.
- `AUTH_SECRET` must be set in every environment or Auth.js throws at runtime (breaks every page because the navbar calls `auth()`).

---

## 6. Marketplace Integrations

**None.** SummerStay is a **standalone, first-party marketplace** — it stores its own listings in its own database. It does **not** integrate, scrape, or sync any external marketplace (no Zillow, Craigslist, Facebook Marketplace, Apartments.com, etc.). There is **no abstraction layer** for external marketplaces, because there are no external marketplaces in scope. None are planned in the codebase or roadmap. (If a future direction wanted aggregation, it would be net-new architecture.)

---

## 7. AI Architecture

**None exists, and none is built.** SummerStay contains **zero AI/LLM features**. AI was **explicitly excluded from v1** in the product roadmap. There is no AI SDK, no model calls, no embeddings, no recommendation engine, no search ranking beyond a plain SQL `where` clause. If AI is ever added, it is entirely greenfield. (The owner has stated a *separate* project will showcase AI/AWS/APIs; SummerStay is deliberately the polish/product-craft piece.)

---

## 8. UI

**Design system.** Captured in `DESIGN.md` (machine-readable frontmatter + prose) and `PRODUCT.md` (strategy). North star: "The Warm Front Porch" — welcoming, trustworthy, restrained.

**Tokens (`app/globals.css`, CSS variables, light + `.dark`):**
- Accent: `--brand` `#e05d3d` (coral), `--brand-dark` `#c24b2e`, `--brand-soft` `#fdeee9`/`#43241c`
- Neutrals (stone family): `--surface` `#faf9f7`/`#1c1917`, `--card` `#ffffff`/`#292524`, `--ink` `#1c1917`/`#f5f5f4`, `--ink-soft` `#78716c`/`#a8a29e`, `--line` `#e7e5e4`/`#44403c`
- Exposed to Tailwind via `@theme inline` as `bg-brand`, `text-ink`, `border-line`, etc.
- Global `:focus-visible` coral outline (unlayered, longhand `outline-color` — `var()` in the `outline` shorthand dropped the color).

**Typography:** single family **Geist** (via `next/font`, `--font-geist-sans`); Geist Mono defined but unused. Hierarchy: hero `text-5xl`/`6xl` tracking-tight, page `text-3xl`, section `text-2xl`, body `text-base/lg`, labels `text-sm/xs`.

**Elevation:** flat at rest with hairline borders; `shadow-sm` under cards, `shadow-lg` on hover / floating (dropdown). Cards lift 4px + photo zooms 5% on hover (300ms / 500ms).

**Key components** (all in `app/_components/` unless noted): `Navbar` (sticky, backdrop-blur, auth-aware), `Footer` (with theme toggle + GitHub link), `ListingCard` (signature: 4:3 photo, availability badge, hover lift/zoom), `ContactForm`, `ListingForm` (create+edit), `LoginForm`, `SignupForm`, `UserMenu` (dropdown), `DeleteListingButton`, `ThemeProvider`, `ThemeToggle`. Buttons: coral pill (primary), outline pill (secondary), text links; inputs `rounded-lg` bordered.

**Styling approach:** Tailwind v4 utilities + tokens; no CSS modules, no styled-components. `next/image` for images (only `images.unsplash.com` is allow-listed in `next.config.ts`, so listing photos must be Unsplash URLs or they won't render).

**Remaining design work (from the `/impeccable critique` of the detail page, score 34/40 "Good"):**
- Verify/commit the 3 uncommitted fixes (mobile bar, delete confirm, contact copy).
- Multi-photo gallery (needs data model).
- Consider running `/impeccable critique` on the listings page and homepage.
- Minor: stat-card labels are 12px muted (bump size/weight); mobile access to "Browse listings" when logged in (currently hidden `< sm`); show/hide password toggle.

---

## 9. Environment

**Required environment variables** (both must be set locally in `.env` — gitignored — AND in Vercel):
- `DATABASE_URL` — Neon Postgres **pooled** connection string (`postgresql://...-pooler...sslmode=require`).
- `AUTH_SECRET` — any strong random string. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. **Required or the app 500s on every page.**

**Services:** Neon (database), Vercel (hosting), GitHub (repo). Images from Unsplash CDN.

**Deployment status:** Live on Vercel at **summerstay.vercel.app**. **Auto-deploys on push to `master`.** Build runs `postinstall` (`prisma generate`) then `next build`. No CI beyond Vercel. Local dev and prod share the same Neon DB, so a local Prisma migration also migrates production (additive migrations are safe; be careful with destructive ones).

**Local setup from scratch:** `npm install` → create `.env` with the two vars → `npx prisma migrate dev` → `npx prisma db seed` → `npm run dev`.

---

## 10. Outstanding TODOs

**High priority**
1. **Verify + commit + push the 3 uncommitted critique fixes** (mobile contact bar, styled delete confirm, contact copy). Browser-check the mobile bar (resize to phone, confirm the sticky bar appears and `#contact` anchor scrolls) and the two-step delete (as an owner).
2. **Decide the inquiry story:** either keep the softened copy (done in the uncommitted fix) OR build a real **host inbox** (show inquiries per listing in "My Listings"). Right now inquiries go nowhere.
3. **Fold the 20 VA seed listings into `prisma/seed.ts`** so a `prisma migrate reset` doesn't lose them.

**Medium priority**
4. Switch `amenities` from a JSON string to a native Postgres `String[]` array (Postgres supports it; the JSON-string was a SQLite carryover). Touches `schema.prisma`, `seed.ts`, and `app/_lib/listings.ts` (`toListing`).
5. Mobile navigation: make "Browse listings" reachable on phones when logged in (currently `hidden sm:block`).
6. Run `/impeccable critique` (or a manual pass) on the listings page and homepage; act on findings.
7. Quiet the `pg` SSL-mode deprecation warning (tune the `sslmode`/`uselibpqcompat` params in `DATABASE_URL`).

**Nice-to-have**
8. Multi-photo gallery per listing (schema change: a `photos String[]` or a `Photo` table).
9. Show/hide password toggle on auth forms.
10. Password reset + email verification (would also make the credentials auth more "complete").
11. A styled/animated confirm system if more destructive actions appear.
12. `.impeccable/design.json` sidecar is generated but gitignored; fine as-is.

---

## 11. Known Bugs / Tech Debt / Postponed

**Known issues**
- **Inquiries are captured but never delivered/read.** No host inbox. (Copy is honest after the uncommitted fix.)
- **`window.confirm()` for delete** in the *committed* code is an off-brand native popup (fixed in the uncommitted `DeleteListingButton.tsx`).
- **20 VA listings are not in `seed.ts`** — a reseed drops them (see §4).
- **`pg` SSL deprecation warning** prints during DB connections (cosmetic; connection works).

**Tech debt**
- `amenities` stored as a JSON string, not a native array (SQLite carryover).
- The duplicated form field-style class strings (`inputClass`/`labelClass`/`errorClass`) are repeated across form components rather than centralized.
- Every page is dynamic (navbar `auth()`); intentional, but means no static caching of listings.

**Intentionally postponed** (see §2 "not implemented"): host inbox, multi-photo, OAuth, password reset, payments, reviews, maps, messaging, AI.

**Environment quirks (dev only)**
- The project lives in a **OneDrive-synced folder**, which occasionally makes the dev server's file-watching flaky and has repeatedly deleted `.claude/launch.json`; recreate it if the preview tool complains. Restarting the dev server fixes stale-state issues. Do **not** run `npm run build` while `next dev` is running — it corrupts `.next` and the dev server serves broken state; stop dev first.
- On Windows, some node scripts print a harmless libuv `Assertion failed ... async.c` on exit after producing correct output.
- Browser-tool screenshots timed out throughout recent sessions (environment issue, not the app); verification has relied on the accessibility tree, computed styles, and `getComputedStyle`.

---

## 12. Git History

**Branch:** `master` (also the default/main branch). Remote: `github.com/AlexRowing/summerstay`. Git user: `AlexRowing`.
**Commit style (owner preference):** single concise line, **no** multi-line body, **no** `Co-Authored-By`/self-attribution.

**Milestones (newest first), from `git log`:**
- `71ee2a4` Add DESIGN.md design system documentation
- `1fb0e38` Add PRODUCT.md design context
- `2cfd85f` Add page titles, branded favicon, and social preview image
- `3c19e7a` Add keyboard focus rings to interactive elements
- `da7454c` Polish login and signup pages with card layout
- `3261bbc` Add authenticated user menu, account page, and my listings
- `a373f7b` Replace native validation popups with inline form messages
- `f9656e8` Remove unused lucide-react dependency
- `bf0ee46` Flesh out README ...
- `5b60c50` Add city, price, and bedroom search to listings
- `18ed49c` Add listing ownership: protected posting, owner-only edit and delete
- `821e71b` Add email/password auth with Auth.js
- `1c6e37a` Add inline validation to the host form
- `49b0991` Add loading, empty, error, and 404 states
- `942479b` Add contact inquiry form to listing detail page
- `7b21177` Add prisma generate postinstall so Vercel builds the client
- `a0855af` protgres migration (owner's commit)
- `5815e47` Migrate database from SQLite to Neon Postgres
- `c81e9bb` Add Prisma SQLite database and post-a-listing form
- `a57bacd` Redesign listing detail page with sticky contact card
- `d9ccd60` Polish homepage and footer also adding dark mode
- (earlier) initial frontend, README iterations, config cleanup.

**Narrative arc:** mock-data frontend → design polish + dark mode → SQLite/Prisma → migrate to Neon Postgres → deploy to Vercel → contact-inquiry loop → production states → auth → ownership/authorization → search → README → UX polish (validation, user menu, account) → accessibility + metadata → design docs (PRODUCT/DESIGN) → (uncommitted) critique fixes.

---

## 13. Exact Next Steps (in order)

1. **Finish the critique fixes.** Start dev (`npm run dev`), open a listing at a phone width and confirm the sticky bottom bar shows price + "Contact host" and its button scrolls to the form (`#contact`). Log in as the account that owns a listing (or create one), open it, and confirm the two-step inline delete works (Delete → confirm → Cancel resets). Then `git add app/_components/ContactForm.tsx app/_components/DeleteListingButton.tsx "app/listings/[id]/page.tsx"` and commit one line (e.g. `Fix contact copy, add mobile contact bar and styled delete confirm`), then `git push`. Confirm the Vercel deploy is green.
2. **Add the 20 VA listings to `prisma/seed.ts`** (so resets keep them), or accept they're live-only.
3. **Decide inquiries:** keep honest copy (done) or build a **host inbox** — a section in `/account/listings` (or each listing) showing that listing's `Inquiry` rows to its owner. This is the single most valuable next feature; it makes the contact loop real.
4. **`amenities` → native array** (medium refactor, removes tech debt).
5. **Mobile nav** for "Browse listings" when logged in.
6. **More design passes** (`/impeccable critique` on listings + homepage) and act on findings.
7. Consider password reset / OAuth only if you want the auth story more complete for recruiters.

---

## 14. One-Page Summary (zero-context bootstrap)

**SummerStay** is a full-stack **college summer-sublet marketplace** (portfolio project) live at **summerstay.vercel.app**, repo `github.com/AlexRowing/summerstay`, branch `master`. Stack: **Next.js 16 App Router + React 19 + TypeScript**, **Tailwind v4** (tokens in `app/globals.css`, no config file), **Prisma 7 + Postgres on Neon** via the `@prisma/adapter-pg` driver adapter (client generated to `app/generated/prisma/`, gitignored; run `prisma generate` after installs — a `postinstall` does this), **Auth.js v5** credentials auth with **JWT sessions** and **bcryptjs** hashing, **next-themes** light/dark. Deployed on **Vercel, auto-deploy on push to master**; local dev and prod share the **same Neon DB**. Two required env vars: **`DATABASE_URL`** (Neon pooled) and **`AUTH_SECRET`** (or the app 500s everywhere).

Architecture: **Server Components read data directly from Prisma**; **Server Actions** do all writes (create/update/delete listing in `app/host/actions.ts`, inquiry in `app/listings/actions.ts`, auth in `app/_lib/auth-actions.ts`); the only route handler is `/api/auth/[...nextauth]`. `app/_lib/listings.ts` is the single data-access seam (`getListings`/`getListingById`/`getListingsByOwner`), mapping rows to the `Listing` type (parses the `amenities` JSON string). Navbar calls `auth()` on every page, so **all routes are dynamic**.

Data model (3 tables): **Listing** (has `ownerId?` → User, `amenities` as JSON string, one `imageUrl`), **User** (email unique, `passwordHash`, name), **Inquiry** (→ Listing, cascade delete). ~26 listings live (6 in `seed.ts` + 20 VA test listings inserted ad-hoc and **not** in the seed file), 1 user.

Done: browse/search (city/price/bedrooms via URL params), listing detail, post/edit/delete (owner-only, server-enforced), contact inquiry, auth (signup/login/logout + user menu + account + my-listings), production states (loading/empty/error/404), inline validation, dark mode, focus rings, metadata/favicon/OG, PRODUCT.md + DESIGN.md.

**Not built (by design):** host inbox / inquiry delivery (inquiries are stored but nobody reads them), multi-photo listings, OAuth/password-reset, payments/reviews/maps/messaging, **and AI (explicitly excluded; there is no AI anywhere)**. There are **no external marketplace integrations** — SummerStay is a standalone first-party marketplace with no aggregation layer.

**Immediate state:** 3 uncommitted, built-but-unverified files implement a mobile contact bar, a styled two-step delete confirm, and honest contact-success copy (from an `/impeccable critique` that scored the detail page 34/40). **Next step: verify those in the browser, commit (one-line message, no co-author), push, confirm the Vercel deploy.** Then optionally build the host inbox to make the contact loop real, add the 20 VA listings to `seed.ts`, and migrate `amenities` to a native Postgres array. Gotchas: don't run `npm run build` while `next dev` runs (corrupts `.next`); listing images must be `images.unsplash.com` URLs (next/image allowlist); OneDrive folder can make the dev server flaky and delete `.claude/launch.json`.
