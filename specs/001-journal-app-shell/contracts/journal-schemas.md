# Contract: Journal Zod schemas

**Package**: `@reminder/shared`  
**Module**: `src/schemas/journalSchemas.ts`

## Exported schemas

| Schema | Use |
|--------|-----|
| `workSchema` | Single work validation |
| `journalEntrySchema` | Full entry on Save |
| `categoryLabelSchema` | Enum of FR-004 labels (excludes `All`) |

## Types (inferred)

```typescript
export type Work = z.infer<typeof workSchema>;
export type JournalEntry = z.infer<typeof journalEntrySchema>;
export type CategoryLabel = z.infer<typeof categoryLabelSchema>;
export type NextCriterion = Work['nextCriterion'];
```

## Validation rules (normative)

### Work

- `description`: trim; min 1; max 100 after trim
- `labels`: array; on save pipeline default to `['General']` if empty
- `cost`: optional; if number, `>= 0`
- `nextCriterion`: enum `mileage | date | on_breakdown`
- If `mileage`: `nextTargetMileage` required, finite integer `>= 0`
- If `date`: `nextTargetDate` required, valid ISO date string
- If `on_breakdown`: targets must be null/omitted

### Journal entry

- `workDate`: valid date string
- `odometerKm`: finite number, `>= 0`
- `works`: `.min(1)`
- `totalCost`: optional in input; server-side normalize to sum of costs

## Constants contract

`src/constants/categories.ts`:

- `FILTER_CATEGORIES`: includes `All` + all stored labels
- `WORK_LABELS`: stored labels only (no `All`)

## Versioning

Breaking schema changes require Dexie `db.version(n).upgrade()` and bump in shared package. Document in PR when spec changes validation.

## Future API alignment

REST bodies for POST/PUT `/journal/entries` SHOULD use the same JSON shape as `journalEntrySchema` output after normalization.
