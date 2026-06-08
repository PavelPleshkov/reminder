# Contract: JournalRepository

**Package**: `@reminder/shared` (interface)  
**Implementation (001)**: `DexieJournalRepository` in `apps/frontend`  
**Future**: `ApiJournalRepository` in `apps/api`

## Purpose

Abstract journal persistence so UI and domain logic do not depend on IndexedDB. Feature 001 implements Dexie only; HTTP implementation deferred.

## Interface

```typescript
export interface JournalRepository {
  /** True when journalEntries and trashEntries are both empty */
  isStorageEmpty(): Promise<boolean>;

  hasSeeded(): Promise<boolean>;
  markSeeded(): Promise<void>;

  listActive(): Promise<JournalEntry[]>;
  getById(id: string): Promise<JournalEntry | undefined>;

  save(entry: JournalEntry): Promise<void>;

  /** Soft-delete: move from journalEntries to trashEntries */
  moveToTrash(id: string): Promise<void>;

  countActive(): Promise<number>;
}
```

## Semantics

| Method | Behavior | Spec |
|--------|----------|------|
| `listActive` | Returns all non-trashed entries | FR-003 |
| `save` | Insert or update by `id`; sets `updatedAt` | FR-006–FR-008 |
| `moveToTrash` | Copies entry to trash with `deletedAt`; removes from active | FR-012 |
| `isStorageEmpty` | Used before FR-016 seed | FR-016 |
| `hasSeeded` / `markSeeded` | One-time seed guard | FR-016 |

## Errors

Implementations SHOULD throw `RepositoryError` (simple Error subclass) on IDB failures; UI shows generic English retry message (constitution III).

## Testing

Mock implementation optional for RTL; prefer `fake-indexeddb` + real `DexieJournalRepository` in unit tests.
