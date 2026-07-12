# SummerStay

A web platform that helps college students find and list short-term summer housing near university campuses. SummerStay connects students who need temporary housing with students looking to hand off their leases during the summer.

## Live Demo

https://summerstay.vercel.app/

## Screenshots

### Homepage

<img width="1917" height="1126" alt="Screenshot 2026-07-08 061706" src="https://github.com/user-attachments/assets/1a53a2b8-b22b-43c9-8fd8-34a379892518" />

### Listings Page

<img width="1917" height="1127" alt="Screenshot 2026-07-08 061922" src="https://github.com/user-attachments/assets/60681304-f7ac-4e25-8614-6b8bc5b6d580" />

## Features

- **Browse & search** sublets by city, max price, and bedroom count — filters live in the URL (`/listings?city=Austin&maxPrice=1200`), so a filtered view is a shareable link.
- **Listing detail** pages with photos, amenities, and a contact form.
- **Accounts** (email + password) so students can post listings.
- **Ownership** — hosts can edit and delete only their own listings; posting requires logging in.
- Responsive across desktop and mobile.

## Tech Stack

**Framework**
- Next.js 16 (App Router) + React 19
- TypeScript

**Backend & data**
- Prisma 7 ORM with PostgreSQL (Neon)
- Auth.js (NextAuth v5) — credentials auth, JWT sessions, bcrypt hashing
- Server Actions for mutations

**UI**
- Tailwind CSS v4 with a design-token system (light/dark theme)

**Deployment**
- Vercel

## How It's Built

A few deliberate decisions worth calling out:

- **Server Components by default.** Pages fetch data on the server and ship no client JavaScript unless a piece of UI needs interactivity. Only the forms, the theme toggle, and the delete-confirm button are Client Components.
- **One data-access seam.** Every read goes through `getListings` / `getListingById` in `app/_lib/listings.ts`. Moving from hardcoded data to a real database, and later adding search filters, touched only this file — the pages never changed how they ask for data.
- **Search in the URL, not client state.** The browse page reads `searchParams` and builds a Prisma `where` clause, so there's no client-side filtering to keep in sync and every filtered view is bookmarkable.
- **Authorization, not just authentication.** Every mutation verifies `listing.ownerId === session.user.id` on the server — a logged-in user cannot edit or delete someone else's listing, regardless of what the UI shows.
- **Progressive forms.** Forms post to Server Actions and use `useActionState` for inline validation and pending states.

## Running Locally

Requires Node 20+ and a PostgreSQL database (a free [Neon](https://neon.tech) project works well).

Clone the repository:

```bash
git clone https://github.com/AlexRowing/summerstay.git
cd summerstay
```

Install dependencies (this also generates the Prisma client):

```bash
npm install
```

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://..."   # your Postgres connection string
AUTH_SECRET="..."                 # any strong random string
```

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Create the tables and load the starter listings:

```bash
npx prisma migrate dev
npx prisma db seed
```

Start the dev server:

```bash
npm run dev
```

Then open http://localhost:3000.

## Project Structure

```
app/
  _components/    Reusable UI (ListingCard, Navbar, forms, theme toggle)
  _lib/           Data access (listings.ts) and the Prisma client (db.ts)
  listings/       Browse, detail, and edit routes
  host/           Post-a-listing (protected) + listing mutation actions
  login/ signup/  Auth pages
auth.ts           Auth.js configuration
prisma/           Schema, migrations, and seed data
```

## What's Next

- Deliver inquiries to hosts (a host inbox, or email) — they are currently recorded but not yet surfaced to the host.
- Listing photo uploads (currently a photo URL).
- A fully designed dark theme.
