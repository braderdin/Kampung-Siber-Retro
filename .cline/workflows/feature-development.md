# Workflow: Secure Feature Development
1. DB Schema Audit: Inspect target tables via postgres/redis MCP to verify row formats.
2. Core Logic Mapping: Draft Zustand localization stores strictly mapping to our BM/EN dictionary.
3. Component Isolation: Build UI elements inside `src/components/` ensuring zero contamination of configurations.
4. Build Validation: Run full TypeScript compilation audits before declaring completion.
