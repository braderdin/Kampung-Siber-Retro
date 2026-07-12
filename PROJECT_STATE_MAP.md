# PROJECT STATE MAP — Kampung Siber Retro

> **Sync Document for External Architect AI (Gemini)**
> Generated: 2026-07-13 (Asia/Kuala_Lumpur)
> Workspace: `c:\Users\brade\Videos\Github_Braderdin_VsCode\kampung-siber-retro`
> Repo: `https://github.com/braderdin/Kampung-Siber-Retro.git` (commit `c755dd7`)

---

## 1. Project Core Tech Stack

| Layer | Technology | Version / Notes |
|-------|-----------|-----------------|
| Framework | **Next.js (App Router)** | `16.2.10` (supersedes the `.clinerules` "Next.js 15" guidance; modern App Router under `src/app/`) |
| Runtime / UI | **React + React DOM** | `19.2.4` (Server + Client Components hybrid) |
| Language | **TypeScript** | `^5` (strict typed `.ts` / `.tsx` ecosystem mandated) |
| Styling Engine | **Tailwind CSS v4** via `@tailwindcss/postcss` | `^4` + `tailwind-merge` `^3.6`, `clsx` `^2.1` |
| Theme/CSS | Global `globals.css` + `src/styles/retro.css` | Custom retro/CRT theme system |
| Backend DB | **Supabase (PostgreSQL)** | `@supabase/supabase-js` `^2.110.0` |
| Auth | **Supabase Auth** (client-based) | `src/app/auth/callback/route.ts`, `signin`, `password_reset`, `forgot_username` pages |
| Cache / Counters | **Upstash Redis** | `@upstash/redis` `^1.31.0` (hit counters, rate limiting) |
| Object Storage | **AWS S3 SDK** | `@aws-sdk/client-s3` `^3.1079`, `@aws-sdk/s3-request-presigner` (asset/file storage) |
| State Management | **Zustand** | `^5.0.14` (editor, language, profiles, theme stores) |
| Animation | **Framer Motion** | `^12.42.2` |
| Code Editor | **CodeMirror 6** | `@uiw/react-codemirror` `^4.25.10`, lang packs (HTML/CSS/JS), VSCode theme |
| Icons | **lucide-react** | `^1.23.0` |
| UI Primitives | **vaul** (Drawer) | `^1.1.2` |
| Lint | **ESLint 9** + `eslint-config-next` | `16.2.10` |

**Runtime config notes:**
- Supabase client is instantiated in `src/lib/supabase.ts` with env fallback to `https://placeholder.supabase.co` (requires `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_KEY` at deploy).
- i18n handled via `src/i18n/dictionaries.ts` (EN + MS) and `src/store/useLanguageStore.ts`.
- Build tooling: Turbopack-capable Next 16 (`next dev` / `next build`).

---

## 2. Complete Directory Architecture Tree

```
kampung-siber-retro/
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── config.yaml
├── public/                      # static svg assets (file, globe, next, vercel, window)
└── src/
    ├── app/                     # Next.js App Router (routing surface — see §4)
    │   ├── globals.css
    │   ├── layout.tsx           # root layout
    │   ├── layout_backup.tsx
    │   ├── page.tsx             # home (/)
    │   ├── about/ activity/ admin/moderation/ arcade/{retro-pong,retro-snake}/
    │   ├── asset-store/ audit-log/ balai_raya/ bbs-room/ browse/ bulletin/
    │   ├── cli/ contact/ cyber-cafe/ cyber-museum/ dashboard/ directory/
    │   ├── donate/ forgot_username/ guestbook/ help/ kedai_runcit/ map/
    │   ├── muzium/ password_reset/ press/ privacy/ search/ settings/
    │   ├── signin/ site/[username]/{journal,links,stats}/ sitemap/
    │   ├── site_files/{text_editor}/ status/ supporter/ terms/ themes/
    │   ├── town-hall/ tutorials/
    │   ├── api/                 # 17 route handlers (see §4)
    │   └── auth/callback/route.ts
    ├── components/              # 130+ UI components (retro/CRT widgets)
    │   ├── admin/   ReportModerationCard.tsx
    │   ├── audio/   AudioContextNativeGate.tsx
    │   ├── chat/    chat-command-handler.ts, MircChimeSynthesizer.tsx
    │   ├── editor/  EditorHtmlPreview.tsx, MediaEmbedHelper.tsx, page.tsx, PublishSiteButton.tsx
    │   ├── ui/      footer-layout.tsx, navigation-bar.tsx, Win95DialogEmptyState.tsx
    │   └── (root)   RetroNavbar, RetroFooter, RetroToolbar, GuestbookComponent,
    │                CommunityInteraction, ProfileUpdateBox, ArcadeGame, SnakeGameEngine,
    │                PongGameEngine, WinampPlayer, CodeMirrorEditor, SirenKampung,
    │                CyberMuseumArchive, ... (full list mapped via directory scan)
    ├── hooks/                  # useDebounce, useEditorAutosave, useNetworkSpeedTracker, useTerminalCommandHistory
    ├── i18n/                   # dictionaries.ts (EN/MS localization)
    ├── lib/                    # supabase.ts (client), dictionary.ts
    ├── store/                  # useEditorStore, useLanguageStore, useProfilesStore, useThemeStore (Zustand)
    ├── styles/                 # retro.css (global retro theme)
    ├── types/                  # arcade, cyberIC, editor, fileManager, journal, links, shoutbox (+ html2canvas.d.ts)
    └── utils/                  # sanitizeHtmlPayload.ts (XSS guard)
```

**Key asset locations outside `src/`:**
- `public/` — static brand/UI SVGs.
- Root config — `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `config.yaml`.
- Meta docs — `README.md`, `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`, `.clinerules`.

---

## 3. Database & Schema State

> Live Postgres introspection was blocked (`password authentication failed for user "postgres"`), so schema is reconstructed from **verified Supabase client calls in source**.

### 3.1 Active PostgreSQL Tables (Supabase)
| Table | Accessed From | Purpose |
|-------|--------------|---------|
| `profiles` | `forgot_username/page.tsx`, `api/cron/compile-stats` | User profiles, `username`, `email`, `visit_count`, id |
| `interactions` | `components/CommunityInteraction.tsx` | Likes / follows / comments on profiles |
| `replies` | `components/CommunityInteraction.tsx` | Nested replies (`parent_id`) |
| `guestbook_entries` | `components/GuestbookComponent.tsx`, `api/guestbook/delete` | Guestbook posts |
| `status_updates` | `components/ProfileUpdateBox.tsx` | User status/feed posts |
| `user_signups` | `components/SirenKampung.tsx` | Signup event tracking |
| `reports` | `api/admin/reports/resolve` | Moderation reports |
| `arcade_leaderboard` | `api/arcade/scores` | Game high scores (`username`, `game_id`, `high_score`, `achieved_at`) |
| `anonymous_notes` | `api/cron/cleanup` | Ephemeral notes (purged by cron) |
| `text_metrics` | `api/cron/cleanup` | Text-editor metrics (purged by cron) |

### 3.2 Storage & Cache Layers
- **Supabase Storage / AWS S3** — file/asset uploads via `api/storage/{upload,read,download}`, `asset-store`, `site_files`.
- **Upstash Redis** — visit/hit counters (`RedisHitCounter`, `VisitorHitCounter`, `RetroHitCounter` components) and likely rate limiting.

### 3.3 Schema Gaps / Observations
- No SQL migration files exist in repo (`**/*.sql` → 0 matches); schema is managed externally on Supabase.
- `api/bulletin/posts` is **in-memory mock data** (not DB-backed) — should be promoted to a `bulletin_posts` table.
- No generated Supabase `Database` type exists; queries use untyped `any`/`select('*')`.

---

## 4. Current Functional Routing Map

**Totals:** 46 page routes + 17 API route handlers = **63 route endpoints**.

### 4.1 Active & Verified Page Routes (built)
`/` (home), `/about`, `/activity`, `/admin/moderation`, `/arcade/retro-pong`, `/arcade/retro-snake`, `/asset-store`, `/audit-log`, `/balai_raya`, `/bbs-room`, `/browse`, `/bulletin`, `/cli`, `/contact`, `/cyber-cafe`, `/cyber-museum`, `/dashboard`, `/directory`, `/donate`, `/forgot_username`, `/guestbook`, `/kedai_runcit`, `/map`, `/muzium`, `/password_reset`, `/press`, `/privacy`, `/settings/username`, `/settings/[username]`, `/settings/[username]/custom-domain`, `/signin`, `/site/[username]`, `/site/[username]/journal`, `/site/[username]/links`, `/site/[username]/stats`, `/sitemap`, `/site_files`, `/site_files/text_editor`, `/status`, `/supporter`, `/terms`, `/themes`, `/town-hall`, `/tutorials`.

### 4.2 Active API Route Handlers (17)
- `api/admin/reports/resolve`
- `api/analytics/profile-views`
- `api/arcade/scores`
- `api/assets/download`
- `api/bulletin/posts` ⚠️ in-memory mock
- `api/chat/history`
- `api/cron/cleanup`
- `api/cron/compile-stats`
- `api/guestbook/delete`
- `api/report`
- `api/storage` / `api/storage/read` / `api/storage/upload`
- `api/webring` / `api/webring/next`
- `auth/callback` (OAuth)

### 4.3 Placeholder / Needs Upcoming Feature Patch
| Route | Issue Detected |
|-------|----------------|
| `/about` | `movementValues`, `systemStatuses`, `timelineEntries` are **empty arrays with `// TODO: Fetch dynamic metrics from API/Zustand store`** — static shell only |
| `/search` | `demoResults` is empty with `// TODO: Fetch dynamic search results` — no live query wired |
| `/help` | Copy states *"More retro games are coming soon!"* — only Brick Breaker referenced, arcade expansion pending |
| `api/bulletin/posts` | Serves hardcoded `samplePosts` in memory — not persisted to DB |

> All other routes render full component trees and are considered functionally complete pending live Supabase credential provisioning.

---

## 5. Current Active Configuration Rules (from `.clinerules` + `AGENTS.md`)

**Core enforcement constraints the build must obey:**
1. **Next.js App Router only** — all routes under `src/app/`; legacy config forbidden unless refactoring explicit legacy files.
2. **TypeScript / Next.js / Turbopack mandate** — no Python scripts or external text-replacement utilities for patching.
3. **500-line hard ceiling per file** — exceed → split into `src/components/` modular units.
4. **Full structural code output** — no lazy placeholders (`// ... rest of code`, `// insert logic here`); write complete blocks.
5. **Responsive UI/UX** — flawless adaptive layout across Mobile (e.g. 375×812) and Desktop (1920×1080).
6. **Visual validation protocol** — verify rendered state via `puppeteer` screenshots (dual-viewport) before marking complete; no clipping/overflow.
7. **Localization filter** — chat/interactions in proper **Bahasa Malaysia** (anti-Indonesian vocabulary); address user as "Chip Besar".
8. **Sequential one-file-at-a-time** execution; surgical edits — never delete/alter stable core logic without explicit confirmation.
9. **Token budget discipline** — context hot-swap trigger at 200K tokens; avoid recursive dumps > 30 lines; lean targeted lookups.
10. **MCP ecosystem** — `puppeteer` (visual), `postgres` (schema), `github` (issues) used natively.
11. **Git payload guard** — never run raw `git diff` / global `git status`; always target exact file path.
12. **AGENTS.md split-intelligence** — Planning (Llama-3.3-70b, ≤5-line blueprints) + Execution (Poolside Laguna-XS-2.1, full rewrites).

---

## 6. Next Phase Strategic Roadmap

### 6.1 Explicit Remaining Goals
- **Wire `/about` & `/search` dynamic data** — replace empty `TODO` arrays with live API/Zustand store fetches (profile metrics, search indexing).
- **Persist bulletin system** — migrate `api/bulletin/posts` from in-memory mock to a real `bulletin_posts` Supabase table + RLS.
- **Expand arcade** — add 2+ additional retro games beyond Brick Breaker/Pong/Snake (per `/help` "coming soon").
- **Provision live Supabase credentials** — replace `placeholder.supabase.co` fallback; add typed `Database` schema generation.
- **Add SQL migrations** — introduce `supabase/migrations/*.sql` for reproducible schema (currently externally managed, untracked).

### 6.2 Feature Implementation Backlog
- User profile edit/publish flow (`site_files/text_editor`, `editor/PublishSiteButton`) → connect to S3 + `profiles`.
- Webring federation (`api/webring`, `WebringFooter`) → cross-site link graph.
- Admin moderation hardening (`admin/ReportModerationCard`, `SecurityAuditTable`) → roles/RLS.
- Analytics dashboard (`api/analytics/profile-views`, `VisitorStatGraph`) → Redis + Postgres rollups.

### 6.3 UI / UX Refinement Targets
- Dual-viewport (mobile 375×812 / desktop 1920×1080) regression sweep across all 46 pages via `puppeteer`.
- CRT/retro theme polish (`CrtThemeController`, `InteractiveBackground`, `MatrixRainingEffect`) — ensure no overflow on small screens.
- i18n coverage audit — confirm all user-facing strings in `dictionaries.ts` have complete MS translations.
- Accessibility pass (`AccessibilityMenu`, `KeyboardShortcutOverlay`, `HydrationGuard`).

### 6.4 Known Risks
- Untyped Supabase queries increase runtime error surface; recommend generated types.
- 130+ components approaching the 500-line ceiling in aggregate — monitor for oversized files during next phase.
- Live DB unreachable from local tooling (auth failure) — validation currently source-static only.

---

*End of PROJECT STATE MAP — ready for Architect AI (Gemini) ingestion.*