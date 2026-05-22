---
description: "Task list for Journal & App Shell (Feature 001)"
---

# Tasks: Journal & App Shell (Feature 001)

**Input**: Design documents from `/specs/001-journal-app-shell/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Jest 29 + RTL + `user-event` per plan test matrix (US1–US7); `fake-indexeddb` for `DexieJournalRepository` tests. No Playwright in 001 (constitution gate covered by automated matrix).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks in same phase)
- **[Story]**: User story label (US1–US7) on story-phase tasks only
- Every task includes concrete file path(s)

## Path Conventions

Yarn 1 workspaces monorepo per plan.md:

- `apps/frontend/src/` — SPA, Dexie, Journal UI, tests under `src/__tests__/`
- `packages/shared/src/` — types, Zod, categories, `JournalRepository` interface
- `apps/api/README.md` — stub only in 001

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo scaffold, tooling, and workspace wiring

- [ ] T001 Create root `package.json` with Yarn 1 workspaces `["apps/*", "packages/*"]` and scripts `test`, `lint`, `format` in `/Users/pavel/Personal/My_Projects/reminder/package.json`
- [ ] T002 [P] Add root `tsconfig.base.json` with strict TypeScript paths for `@reminder/shared` in `/Users/pavel/Personal/My_Projects/reminder/tsconfig.base.json`
- [ ] T003 [P] Add root `.eslintrc.cjs`, `.prettierrc`, and `eslint-config-prettier` integration in `/Users/pavel/Personal/My_Projects/reminder/.eslintrc.cjs` and `/Users/pavel/Personal/My_Projects/reminder/.prettierrc`
- [ ] T004 [P] Create `packages/shared/package.json` with name `@reminder/shared`, `zod` dependency, and `src/index.ts` barrel in `/Users/pavel/Personal/My_Projects/reminder/packages/shared/package.json`
- [ ] T005 [P] Create `apps/frontend/package.json` with React 19, Vite, Dexie, Jest, RTL, `fake-indexeddb`, and workspace dep `@reminder/shared` in `/Users/pavel/Personal/My_Projects/reminder/apps/frontend/package.json`
- [ ] T006 [P] Add `apps/api/README.md` stub describing future Express/Fastify + Prisma in `/Users/pavel/Personal/My_Projects/reminder/apps/api/README.md`
- [ ] T007 [P] Scaffold `apps/frontend/vite.config.ts` with `@vitejs/plugin-react`, path alias `@/` → `src/`, and `@reminder/shared` resolve in `/Users/pavel/Personal/My_Projects/reminder/apps/frontend/vite.config.ts`
- [ ] T008 [P] Scaffold `apps/frontend/tsconfig.json` extending root base and mirroring Vite paths in `/Users/pavel/Personal/My_Projects/reminder/apps/frontend/tsconfig.json`
- [ ] T009 [P] Scaffold `apps/frontend/jest.config.ts` with `ts-jest`, `jsdom`, `moduleNameMapper` matching Vite aliases in `/Users/pavel/Personal/My_Projects/reminder/apps/frontend/jest.config.ts`
- [ ] T010 [P] Add `apps/frontend/index.html` and `apps/frontend/src/main.tsx` bootstrapping React root in `/Users/pavel/Personal/My_Projects/reminder/apps/frontend/index.html` and `/Users/pavel/Personal/My_Projects/reminder/apps/frontend/src/main.tsx`
- [ ] T011 [P] Add global design tokens in `apps/frontend/src/styles/variables.css` in `/Users/pavel/Personal/My_Projects/reminder/apps/frontend/src/styles/variables.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared contracts, persistence layer, test harness, and app bootstrap — **must complete before user story phases**

**⚠️ CRITICAL**: No user story implementation until this phase checkpoint passes

- [ ] T012 [P] Implement `CategoryLabel` types and `FILTER_CATEGORIES` / `WORK_LABELS` in `packages/shared/src/constants/categories.ts` per FR-004
- [ ] T013 [P] Implement `Work` and `JournalEntry` TypeScript types in `packages/shared/src/types/journal.ts` aligned with data-model.md
- [ ] T014 [P] Implement `workSchema`, `journalEntrySchema`, and `categoryLabelSchema` in `packages/shared/src/schemas/journalSchemas.ts` per contracts/journal-schemas.md
- [ ] T015 [P] Export public API from `packages/shared/src/index.ts` (types, schemas, categories, repository interface)
- [ ] T016 [P] Define `JournalRepository` interface in `packages/shared/src/repositories/JournalRepository.ts` per contracts/JournalRepository.md
- [ ] T017 Implement Dexie schema v1 (`journalEntries`, `trashEntries`, `meta`) in `apps/frontend/src/data/db.ts`
- [ ] T018 Implement `DexieJournalRepository` with `listActive`, `getById`, `save`, `moveToTrash`, `countActive`, `isStorageEmpty`, `hasSeeded`, `markSeeded` in `apps/frontend/src/data/repositories/DexieJournalRepository.ts`
- [ ] T019 [P] Add Jest setup importing `@testing-library/jest-dom` and `fake-indexeddb/auto` in `apps/frontend/src/test/setup.ts`
- [ ] T020 [P] Add shared UI primitives `Button` and `ConfirmDialog` in `apps/frontend/src/shared/ui/Button.tsx` and `apps/frontend/src/shared/ui/ConfirmDialog.tsx`
- [ ] T021 [P] Implement `countPendingReminderWorks` in `apps/frontend/src/domain/pendingReminders.ts` per data-model.md derived rules
- [ ] T022 [P] Add English Zod error mapping in `apps/frontend/src/features/journal/validationMessages.ts` for SC-006
- [ ] T023 Wire `App.tsx` with repository instance, bootstrap hook, and seed guard entry point in `apps/frontend/src/App.tsx`
- [ ] T024 Create nested shell layout and route table in `apps/frontend/src/app/routes.tsx` and `apps/frontend/src/App.tsx` (paths: `/`, `/journal`, `/reminders`, placeholders)
- [ ] T025 [P] Add minimal shell styles in `apps/frontend/src/app/shell/shell.module.css` importing `variables.css`

**Checkpoint**: `yarn workspace @reminder/frontend test` runs (0 tests OK); Dexie + shared package compile; routes render shell + stubs

---

## Phase 3: User Story 1 — Create and save journal entry (Priority: P1) 🎯 MVP

**Goal**: User can create a journal entry with works, save to IndexedDB, see it in the list, cancel without persisting, and pending Mileage/Date works affect badge eligibility.

**Independent Test**: Open Journal, save valid entry with Engine work + Mileage criterion → entry in list with date, odometer, works, total cost; Cancel leaves list unchanged; badge reflects new pending work when applicable.

### Tests for User Story 1

> **NOTE: Write these tests FIRST; ensure they FAIL before implementation**

- [ ] T026 [P] [US1] Add RTL test for save, list update, cancel, and double-save guard in `apps/frontend/src/__tests__/journal.create.test.tsx` per plan test matrix

### Implementation for User Story 1

- [ ] T027 [P] [US1] Implement `WorkEditor` for work fields, label cloud, and criterion targets in `apps/frontend/src/features/journal/WorkEditor.tsx`
- [ ] T028 [P] [US1] Implement `EntryForm` with Cancel/Save, `isSaving` guard, and Zod parse via `@reminder/shared` in `apps/frontend/src/features/journal/EntryForm.tsx`
- [ ] T029 [US1] Implement `EntryList` row display with date/odometer header emphasis hooks in `apps/frontend/src/features/journal/EntryList.tsx`
- [ ] T030 [US1] Implement `JournalPage` two-column layout wiring form + list + repository in `apps/frontend/src/features/journal/JournalPage.tsx`
- [ ] T031 [P] [US1] Add Journal feature styles in `apps/frontend/src/features/journal/journal.module.css`
- [ ] T032 [US1] Connect Save/Cancel to `DexieJournalRepository.save` and draft reset in `apps/frontend/src/features/journal/EntryForm.tsx`
- [ ] T033 [US1] Recompute and persist `totalCost` on save per FR-007 in `apps/frontend/src/features/journal/EntryForm.tsx`
- [ ] T034 [US1] Insert new works at top of `works` array per FR-009 in `apps/frontend/src/features/journal/EntryForm.tsx`

**Checkpoint**: US1 tests pass; manual US1 quickstart item passes

---

## Phase 4: User Story 2 — Filter and sort journal entries (Priority: P1)

**Goal**: Category filter (incl. Brakes), default odometer desc sort, date-recent toggle, and reverse order with correct header emphasis.

**Independent Test**: With multi-entry data (fixtures or seed), Brakes filter shows only matching entries; date and reverse toggles reorder list and headers correctly.

### Tests for User Story 2

- [ ] T035 [P] [US2] Add RTL tests for Brakes filter, date sort, odometer default, reverse toggle, and 20+ entry fixture in `apps/frontend/src/__tests__/journal.filter-sort.test.tsx` (SC-003/SC-004)

### Implementation for User Story 2

- [ ] T036 [P] [US2] Implement `CategoryFilters` with fixed FR-004 list and All default in `apps/frontend/src/features/journal/CategoryFilters.tsx`
- [ ] T037 [US2] Implement client-side filter (entry included if any work has label) in `apps/frontend/src/features/journal/JournalPage.tsx`
- [ ] T038 [US2] Implement sort state (odometer desc default, date recent-first, reverse) and `orderBy` load strategy in `apps/frontend/src/features/journal/JournalPage.tsx` and `apps/frontend/src/data/repositories/DexieJournalRepository.ts`
- [ ] T039 [US2] Update `EntryList` header emphasis for date-first vs odometer-first per FR-005 in `apps/frontend/src/features/journal/EntryList.tsx`
- [ ] T040 [P] [US2] Add test fixture builder `apps/frontend/src/__tests__/fixtures/journalEntries.fixture.ts` for 20+ varied entries

**Checkpoint**: US2 tests pass; filter/sort verifiable on seed data

---

## Phase 5: User Story 3 — Validation on save (Priority: P1)

**Goal**: Clear English errors for invalid saves; no persistence on failure; General default when no label selected.

**Independent Test**: Attempt saves with 0 works, 101-char description, whitespace-only description, missing criterion targets, non-numeric odometer, negative cost — errors shown, storage unchanged.

### Tests for User Story 3

- [ ] T041 [P] [US3] Add RTL validation tests (101 chars, zero works, missing targets, whitespace, non-numeric odometer, negative cost) in `apps/frontend/src/__tests__/journal.validation.test.tsx`

### Implementation for User Story 3

- [ ] T042 [US3] Map Zod `path` issues to `validationMessages.ts` strings inline in `apps/frontend/src/features/journal/EntryForm.tsx`
- [ ] T043 [US3] Apply save-time normalization (trim, General default, strip irrelevant targets) before `save` in `apps/frontend/src/features/journal/EntryForm.tsx`
- [ ] T044 [US3] Block persist when `safeParse` fails in `apps/frontend/src/features/journal/EntryForm.tsx`

**Checkpoint**: US3 tests pass; SC-006 messages human-readable

---

## Phase 6: User Story 4 — Delete entry with confirmation (Priority: P1)

**Goal**: Confirmed delete soft-moves entry to trash; cancel leaves entry; trash retained without Trash UI.

**Independent Test**: Confirm delete removes from Journal list; cancel keeps entry; `trashEntries` contains deleted row (repository test).

### Tests for User Story 4

- [ ] T045 [P] [US4] Add RTL delete confirm/cancel tests in `apps/frontend/src/__tests__/journal.delete.test.tsx`
- [ ] T046 [P] [US4] Add `DexieJournalRepository.moveToTrash` unit tests with `fake-indexeddb` in `apps/frontend/src/__tests__/DexieJournalRepository.test.ts`

### Implementation for User Story 4

- [ ] T047 [US4] Wire entry Delete control to `ConfirmDialog` in `apps/frontend/src/features/journal/EntryList.tsx`
- [ ] T048 [US4] Implement `moveToTrash` with `deletedAt` and active-store removal in `apps/frontend/src/data/repositories/DexieJournalRepository.ts`
- [ ] T049 [US4] Refresh Journal list after successful delete in `apps/frontend/src/features/journal/JournalPage.tsx`

**Checkpoint**: US4 tests pass; deleted entries absent from `listActive`

---

## Phase 7: User Story 5 — App shell and section placeholders (Priority: P1)

**Goal**: Header, responsive menu, home tiles, Journal route, Reminders placeholder with badge, other section placeholders.

**Independent Test**: Navigate home → Journal (two columns); open Settings/FAQ/Trash/Categories/About placeholders; Reminders shows placeholder + badge equals pending count.

### Tests for User Story 5

- [ ] T050 [P] [US5] Add RTL shell navigation, placeholder routes, and badge tests in `apps/frontend/src/__tests__/shell.navigation.test.tsx` (SC-005)

### Implementation for User Story 5

- [ ] T051 [P] [US5] Implement gradient `Header` with title and menu control in `apps/frontend/src/app/shell/Header.tsx`
- [ ] T052 [P] [US5] Implement `SideMenu` desktop push vs mobile overlay close behavior in `apps/frontend/src/app/shell/SideMenu.tsx`
- [ ] T053 [P] [US5] Implement `HomePage` tiles for Journal, Reminders, Categories, About, FAQ, Trash, Settings in `apps/frontend/src/app/shell/HomePage.tsx`
- [ ] T054 [P] [US5] Implement `RemindersBadge` using `pendingReminders.ts` in `apps/frontend/src/app/shell/RemindersBadge.tsx`
- [ ] T055 [P] [US5] Implement generic `PlaceholderPage` in `apps/frontend/src/features/placeholders/PlaceholderPage.tsx`
- [ ] T056 [P] [US5] Implement `RemindersPlaceholder` copy per FR-011 in `apps/frontend/src/features/placeholders/RemindersPlaceholder.tsx`
- [ ] T057 [US5] Register all shell routes in `apps/frontend/src/app/routes.tsx` with shell `<Outlet />` layout
- [ ] T058 [US5] Refresh badge after Journal save/delete via shared refresh in `apps/frontend/src/App.tsx` and `apps/frontend/src/app/shell/RemindersBadge.tsx`

**Checkpoint**: US5 tests pass; FR-001–FR-002, FR-014 navigation satisfied

---

## Phase 8: User Story 6 — Next work criterion and pending reminders (Priority: P1)

**Goal**: Mileage/Date incomplete works count toward badge; On breakdown and done works excluded.

**Independent Test**: Save works with each criterion type; badge count matches `countPendingReminderWorks` only for eligible works.

### Tests for User Story 6

- [ ] T059 [P] [US6] Add unit tests for eligibility rules (Mileage, Date, on_breakdown, done flag) in `apps/frontend/src/__tests__/pendingReminders.test.ts`

### Implementation for User Story 6

- [ ] T060 [US6] Ensure `WorkEditor` criterion UI enforces target fields for Mileage/Date only in `apps/frontend/src/features/journal/WorkEditor.tsx`
- [ ] T061 [US6] Verify badge recomputation after save uses active entries only in `apps/frontend/src/domain/pendingReminders.ts` and `apps/frontend/src/app/shell/RemindersBadge.tsx`

**Checkpoint**: US6 tests pass; FR-010 satisfied

---

## Phase 9: User Story 7 — Demonstration data on first load (Priority: P1)

**Goal**: Exactly five seeded entries on empty storage once; varied works/criteria; filter/sort/badge demo; user can delete seed and add entries.

**Independent Test**: Empty IDB → open Journal → 5 entries with 1–4 works each; filter/sort work; delete one seed entry; add new entry; no reseed.

### Tests for User Story 7

- [ ] T062 [P] [US7] Add seed tests (5 entries, work counts, no double-seed, post-seed filter) in `apps/frontend/src/__tests__/seed.demo.test.ts` (SC-008)

### Implementation for User Story 7

- [ ] T063 [P] [US7] Implement `buildFiveEntries()` per FR-016 table in `apps/frontend/src/data/seed/demoJournalSeed.ts`
- [ ] T064 [US7] Run seed batch in App bootstrap when `isStorageEmpty() && !hasSeeded` then `markSeeded` in `apps/frontend/src/App.tsx`
- [ ] T065 [US7] Add subtle "Sample data" hint in `apps/frontend/src/features/journal/JournalPage.tsx`
- [ ] T066 [US7] Implement empty state copy "Create your first entry" when no active entries in `apps/frontend/src/features/journal/JournalPage.tsx` (FR-013)

**Checkpoint**: US7 tests pass; first-visit demo matches spec demonstration rules

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, entry-level toggles, responsive polish, CI scripts, quickstart validation

- [ ] T067 [P] Add entry-level toggle all works done/undone per FR-007 in `apps/frontend/src/features/journal/EntryList.tsx`
- [ ] T068 [P] Ensure keyboard focus and `<label>` associations on Journal form and shell menu in `apps/frontend/src/features/journal/EntryForm.tsx` and `apps/frontend/src/app/shell/SideMenu.tsx`
- [ ] T069 [P] Verify responsive Journal columns and mobile menu in `apps/frontend/src/features/journal/journal.module.css` and `apps/frontend/src/app/shell/shell.module.css` (SC-007 layout)
- [ ] T070 Wire root `yarn test` to `yarn workspaces run test` in `/Users/pavel/Personal/My_Projects/reminder/package.json`
- [ ] T071 [P] Wire root `yarn lint` and `yarn format` scripts delegating to workspaces in `/Users/pavel/Personal/My_Projects/reminder/package.json`
- [ ] T072 Run full P1 checklist in `specs/001-journal-app-shell/quickstart.md` and fix gaps

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends on | Blocks |
|-------|------------|--------|
| 1 Setup | — | Phase 2 |
| 2 Foundational | Phase 1 | All user stories (3–9) |
| 3–9 User stories | Phase 2 | Phase 10 |
| 10 Polish | Desired stories complete | — |

### User Story Dependencies

| Story | Depends on | Notes |
|-------|------------|-------|
| US1 | Foundational | MVP core; no other story required |
| US2 | US1 (Journal page + list) | Filter/sort on existing Journal UI |
| US3 | US1 (EntryForm) | Validation on same form |
| US4 | US1 (entries in list) | Delete control on list rows |
| US5 | Foundational routes | Can parallelize with US1 after T024; badge needs US6 logic (T021) |
| US6 | Foundational T021 | Tests in isolation; UI wired in US1/US5 |
| US7 | Foundational repo + US2 filter (for seed filter test) | Bootstrap in App; tests need empty DB |

**Recommended sequential order**: Setup → Foundational → **US1** → US2 → US3 → US4 → US6 → US5 → US7 → Polish

(US5 after US1 so Journal route is functional; US6 tests can run after T021; US7 last to avoid seed interfering with empty-state tests in earlier phases.)

### Within Each User Story

1. Tests first (fail)
2. Components / domain logic
3. Repository integration
4. Story checkpoint + quickstart item

### Parallel Opportunities

- **Phase 1**: T002–T011 marked [P] across separate files
- **Phase 2**: T012–T016, T019–T022 in parallel; T017→T018 sequential
- **Per story**: Test task + [P] component tasks where files differ
- **Cross-story** (after Foundational): US3 and US4 can proceed after US1; US6 `pendingReminders.test.ts` parallel to US2 if US1 done

---

## Parallel Example: User Story 1

```bash
# Tests + parallel components (after Foundational):
# T026 journal.create.test.tsx
# T027 WorkEditor.tsx || T028 EntryForm.tsx (coordinate shared props)
# T031 journal.module.css
```

## Parallel Example: User Story 4

```bash
# T045 journal.delete.test.tsx || T046 DexieJournalRepository.test.ts
# Then T047–T049 sequentially on EntryList / repository
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: User Story 1 (tests + implementation)  
4. **STOP and VALIDATE**: `yarn workspace @reminder/frontend test` for US1; manual quickstart US1  
5. Demo create/save flow

### Incremental Delivery

| Increment | Stories | Value |
|-----------|---------|-------|
| MVP | US1 | Core journal CRUD |
| Browse | + US2 | Filter/sort |
| Quality | + US3 | Validation |
| Safety | + US4 | Soft delete |
| Product shell | + US5, US6 | Navigation + badge |
| Demo-ready | + US7 | Seed data |
| Ship | Polish | A11y, CI, quickstart |

### Parallel Team Strategy

After Phase 2:

- **Dev A**: US1 → US3  
- **Dev B**: US2 (fixtures) → US4  
- **Dev C**: US5 shell (after T024) + US6 tests  
- **Integrate**: US7 seed + Phase 10

---

## Notes

- Playwright intentionally omitted; Jest matrix satisfies constitution II for 001  
- Use `fake-indexeddb` in `DexieJournalRepository.test.ts` and any test needing IDB  
- Clear site data + `meta.hasSeeded` when re-running US7 manually  
- Kilometers only; English UI only; no `apps/api` implementation in 001
