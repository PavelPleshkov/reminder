# Data Model: Journal & App Shell (Feature 001)

**Date**: 2026-05-22  
**Spec**: [spec.md](./spec.md)

## Overview

All entities are persisted in the browser via Dexie (IndexedDB). Types and Zod schemas live in `packages/shared`; Dexie tables store serialized `JournalEntry` documents. **Pending reminder works** are derived at runtime, not stored as rows in 001.

## Entity: Category label

Fixed enumeration (FR-004). Not user-creatable.

| Value | Used for |
|-------|----------|
| `All` | Filter UI only (not stored on work) |
| `General` | Default when no label selected on save |
| `Scheduled maintenance` | Label cloud |
| `Engine`, `Transmission`, `Brakes`, `Steering`, `Intake`, `Exhaust`, `Fuel system`, `Suspension`, `Body`, `Electrical`, `Fluids`, `Filters` | Label cloud |

**Storage**: `Work.labels: CategoryLabel[]` — one or more labels per work; save normalizes empty selection to `['General']`.

## Entity: Work

A single maintenance action within a journal entry.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | `string` (uuid) | yes | Stable client id for list keys |
| `description` | `string` | yes | Trimmed; 1–100 chars; whitespace-only invalid |
| `labels` | `CategoryLabel[]` | yes (min 1 after save) | Default `General` if none selected |
| `done` | `boolean` | yes | Default `false` |
| `cost` | `number \| null` | no | Empty → 0 in total; if set: ≥ 0 |
| `nextCriterion` | `'mileage' \| 'date' \| 'on_breakdown'` | yes | FR-008 |
| `nextTargetMileage` | `number \| null` | conditional | Required if `mileage`; km; integer ≥ 0 |
| `nextTargetDate` | `string (ISO date) \| null` | conditional | Required if `date` |

**Behavior**:
- New works inserted at **top** of entry's `works` array (FR-009).
- `on_breakdown` → no pending reminder (FR-010).
- `mileage` / `date` with valid target → eligible for pending reminder if `done === false`.

## Entity: Journal entry

A dated maintenance record for the single vehicle.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | `string` (uuid) | yes | Primary key |
| `workDate` | `string (ISO date)` | yes | Date picker; future dates allowed |
| `odometerKm` | `number` | yes | Integer ≥ 0; non-numeric rejected |
| `works` | `Work[]` | yes | Min length 1 on save |
| `totalCost` | `number` | derived | Sum of work costs (null/empty cost → 0) |
| `createdAt` | `string (ISO datetime)` | yes | Set on first save |
| `updatedAt` | `string (ISO datetime)` | yes | Updated on each save |

**Lifecycle states**:

```text
active (journalEntries table)
    |  user confirms delete
    v
trashed (trashEntries table) — restore UI in Feature 002
```

**List display**: Entry header emphasizes `workDate` or `odometerKm` first based on active sort mode (FR-005).

## Derived: Pending reminder work

Not a persisted row in 001. Logical view for badge and future Reminders UI.

| Attribute | Source |
|-----------|--------|
| Entry id | Parent journal entry |
| Work id | Work within entry |
| Criterion | `nextCriterion` (`mileage` \| `date`) |
| Target | `nextTargetMileage` or `nextTargetDate` |
| Eligible | `!work.done` AND criterion ∈ {mileage, date} AND target present |

**Badge count** = number of eligible works across all **active** entries (FR-011).

## Meta store

| Key | Type | Purpose |
|-----|------|---------|
| `hasSeeded` | `boolean` | Prevents re-running FR-016 seed |

## Dexie schema (version 1)

```text
journalEntries: 'id, workDate, odometerKm'
trashEntries:   'id, deletedAt'
meta:           'key'
```

Indexes support default odometer sort and date sort queries; filter-by-category remains in-memory over loaded entries (acceptable for SC-003/SC-007 scale).

## Validation (Zod — `packages/shared`)

Schemas (names illustrative):

- `workSchema` — field rules above; refinements for conditional targets
- `journalEntrySchema` — `works.min(1)`, `odometerKm`, `workDate`
- `saveJournalEntrySchema` — same as entry schema for create/update

**Save-time normalization** (before persist):
1. Trim descriptions; reject whitespace-only.
2. If `labels.length === 0` → `['General']`.
3. Recompute `totalCost`.
4. Strip irrelevant target fields (e.g. clear `nextTargetDate` when criterion is `mileage`).

**UI error mapping**: Zod `path` → English message (SC-006), e.g. "Description must be 100 characters or fewer", "Add at least one work", "Enter a target odometer for mileage reminders".

## State transitions (Work.done)

```text
done: false + mileage/date + target  →  counts toward badge
done: true                           →  excluded from badge
criterion: on_breakdown              →  never counts toward badge
```

Toggle all works done/undone on entry (FR-007) updates each `work.done` then re-persists entry; badge recalculates.

## Demonstration seed content (FR-016)

Five entries with work counts `[1, 2, 3, 4, 2]`:

| # | workDate (example) | odometerKm | Works (summary) |
|---|-------------------|------------|-----------------|
| 1 | 2024-01-10 | 45000 | 1× Engine oil change (Mileage, not done) |
| 2 | 2024-04-15 | 52000 | 2× Brakes pads + Fluids flush (Date + Mileage mix) |
| 3 | 2024-08-01 | 61000 | 3× Filters, General inspection, Electrical |
| 4 | 2025-01-20 | 70500 | 4× varied labels, one On breakdown |
| 5 | 2025-05-01 | 78000 | 2× done/not done for badge demo |

Exact strings ≤ 100 chars, English, realistic maintenance wording; at least 2 Mileage, 2 Date, 1 On breakdown across the set; mixed `done` and costs.

## Relationships

```text
JournalEntry 1──* Work
Work *──* CategoryLabel (stored as label strings)
PendingReminderWork ──derived──> Work (subset of active entries)
```

## Future (out of 001 scope)

- `ApiJournalRepository` POST/GET DTOs mirror Zod schemas
- Trash restore mutates `trashEntries` → `journalEntries`
- Settings `distanceUnit` affects display only
