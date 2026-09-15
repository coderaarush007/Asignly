# Assignment. — Focus Desk

A personal assignment tracker for college students. Capture assignments manually or by scanning a
screenshot with AI, track them on a dashboard/calendar/subjects view, and watch real analytics build
up as you complete them.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Auth, RLS) · Gemini API ·
PWA (manifest + service worker)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Create a project at [supabase.com](https://supabase.com), then open **Settings → API** and copy the
Project URL and anon/publishable key.

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
GEMINI_API_KEY=
```

`GEMINI_API_KEY` is server-only (used in `src/app/api/ai/extract/route.ts`) and is never sent to the
browser. Get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). The AI scanner UI
works without it, but extraction requests will fail until it's set.

### 4. Run the database migration

In the Supabase dashboard's SQL editor, run `supabase/migrations/0001_init.sql`. This creates the
`profiles`, `subjects`, `assignments`, `assignment_tasks`, and `assignment_attachments` tables, enables
row-level security on all of them, and wires up a trigger that creates a `profiles` row whenever someone
signs up.

### 5. (Optional) Seed development data

After creating an account in the running app, run in the SQL editor:

```sql
select public.seed_demo_data('you@example.com');
```

This adds the six sample subjects (Physics, Mathematics, Chemistry, Programming, BEEE, English) and a
few example assignments with realistic, relative due dates. Defined in `supabase/seed.sql`.

### 6. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll land on `/login` until you sign up.

## Project structure

```
src/
  app/
    (auth)/            login, signup
    (app)/             the protected shell: dashboard, assignments, calendar, subjects, analytics,
                        ai-scanner, settings, profile
    api/ai/extract/     server-side Gemini call
  components/           ui primitives, feature components, layout
  lib/
    supabase/           browser/server/middleware Supabase clients
    db/                 data access — *.queries.ts (reads) and *.actions.ts (server action mutations)
    ai/                 Gemini extraction + response schema
    validation/         zod schemas shared by forms and server actions
    analytics.ts        pure functions computing dashboard/analytics metrics from real data
supabase/
  migrations/0001_init.sql   schema + RLS
  seed.sql                   dev seed data
```

## Notes

- Every table has row-level security scoped to `auth.uid()` — a user can only ever read or write their
  own data.
- The AI scanner never saves an assignment automatically. Extraction results go through a review step
  the user must confirm.
- Offline support is intentionally honest: the app shell and an offline page are cached, but there is no
  offline data sync in this version — see the Offline section in Settings.
