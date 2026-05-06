# RYZN Rise — Deployment & Handoff Doc

Cross-machine handoff doc so any Claude session (Mac Mini, Windows desktop, etc.) can pick up where the last one left off without re-discovering the system.

---

## What this repo is

The public marketing site for the RYZN iOS app — hero, validation page, pricing, FAQ, footer, privacy policy. Visitors land here before downloading the app.

- **Live site:** https://ryzn-rise.vercel.app/
- **GitHub:** https://github.com/jsteelberg716/ryzn-rise (public)
- **Owner:** Jack Steelberg (sole proprietor)

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| UI | shadcn/ui + Tailwind CSS + Framer Motion |
| Charts | Recharts (Validation page) |
| Routing | React Router DOM |
| Hosting | Vercel (Hobby plan) |
| Git | GitHub, branch `main` is production |

---

## Local dev

```bash
git clone https://github.com/jsteelberg716/ryzn-rise.git
cd ryzn-rise
npm install
npm run dev      # http://localhost:8080
```

In a Claude Code session with the preview tooling: `preview_start("ryzn-dev")`.

No `.env` is required — there are no API keys or backend secrets in this repo. (The iOS app's Supabase / AI proxy lives in a separate codebase.)

---

## Deploy flow

```
git push origin main  →  Vercel webhook  →  build  →  ryzn-rise.vercel.app
```

- Push to `main` is the only way to deploy. There is no staging branch.
- Vercel rebuilds in ~60–90 seconds.
- Vercel dashboard: https://vercel.com/ → ryzn-rise → Deployments

### Git author config

Commits **must** be authored by the GitHub account that owns the Vercel project, otherwise Vercel may skip the deploy. Set in this repo:

```bash
git config user.name "Jack Steelberg"
git config user.email "jackwork716@gmail.com"
```

If a commit ends up with the wrong author (e.g. a system default), amending it usually won't trigger a new deploy — push an empty commit with the correct author instead:

```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push
```

---

## The private-repo gotcha (IMPORTANT)

Vercel Hobby plan does **not** reliably auto-deploy from private GitHub repos, even when the GitHub→Vercel link is set up. Symptoms: `git push` succeeds, latest commit appears on `main`, but the Vercel "Deployments" tab still shows the previous build from hours ago.

**Diagnosis:** anonymous GET to the GitHub repo URL — 404 means private, 200 means public:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://github.com/jsteelberg716/ryzn-rise
```

**Fix (one-time, what we did 2026-05-06):** GitHub → repo → Settings → Danger Zone → Change visibility → Make public. The repo contains no secrets (verified) and the live site already discloses everything it would expose.

**Alternative fixes** if keeping it private is required:
- Upgrade Vercel to Pro ($20/mo)
- Trigger deploys manually: Vercel dashboard → ryzn-rise → Deployments → "Redeploy" on latest commit

Don't waste time amending or re-pushing the same commit when this happens — the commit is fine, the link is the issue.

---

## File map — where to edit what

```
src/
  pages/
    Index.tsx            ← home page composition (renders all landing sections)
    Privacy.tsx          ← privacy policy (19 sections)
    Validation.tsx       ← validation study page (Recharts, published research citations)
    Analytics.tsx        ← analytics page
    NotFound.tsx         ← 404
  components/
    landing/
      Navbar.tsx
      Hero.tsx                    ← "Log smarter. Lift heavier." hero
      ProblemSection.tsx          ← "Physics-based, not heart-rate proxy" tagline
      CalorieEngine.tsx           ← three worked-example cards (Heavy / Hypertrophy / Moderate)
      CalorieLoggingSection.tsx   ← VideoPhoneMock (loops public/video/fuel-demo.mp4)
      PhoneMockup.tsx             ← phone with muscle-map
      WorkoutPrograms.tsx         ← workout splits carousel (flip cards)
      Pricing.tsx                 ← Pro tier + Coach tier (TBA)
      ShareCards.tsx              ← stacked card with Instagram/iMessage/TikTok pills
      FAQ.tsx
      Footer.tsx
    RyznWordLogo.tsx
  index.css              ← design tokens (DMD depth system, accent green)
  lib/animations.ts      ← shared Framer Motion variants
public/
  icons/                 ← instagram.png, imessage.png, tiktok.png (ShareCards)
  video/fuel-demo.mp4    ← looping demo for CalorieLoggingSection
  share-card-green.jpg
```

### Design tokens

- Accent: mint green `#22c55e` / `hsl(145 72% 50%)` — used as `hsl(var(--accent-green))`
- Background: DMD midnight `rgb(29, 29, 32)`
- Depth utilities: `.dmd-convex`, `.dmd-concave` — defined in `src/index.css`
- No emojis in any copy

---

## Editorial / claims policy

- Never claim the calorie engine is "validated within X% of lab calorimetry" — formal validation is in progress, not complete. Use **"physics-based"** or **"first-principles"** framing instead.
- Wearable error stats must be cited (Stanford 2017 / npj Digital Medicine 2025 are the current sources).
- Patent number USPTO #64/021,144 is public and OK to display.
- "Coming soon" badges are OK; do not promise dates.

---

## Verification before pushing

Before `git push`, always:

1. `npm run dev` (or `preview_start("ryzn-dev")`) and visually verify the change in the browser.
2. Check the browser console for runtime errors.
3. Check the Vite terminal for build/type errors.
4. After push: watch Vercel Deployments, then load the live URL and confirm the new content is rendered.

For a Claude Code session: `preview_screenshot` after the change and before committing is the cheapest way to catch layout regressions.

---

## Roadmap — dynamic content from the iOS app

Planned future direction (not yet built): the iOS app generates user-facing artifacts (reviews, testimonials, sharable highlights) that should appear live on this marketing site without a manual redeploy.

Likely architecture:
- **Source of truth:** the existing Supabase instance the iOS app already uses.
- **Site fetch path:** add a `Reviews` component that does a client-side fetch to a public, read-only Supabase view at page load (no auth, RLS allows `select` on a curated view only).
- **Optional:** ISR-like revalidation via a Vercel webhook — the iOS app pings `/api/revalidate?secret=…` after a new review lands, Vercel rebuilds the page on-demand.
- **Fallback:** plain client fetch with stale-while-revalidate semantics. Cheaper, no auth required.

Things to nail down before building:
- Which Supabase view exposes reviews safely (no PII).
- Moderation: is a review auto-published or human-approved before it's visible here?
- Display structure: rolling list, top-N, infinite scroll?
- Caching: how stale can the marketing site be? (Probably <5 min is fine.)

When this work starts, create a `feature/reviews` branch and prototype against the Supabase project before merging to `main`.

---

## Quick reference

| Task | Command |
|---|---|
| Run locally | `npm run dev` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |
| Trigger a manual redeploy | `git commit --allow-empty -m "redeploy" && git push` |
| Check repo visibility | `curl -s -o /dev/null -w "%{http_code}\n" https://github.com/jsteelberg716/ryzn-rise` |

Last updated: 2026-05-06.
