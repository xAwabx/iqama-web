# Iqama — Web (Marketing Site)

> **Status:** Greenfield. Nothing built yet. This is the marketing/landing site for the Iqama mobile app (iOS + Android).
> The mobile app itself lives at `../iqama_app` and is at Milestone 6 (Partners + Pair Streaks + Nudges).
> This file is the high-level reference for the web project. Detail belongs in companion files as they're added.

---

## What this is (and what it isn't)

**iqama_web is the pre-launch waitlist site.** Its only job is to collect emails from interested users before the mobile app ships.

**MVP scope is exactly one route: `/waitlist`.**

That page contains:

- A short pitch about the app (what it is, the four pillars in one breath, who it's for)
- A single form: **email field** + submit button
- `react-hook-form` + `zod` for validation (email format + required)
- On submit: a **client-side Supabase call** inserting into a `waitlist` table
- Success state (thanks message), error state (try again), loading state (disabled button)

That's it. No landing page, no `/privacy`, no `/terms`, no `/download`, no blog, no auth, no SSR magic. `/` can redirect to `/waitlist` or just _be_ the waitlist page — pick whichever needs fewer files.

It is **not**:

- A web version of the prayer tracker. Logging, stats, and partner mechanics live exclusively in the mobile app.
- An auth surface. The Supabase insert is anonymous — `anon` key client-side, RLS policy that allows `INSERT` on `waitlist` for `anon` and nothing else (no `SELECT`, no `UPDATE`, no `DELETE`).
- A CMS. Copy lives in the component file. If we need to edit it, we edit the JSX.

**Post-launch scope** (do not scaffold now): full landing page, privacy/terms, support, store-redirect, blog. When the app ships, this file gets rewritten.

---

## The product we're marketing (read for context)

A focused prayer accountability app for Muslims. Helps users stay consistent with their five daily prayers (Salah) through tracking, streaks, accountability partners, and smart reminders.

**Four pillars (locked):**

1. **Prayer tracker** — log all 5 prayers daily, on-time / late / missed, fully offline
2. **Streaks** — Snapchat-style pair streaks shared with accountability partners (no solo streaks)
3. **Accountability partners** — email friend-requests, up to 3 partners, pair streaks + user-initiated nudges
4. **Smart notifications** — local adhan at prayer time, configurable pre-prayer reminder, "about to be missed" nudge

**Why this exists:** primarily to help Muslims stay consistent with their Salah and earn reward from Allah (SWT). Commercial success is secondary but welcomed. Copy and design choices should prioritize **user benefit and Islamic sensitivity** over growth-hacking. No fake scarcity, no FOMO bars, no "join 10,000+ Muslims" if the number isn't real, no shame-based hooks. The mobile app renders missed prayers in muted grey, never red — the website should match that tone.

**Platforms the app ships on:** iOS and Android only. The mobile app source lives at `../iqama_app/`. If you need product detail (schema, flows, milestone status), read `../iqama_app/.claude/CLAUDE.md` and the companion files it links.

---

## Stack at a glance

- **Next.js 15** (App Router) — TypeScript strict
- **Tailwind CSS v4** — design tokens via CSS variables, mirroring the mobile design system 1:1
- **shadcn/ui** — only what we need (`Button`, `Input`, `Form`, `Label`); restyle to match Stillness, don't accept defaults
- **`react-hook-form` + `zod`** + `@hookform/resolvers/zod` — form state + validation
- **`@supabase/supabase-js`** — client-side insert into `waitlist` table using the `anon` key
- **`next/font`** — self-hosted Fraunces, Plus Jakarta Sans, Geist Mono (drop Amiri until we need Arabic copy)
- **Vercel** — hosting (target; not yet provisioned)

**Routing:** App Router. The waitlist page is a client component (it has form state + a Supabase call) — mark it `"use client"`. The page file itself can stay a server component and render a `<WaitlistForm />` client component if you want to keep the marketing copy server-rendered for SEO.

**Supabase setup:**

- This site uses the **same Supabase project as the mobile app** at `../iqama_app`. One project, two clients — the mobile app owns the schema; web only touches the `waitlist` table.
- The `waitlist` table is **already provisioned** in that project with RLS configured (anon INSERT only, no SELECT/UPDATE/DELETE). Don't re-create it, don't migrate it, don't add policies. The local [supabase/waitlist.sql](supabase/waitlist.sql) file is kept as documentation of the shape that was applied — not as a migration to run.
- Schema (for reference, not for re-applying): `waitlist(id uuid pk default gen_random_uuid(), email text not null, created_at timestamptz default now())` with a unique index on `lower(email)` for case-insensitive duplicate detection. See [supabase/waitlist.sql](supabase/waitlist.sql) for the canonical shape.
- RLS (for reference): `INSERT` allowed for `anon`; everything else denied. No `SELECT` policy — even your own client can't read the list back. Pull the list via the dashboard or a service-role script when needed.
- Env vars: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Both safe to ship to the browser — that's the point of the publishable (formerly `anon`) key. Supabase renamed `anon` keys to `publishable` keys; legacy `anon` key values still work in this slot. These point at the same project the mobile app uses; grab them from `../iqama_app`'s env or the Supabase dashboard.
- **Client wiring:** uses `@supabase/ssr`. Browser code calls `createClient()` from [src/lib/supabase/client.ts](src/lib/supabase/client.ts); server code (RSC, server actions, route handlers) calls the async `createClient()` from [src/lib/supabase/server.ts](src/lib/supabase/server.ts). Session refresh runs in [src/proxy.ts](src/proxy.ts) → [src/lib/supabase/proxy.ts](src/lib/supabase/proxy.ts) (Next 16 renamed `middleware.ts` → `proxy.ts`). The waitlist form is a client component, so it imports from `client.ts`. **Never** import `createClient` from the wrong file — server cookies and browser cookies are different APIs.
- Handle the unique-violation error gracefully (Postgres error code `23505`) — treat duplicate signups as success from the user's perspective ("You're already on the list").

> **DB changes require explicit permission.** This project shares a Supabase database with the production mobile app. **Never** run migrations, alter tables, change RLS policies, or execute any DDL/DML against this project without an explicit go-ahead from Awab. That includes "obviously safe" things like adding a column or a new policy. If something looks like it needs a schema change, propose it in chat and wait for sign-off. Applies to dashboard SQL editor, CLI migrations, MCP tools, and any service-role script. Read-only inspection (table listings, row counts via dashboard) is fine.

**No:** SSR data fetching, server actions, route handlers (beyond what `@supabase/ssr` needs), MDX, analytics, third-party scripts. This is one form on one page. The proxy (`src/proxy.ts`) is present for future auth — right now it's a no-op pass-through.

---

## Design System — "Stillness" (strict port from mobile)

The mobile app's design system is the source of truth. Full spec lives at `../design-system/MASTER.md`. Read it before building any screen. Per-page overrides live in `../design-system/pages/`. If something is wrong or missing in those files, fix it **there** — don't redefine tokens locally.

**Direction:** warm paper palette, ink type, rationed orange accent. The site should feel like reading a well-printed book in soft afternoon light — calm, unhurried, no pop-ups, no chat widgets, no cookie banner unless legally required (and if required, a minimal one — not a modal).

### Colors

Hand-tuned warm palette — no generated color scales from a seed. All hex values live in `app/globals.css` as CSS variables, exposed to Tailwind via `@theme`.

| Token         | Hex       | Use                                                                      |
| ------------- | --------- | ------------------------------------------------------------------------ |
| `--paper`     | `#F5F1EB` | Page background — warm cream                                             |
| `--card`      | `#FBF8F3` | Cards, raised surfaces                                                   |
| `--ink`       | `#2A1F18` | Body text, headlines — warm near-black                                   |
| `--ink-muted` | `#8E7E70` | Secondary text, captions, "missed" states. **Never red.**                |
| `--hairline`  | `#E8E0D4` | 1px card borders, dividers                                               |
| `--accent`    | `#C96442` | **Hero orange** — one element per viewport max (hero CTA or active card) |
| `--ember`     | `#E07A3C` | Streak fire icon only. Don't use as a generic accent.                    |

**Dark mode:** mirror via `prefers-color-scheme`. Same tokens, inverted lightness. Define under `@media (prefers-color-scheme: dark)` in `globals.css`. Test both — the mobile app supports both via `ThemeMode.system` and the site should too.

**The rationed-orange rule:** at most one element per viewport at full accent strength. The install-CTA in the hero is usually it. If the page also shows a partner-streak screenshot whose card is orange, the CTA softens to ink-on-paper outline. This rule is what keeps Stillness from feeling like every other SaaS landing.

### Typography

Three fonts for MVP, all self-hosted via `next/font/google` (cached at build time, no runtime fetch):

| Font                                  | Variable         | Use                                                        |
| ------------------------------------- | ---------------- | ---------------------------------------------------------- |
| **Fraunces** (opsz 144, weight 400)   | `--font-display` | The headline ("Iqama" / pitch line). Negative tracking.    |
| **Plus Jakarta Sans** (400 / 600)     | `--font-sans`    | Body copy, form label, button, error text                  |
| **Geist Mono** (400, tabular figures) | `--font-mono`    | If you display a count ("X people on the list") — optional |

Amiri is dropped from MVP — bring it back when we add Arabic copy. Define type scale in `app/globals.css` as semantic CSS variables (`--text-display`, `--text-h1`, `--text-body`, `--text-caption`) and expose via Tailwind theme. No raw `text-[42px]` in components.

### Spacing & radius

Fixed scale — no magic numbers in JSX. Mirror the mobile `IqamaSpacing` / `IqamaRadius` tokens:

```
spacing:  xs:4  sm:8  md:12  lg:16  xl:24  xxl:32  xxxl:48  (px)
radius:   sm:8  md:12 (buttons)  lg:14 (cards)  xl:24 (hero card)  pill:9999
```

Expose via Tailwind `@theme` so you write `p-lg`, `rounded-md`, `gap-xl` — never `p-[17px]`.

### Component conventions

- **Cards:** zero shadow + 1px hairline border (`border-hairline`). The only `box-shadow` allowed is on the hero orange CTA, and even there keep it whisper-soft.
- **Buttons:** primary = `bg-accent text-paper`; secondary = `border-ink text-ink bg-transparent`; ghost = `text-ink hover:bg-card`. Always `rounded-md`. Hover: 4% darken; focus-visible: 2px ink outline offset 2px.
- **No CSS animations on first paint.** Scroll-triggered fade-ins are fine if subtle (≤ 200ms, ease-out, no transforms > 8px). Respect `prefers-reduced-motion`.
- **Imagery:** product screenshots are the hero asset. Mock them in a soft warm frame (rounded device bezel on `--card`), not a glossy gradient. Real screenshots only — no Figma-perfect mocks that mislead.
- **No emoji in body copy.** Crescent moons, sparkles, and fire icons are tempting and tacky. Use SVG icons (Lucide is fine, restyled to match weight).

### Web-only additions to the token system

The mobile spec doesn't define these; add them in `globals.css` and treat as part of Stillness:

- **Breakpoints:** `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1440`. Design mobile-first.
- **Container max-widths:** `--container-prose 65ch` (legal pages) · `--container-content 1120px` (landing sections) · `--container-narrow 720px` (single-column copy blocks).
- **Hover states:** mobile has none. On web, hover should be the _quietest_ interaction — 4% color shift, no scale transforms, no shadow puffs.
- **Focus rings:** `2px solid --ink` with `2px` offset. Never the default browser blue.

---

## Principles

### 1. Keep it boring

One page, one form, one Supabase call. No `useEffect` hacks, no optimistic UI, no analytics SDK, no toast library — `react-hook-form` already gives you submit state; just render conditionally. If you find yourself adding a dependency, stop and ask whether the MVP actually needs it.

### 2. Accessibility minimums

- Form has a real `<label>` tied to the `<input>` via `htmlFor`/`id`
- Validation errors announced (`aria-invalid`, `aria-describedby` pointing at the error message)
- Submit button reachable + visibly disabled while pending
- Color contrast passes WCAG AA (the warm palette does — verify `--ink` on `--paper`)
- Respect `prefers-reduced-motion` if you add any transitions

### 3. Privacy

The waitlist table stores email + timestamp. Nothing else. Don't add UTM capture, IP logging, or fingerprinting "just in case." If we want analytics later, use Vercel Analytics (cookieless) — but not for MVP.

### 4. Brand tone in copy

This is the user's first impression of Iqama. Calm, honest, no growth-hack language. Avoid:

- "Join 10,000+ Muslims" (the number isn't real)
- "Limited spots available" (it's a waitlist, there are no spots)
- "Transform your spiritual life" (overpromise)
- Emoji in body copy

Aim for: a clear sentence about what the app does, a clear sentence about who it's for, the form. That's it.

---

## Working style notes

- Awab has 2.5+ years of full-stack JS/TS — Next.js, React, TS, Tailwind, Supabase are all native. **Don't explain these.**
- Do explain when Next.js 15 / App Router patterns differ from older mental models (RSC vs client components, server actions vs API routes, the `use cache` directive when it lands stable).
- The mobile app is the senior project. When in doubt about product behavior, brand voice, or design tokens, **defer to `../iqama_app/`** rather than inventing something web-specific.
- Move fast, be direct. Skip hedging.

---

## Response style

Keep responses focused and concise. **Avoid large summaries** — don't restate what was just done at the end of a response. After completing a task, give a one-line confirmation, not a recap. No filler. No "as you can see above" wrap-ups.

If a response includes code changes, the code is the artifact — don't follow it with paragraphs explaining what the code does line by line unless asked.

When explicitly asked, respond as "grug brain developer" — simple speech patterns with broken grammar, treat complexity as the ultimate enemy ("complexity very, very bad"), favor pragmatic solutions over clever abstractions. Humble but confident, working code over elegant architecture. **No actual caveman references** — it's a speech pattern, not a period piece.

_Last updated: 2026-05-25. Greenfield project — expect this file to grow as decisions are made. Detail belongs in companion files as they're added; keep this one short._
