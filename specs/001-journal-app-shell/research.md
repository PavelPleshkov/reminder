# Research: Journal & App Shell (Feature 001)

**Date**: 2026-05-22  
**Status**: Complete — no blocking `NEEDS CLARIFICATION` items

## 1. Monorepo layout (Yarn 1 Classic workspaces)

**Decision**: Root `package.json` with `"private": true`, `"workspaces": ["apps/*", "packages/*"]`, Yarn 1.x as package manager.

**Rationale**: Matches user-mandated structure; `packages/shared` is consumed by `apps/frontend` via `"@reminder/shared": "1.0.0"` workspace protocol. `apps/api` contains only README in 001.

**Alternatives considered**:
- **npm/pnpm workspaces** — rejected; user specified Yarn 1 Classic.
- **Single package** — rejected; future API must share Zod/types without copy-paste.

## 2. Local persistence (IndexedDB + Dexie)

**Decision**: Dexie 4.x with three logical areas: `journalEntries`, `trashEntries`, `meta` (key-value for `hasSeeded`).

**Rationale**: Spec requires refresh persistence (edge case), trash retention without UI, and hundreds of entries (SC-007). Dexie provides schema versioning (`db.version(1).stores(...)`) and Promise-based API vs callback-heavy raw IDB.

**Alternatives considered**:
- **localStorage** — rejected; size limits, no indexed queries, poor fit for entry lists.
- **SQLite WASM** — rejected; heavy dependency, violates bare-minimum constitution.
- **Separate `pendingReminders` table** — rejected for 001; derived state avoids sync bugs (see plan Architecture).

## 3. Form state and validation

**Decision**: Controlled React state in `EntryForm` / `WorkEditor`; validate with Zod schemas from `@reminder/shared` on Save via `safeParse`; map issues to inline English errors.

**Rationale**: Constitution I (minimal deps). Dynamic list of works (add/remove/reorder) is straightforward with `useState`. React Hook Form adds bundle and learning cost without mandatory benefit for MVP.

**Alternatives considered**:
- **React Hook Form + `@hookform/resolvers/zod`** — rejected unless form complexity grows in later features.
- **Uncontrolled forms + manual DOM read** — rejected; harder to test and violates React patterns.

## 4. Styling

**Decision**: CSS Modules per feature (`*.module.css`) + global `variables.css` for design tokens.

**Rationale**: FR-001 gradient header and two-column Journal do not require a component library. CSS Modules give local scope without runtime CSS-in-JS cost.

**Alternatives considered**:
- **Tailwind / MUI / Chakra** — rejected for 001 scope and constitution.

## 5. Routing

**Decision**: React Router 7.x (or latest 6.x compatible with React 19) with nested layout route for shell.

**Rationale**: FR-001–FR-002 and multiple placeholder sections need stable URLs and browser back/forward.

**Alternatives considered**:
- **State-only view switching** — rejected; poor deep-linking and testability.

## 6. Jest + Vite + TypeScript integration

**Decision**:
- **Vite** for dev (`vite`) and production build (`vite build`).
- **Jest** with `ts-jest` (or `babel-jest` + TS — prefer `ts-jest` for alignment with strict TS).
- `moduleNameMapper`: `'^@/(.*)$' -> '<rootDir>/src/$1'`, `'^@reminder/shared$' -> '<rootDir>/../../packages/shared/src/index.ts'`.
- `setupFilesAfterEnv`: `@testing-library/jest-dom`, `fake-indexeddb/auto`.
- Test co-located under `src/__tests__/` or `*.test.tsx` next to features.

**Rationale**: Constitution II requires automated P1 tests. Vite does not run Jest natively; dual config is standard and documented in plan/quickstart.

**Alternatives considered**:
- **Vitest** — viable with Vite but user explicitly requested Jest; avoids retooling test docs mid-feature.
- **Playwright only** — insufficient for unit-level validation logic; optional smoke later.

## 7. Repository pattern placement

**Decision**: `JournalRepository` interface in `packages/shared/src/repositories/JournalRepository.ts`; `DexieJournalRepository` in `apps/frontend/src/data/repositories/`.

**Rationale**: Future `ApiJournalRepository` in `apps/api` imports same interface and types. Frontend remains the only runtime implementation in 001.

**Alternatives considered**:
- **Interface only in frontend** — rejected; API would duplicate contract later.

## 8. Reminders badge without Reminders UI

**Decision**: Pure function `countPendingReminderWorks(entries: JournalEntry[]): number` in `domain/pendingReminders.ts`; shell reads active entries on menu render (or lightweight context refreshed after Journal save/delete).

**Rationale**: FR-011 and US6 without building list UI. Eligibility rules encoded once and unit-tested.

**Alternatives considered**:
- **Persist pending table updated on every save** — rejected; duplication and drift risk.

## 9. Demonstration seed (FR-016)

**Decision**: Static builder `demoJournalSeed.ts` returning five typed entries; invoked from app bootstrap when `isStorageEmpty() && !hasSeeded`.

**Rationale**: Product rules table in spec is explicit; static data is testable and deterministic (SC-008).

**Alternatives considered**:
- **Randomized seed** — rejected; breaks acceptance tests and demo repeatability.

## 10. ESLint + Prettier

**Decision**: Root ESLint flat config (or `.eslintrc.cjs`) extending `eslint:recommended`, `@typescript-eslint`, `eslint-plugin-react-hooks`; Prettier as formatter; `eslint-config-prettier` to avoid conflicts.

**Rationale**: Constitution workflow quality; standard for TS monorepos.

**Alternatives considered**: None required for MVP beyond defaults.
