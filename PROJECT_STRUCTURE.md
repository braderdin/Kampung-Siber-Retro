# 🗺️ KAMPUNG SIBER RETRO — ABSOLUTE PROJECT STRUCTURE BLUEPRINT

> **Platform:** Kampung Siber Retro-Modern — Komuniti pembinaan laman web peribadi (Neocities-style) berteraskan **Next.js 15/16 App Router (Turbopack)**, **Supabase Auth (PKCE)**, **Cloudflare R2 (WebP 80–85%)**, dan **4-Tier Cyber-Siber Cookie Architecture**.
>
> **Generated:** 2026-07-14 | **Architecture Standard:** `.clinerules` 16 Elite Tiers (Rule 7, Rule 13, Rule 15).
> **Stack Pinned:** `next@16.2.10`, `react@19.2.4`, `typescript@5`, `tailwindcss@4`, `zustand@5`, `framer-motion@12`, `@supabase/supabase-js@2.110`.

---

## 0. MCP ECOSYSTEM HEALTH MATRIX (Phase 1 Diagnostic)

| MCP Server | Status | Evidence / Boundary Note |
|------------|--------|--------------------------|
| `filesystem` | ✅ GREEN | `list_allowed_directories` → `/home/braderdin/kampung-siber-retro` (read/write OK under WSL). |
| `postgres` | ❌ RED — `ENETUNREACH` | IPv6 connect failure `2406:da18:...:5432`. Supabase DB URL resolves to unreachable IPv6 hop. **ACTION:** Force IPv4 (`?sslmode=require` + disable IPv6) or whitelist WSL egress. |
| `github` | ✅ GREEN | `search_repositories` → `braderdin/Kampung-Siber-Retro` (1 match, public). Rate-limit window healthy. |
| `puppeteer` | ✅ GREEN (headless) | Browser launch OK with `headless:true --no-sandbox --disable-gpu`. Raw X11 launch fails (no `$DISPLAY`) — expected on WSL headless. Connection-refused on `:3000` = no dev server (not a browser fault). |
| `cloudflare` | ⚠️ NOT REGISTERED | **No `cloudflare` MCP server in runtime workspace.** Cannot verify "solid green" claim — server absent from connected MCP list. **ACTION:** Add `npx -y @modelcontextprotocol/server-cloudflare` (or `wrangler` bridge) to MCP config. |

**Diagnostic Verdict:** 3/4 registered servers healthy. `postgres` hard-down (network layer), `cloudflare` unregistered (config gap).

---

## 1. ROOT DIRECTORY — CONFIG & GOVERNANCE FILES

```
kampung-siber-retro/
├── .clinerules                  # 16 Elite Tier execution protocol (master ruleset for Cline agent).
├── .clineignore                 # WSL-safe ignore list: node_modules, .next, lockfiles, *.log, .env.*.
├── .geminiignore                # Gemini ingestion exclusion map (mirrors .clineignore).
├── .gitignore                   # Git VCS exclusion (build artifacts, secrets, caches).
├── AGENTS.md                    # Hybrid agent config: Llama-3.3-70b planner + Poolside Laguna execution.
├── CLAUDE.md                    # Anthropic Claude agent operating instructions for this repo.
├── GEMINI.md                    # Google Gemini agent context + defect-reporting contract.
├── config.yaml                  # Runtime/config YAML (agent + infra tuning values).
├── package.json                 # Dependency manifest (Next 16, React 19, Supabase, AWS S3 SDK, Zustand).
├── package-lock.json           # 🔒 Determinism lockfile (pinned transitive graph, git-ignored locally).
├── next.config.ts              # Next.js config: Turbopack root, standalone output, legacy path redirects.
├── tsconfig.json               # Strict TS: ES2017, bundler resolution, `@/*` → `./src/*` path alias.
├── next-env.d.ts               # Next.js generated ambient type declarations (do not edit).
├── tsconfig.tsbuildinfo        # 🔒 Incremental TS build cache (git-ignored).
├── postcss.config.mjs          # Tailwind v4 PostCSS pipeline (`@tailwindcss/postcss`).
├── eslint.config.mjs           # ESLint 9 flat config (eslint-config-next 16).
├── README.md                   # Public project overview & onboarding doc.
├── LICENSE.txt                 # 🔒 License text (ignored from context by .clineignore).
├── INFRA_PATCH_REPORT.md       # Historical infrastructure patching audit log.
├── MCP_VALIDATION_REPORT.md    # Prior MCP connectivity validation snapshot.
├── WSL_INTEGRATION_REPORT.md   # WSL/Cloudflare wrangler path-boundary resolution log.
├── PROJECT_STATE_MAP.md        # Live project state tracking document.
├── PROJECT_UPGRADE_MAP.md      # Feature upgrade roadmap & mapping.
├── PAGES_UPGRADE_BluePrint.md  # Page-level upgrade blueprint (per-route plan).
└── PROJECT_STRUCTURE.md        # ← THIS FILE (generated 2026-07-14).
```

**Root config semantics:**
- `next.config.ts` enforces `output: 'standalone'` (container-ready) and 3 permanent redirects: `/balai_raya→/town-hall`, `/kedai_runcit→/asset-store`, `/muzium→/cyber-museum`.
- `tsconfig.json` is `strict: true` with `@/*` alias — all imports use `@/components`, `@/lib`, `@/utils`.
- `.clinerules` Rule 7 mandates App Router + Turbopack; Rule 15 mandates the 4-tier cookie model; Rule 13 mandates defect teardown.

---

## 2. `src/` — APPLICATION CORE

```
src/
├── app/                  # Next.js 15/16 App Router (all routes, layouts, API handlers)
├── components/           # 140+ feature & UI components (client/server mixed)
├── components/ui/        # Premium brand UI primitives (Neon design system)
├── hooks/                # Custom React hooks (debounce, autosave, network, terminal)
├── store/                # Zustand global state stores
├── types/                # Shared TypeScript type/interface declarations
├── utils/                # Pure utility functions (sanitize, WebP convert)
├── i18n/                 # Internationalization dictionary loader
├── styles/               # Global retro CSS layers
└── lib/                  # Core data/session helpers (Supabase clients, cookies, dict)
```

---

## 3. `src/app/` — ROUTE & LAYOUT MAP

### 3.1 Root Shell
| File | Role |
|------|------|
| `layout.tsx` | Root layout. Implements **Cookie Strategy 1 (Anti-FOUC)**: reads `kampung-siber-theme-cookie` server-side pre-hydration, paints `data-theme` + `dark` class, injects inline theme-hydration `<script>`. Mounts `RetroNavbar` + `RetroFooter` app shell. |
| `layout_backup.tsx` | Archived prior layout snapshot (fallback reference, not active). |
| `page.tsx` | Landing page (root route). Retro-modern hero, sign-up card, interactive backgrounds. |
| `globals.css` | Tailwind v4 + global token layer (CSS variables, neon accents). |

### 3.2 Public & Community Routes
```
src/app/
├── about/               # Static about/mission page.
├── activity/            # Live resident activity feed (FollowActivityFeed, LiveActivityFeed).
├── admin/               # Admin control surface (maintenance toggle, reports).
├── arcade/              # Retro gaming zone (Pong engine, minigames, leaderboards).
├── asset-store/         # (Modern) marketplace / kedai_runcit replacement (download tracker, products).
├── audit-log/           # Admin audit trail viewer.
├── auth/                # Supabase PKCE auth callback/handler routes.
├── balai_raya/          # LEGACY redirect target → /town-hall (kept for SEO).
├── bbs-room/            # Bulletin Board System chat rooms (BbsChatRoom, chat input, user list).
├── browse/              # Site discovery / directory browsing.
├── bulletin/            # Community bulletins (CommunityBulletin, BBSBulletinBoard).
├── cli/                 # Web CLI terminal emulator (RetroTerminalLayout/Widget).
├── contact/             # Contact form + support routing.
├── cyber-cafe/          # Ambient social lounge (audio, radio, presence grid).
├── cyber-museum/        # (Modern) museum/muzium replacement (exhibits, archive).
├── dashboard/           # Authed user dashboard (profile banner, sidebar, quotes).
├── directory/           # Full resident/site directory listing.
├── docs/                # Documentation hub.
├── donate/              # Donation/supporter flow.
├── forgot_username/     # Account recovery (username lookup).
├── guestbook/           # Retro guestbook (GuestbookComponent, moderator controls).
├── help/                # Help center widget surface.
├── hub/                 # Central community hub landing.
├── kedai_runcit/        # LEGACY redirect → /asset-store.
├── map/                 # Interactive community map.
├── muzium/              # LEGACY redirect → /cyber-museum.
├── password_reset/      # Supabase password reset flow.
├── press/               # Press / media kit.
├── privacy/             # Privacy policy (static legal).
├── search/              # Global search interface.
├── settings/            # User settings (profile, password change, custom CSS, domain).
├── signin/              # Sign-in page (Supabase Auth UI wrapper).
├── site/                # Per-resident site renderer (Neocities-style sub-pages).
├── site_files/          # Static site file manager surface.
├── sitemap/             # Dynamic sitemap route.
├── status/              # Platform status page.
├── supporter/           # Supporter tier management.
├── terms/               # Terms of service (static legal).
├── themes/              # Theme gallery / switcher (space-neon, windows-gray, retro-matrix).
├── town-hall/           # (Modern) balai_raya replacement — announcements & town square.
└── tutorials/           # Tutorial / learning content.
```

### 3.3 `src/app/api/` — Route Handlers
```
src/app/api/
├── admin/        # Admin-only REST handlers (moderation, config).
├── analytics/    # Usage analytics ingestion/query endpoints.
├── arcade/       # Arcade score submission & leaderboard API.
├── assets/       # R2 asset upload/presign/serve (WebP pipeline hook).
├── bulletin/     # Bulletin CRUD API.
├── chat/         # BBS / realtime chat message handlers.
├── cron/         # Scheduled job triggers (maintenance, counters).
├── editor/       # Site editor autosave / publish handlers.
├── guestbook/    # Guestbook entry API.
├── report/       # User-report submission endpoint.
├── storage/      # Storage quota / R2 proxy (25MB acct / 2MB file caps enforced).
├── users/        # User profile read/write API.
└── webring/      # Classic webring navigation API.
```

---

## 4. `src/components/ui/` — PREMIUM NEON PRIMITIVES

| File | Role |
|------|------|
| `NeonButton.tsx` | Brand CTA primitive. 4 variants (`primary`=cyan, `secondary`=magenta, `ghost`, `danger`), 3 sizes, neon glow shadow on hover. `"use client"`. |
| `NeonCard.tsx` | Neon-bordered content card with glow halo; base surface for dashboards/bento. |
| `NeonInput.tsx` | Themed text input with cyan/magenta focus aura; accessible label wrapper. |
| `TabRail.tsx` | Vertical navigation rail for tabbed experiences (`RailTab[]`, `active`, `onChange`). `"use client"`. |
| `BentoGrid.tsx` | Responsive bento-grid layout primitive for asymmetric premium dashboards. |
| `footer-layout.tsx` | Shared footer layout wrapper (consistent across routes). |
| `navigation-bar.tsx` | Shared navbar layout primitive (used by `RetroNavbar`). |
| `Win95DialogEmptyState.tsx` | Windows-95 styled empty-state dialog (nostalgic error/empty placeholder). |

---

## 5. `src/components/` — FEATURE COMPONENTS (140+, representative set)

> Full list exceeds 140 files. Key clusters:

- **Navigation / Shell:** `RetroNavbar`, `RetroFooter`, `DashboardSidebar`, `QuickLinksSidebar`, `FooterUtilityMenu`.
- **Auth / Profile:** `CyberICCard`, `CyberIcPrintFrame`, `ProfileCardExporter`, `ProfileBioEditor`, `ProfileUpdateBox`, `ProfileStatusBadge`, `DrizzleProfileCard`, `DashboardProfileBanner`.
- **Cookie Strategy 3 (Drafts):** `DraftRecoveryModal`, `DraftSyncIndicator`, `HydrationGuard`.
- **Cookie Strategy 2 (UI State):** `CrtThemeController`, `LanguageSwitcher`, `LanguageToggleSwitch`, `KeyboardShortcutOverlay`.
- **Community / Social:** `GuestbookComponent`, `BbsChatRoom`, `CommunityBulletin`, `FollowActivityFeed`, `LivePresenceGrid`, `ResidentLinkCollection`.
- **Arcade / Retro FX:** `PongGameEngine`, `ArcadeGame`, `ArcadeMinigame`, `PixelGameCanvas`, `MatrixRainingEffect`, `PixelCursorEffect`, `RetroMarqueeTicker`, `RetroHitCounter`.
- **Media / Audio:** `RadioKampung`, `GlobalAudioToggle`, `GlobalVolumeSlider`, `ArcadeSoundSynthesizer`, `MidiMusicController`, `MircChimeSynthesizer`.
- **Assets / Storage (R2):** `FileManager`, `FileManagerGrid`, `FileManagerList`, `AssetUploadZone`, `ImgurAssetBridge`, `WebpConverter` (via utils), `AssetManagerModal`, `AssetRatingStars`.
- **Commerce:** `ProductCard`, `DonateWindow`, `MarketplaceDownloadTracker`, `CustomDomainSetupForm`.
- **Utility / UX:** `BackToTopButton`, `LoadingSkeleton`, `NotificationCenter`, `RetroToast`, `HumanFeedbackToast`, `MaintenanceBanner`, `PageTransitionOverlay`, `AccessibilityMenu`.

---

## 6. `src/lib/` — CORE DATA & SESSION HELPERS

| File | Role |
|------|------|
| `supabase.ts` | **Client Supabase client** (PKCE, browser). Hardened 7-day session storage adapter (`SESSION_MAX_AGE_SECONDS = 604800`), memory fallback, `kampung-siber-auth` key. Rule 31 brand auth. |
| `supabase-server.ts` | **Server Supabase client** for Route Handlers. Service-role key with anon fallback, `persistSession:false`. 7-day TTL parity. |
| `cookies.ts` | **Cookie Strategy engine** (Rule 15). Dependency-free `setCookie/getCookie/removeCookie` with safe encode/decode; default 7-day `max-age`; drives theme/sidebar/draft/blocked-tag tiers. |
| `dictionary.ts` | Central term dictionary (BM formal vocabulary enforcement per Rule 5). |
| `i18n` loader ref → `src/i18n/dictionaries.ts` | Locale dictionary switch. |
| `founderStarterKit.ts` | Founder onboarding kit data/helpers. |
| `profile-types.ts` | Shared profile/type shapes used across client + server. |

---

## 7. SUPPORTING MODULES

```
src/hooks/
├── useDebounce.ts                 # Debounce hook (input/search throttle).
├── useEditorAutosave.ts           # Editor autosave (Cookie Strategy 3 draft buffer).
├── useNetworkSpeedTracker.ts      # Client network speed sampling.
└── useTerminalCommandHistory.ts   # CLI history stack for web terminal.

src/store/                         # Zustand global state
├── useEditorStore.ts              # Editor document/selection state.
├── useLanguageStore.ts            # Active i18n language state.
├── useProfilesStore.ts            # Cached resident profile state.
└── useThemeStore.ts               # Active theme state (mirrors cookie Strategy 1).

src/types/                         # Shared TS interfaces
├── arcade.ts                      # Arcade score/game types.
├── cyberIC.ts                     # Cyber-IC card schema.
├── editor.ts                      # Editor document model.
├── fileManager.ts                 # File manager entity types.
├── html2canvas.d.ts               # Ambient module decl for html2canvas.
├── journal.ts                     # Journal entry types.
├── links.ts                       # Resident link-collection types.
└── shoutbox.ts                    # Shoutbox/chat message types.

src/utils/
├── sanitizeHtmlPayload.ts         # XSS-safe HTML sanitizer for user content.
└── webpConverter.ts               # **Rule 14 engine**: converts/uploads images to WebP @80–85%, enforces 2MB/file & 25MB/acct caps.

src/i18n/
└── dictionaries.ts                # BM/EN dictionary map loader.

src/styles/
└── retro.css                      # Hand-authored retro visual layer (CRT, scanlines, neon).

public/                            # Static assets (SVG logos: file.svg, globe.svg, next.svg, vercel.svg, window.svg).

supabase/
└── migrations/                    # SQL migration scripts for Supabase schema.
```

---

## 8. BRAND & COMPLIANCE ANCHORS

- **Dark-first canvas:** `#060814` / `#0e1330` with neon accents — Cyber Neon Cyan `#00ffff`, Synthwave Magenta `#ff007f`, Retro Volt Green `#aaff00`.
- **4-Tier Cookie Architecture (Rule 15):**
  1. `kampung-siber-theme-cookie` → Anti-FOUC (read pre-hydration in `layout.tsx`).
  2. `sidebar_state` → 7-day UI memory.
  3. Local draft buffer → `DraftRecoveryModal` on reload (zero-DB bloat).
  4. `siber_blocked_tags` → JSON filter array for content hydration.
- **Storage limits (Rule 14):** 25 MB/account total, 2 MB/file max, WebP 80–85% deterministic.
- **500-line ceiling (Rule 8):** No single component exceeds 500 LOC; oversize logic broken into `src/components/ui` sub-primitives.

---

## 9. EXTERNAL LLM (GEMINI) QUICK-READ SUMMARY

> Kampung Siber Retro is a **Next.js 16 (App Router + Turbopack)** community platform. Auth = **Supabase PKCE** (`src/lib/supabase.ts` client, `supabase-server.ts` server). Storage = **Cloudflare R2** via `src/app/api/assets` + `src/utils/webpConverter.ts` (WebP 80–85%, 2 MB/file, 25 MB/acct). State = **Zustand** (`src/store`) + **4-tier cookie** model (`src/lib/cookies.ts`, enforced in `src/app/layout.tsx`). UI = **Neon primitives** (`src/components/ui`). Routes = 45+ pages under `src/app` + 13 API route groups under `src/app/api`. MCP health: filesystem ✅, github ✅, puppeteer ✅(headless), postgres ❌(ENETUNREACH IPv6), cloudflare ⚠️(not registered).