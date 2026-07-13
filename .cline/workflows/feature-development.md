# Feature Development Workflow (Kampung Siber Retro)

Standard sequence for delivering any new feature in this workspace.

## 1. DB Audit
- Inspect the active Supabase/Postgres schema surgically via the `postgres` MCP tool.
- Verify required tables, columns, and relationships before writing any data layer code.
- Flag missing migrations immediately; do not guess payload shapes.

## 2. Zustand Localization
- Implement state management using Zustand stores under `src/store/`.
- Bind all UI copy to the i18n layer in `src/i18n/` (Bahasa Malaysia / English).
- Keep store slices isolated and typed; no cross-store mutations.

## 3. UI Component Isolation
- Build features as isolated, responsive `.tsx` components under `src/components/`.
- Enforce the 500-line ceiling per file; split oversized modules immediately.
- Verify rendering on Mobile (375x812) and Desktop (1920x1080) viewports.

## 4. Build Validation
- Run `npx tsc --noEmit` for type safety.
- Run `npm run build` to confirm no broken core pathways.
- Execute `.cline/hooks/post-task.ps1` as the final quality gate.
