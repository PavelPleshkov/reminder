# Quickstart: Journal & App Shell (Feature 001)

**Branch**: `001-journal-app-shell`  
**Prerequisites**: Node.js 20+, Yarn 1.x (`yarn --version` shows 1.22.x)

## Install

```bash
cd /Users/pavel/Personal/My_Projects/reminder
yarn install
```

Workspaces: `apps/frontend`, `packages/shared`, `apps/api` (stub).

## Development

```bash
# From repo root — start Vite dev server
yarn workspace @reminder/frontend dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

**First visit**: Journal should show **5 seeded entries** (FR-016). Clear site data in browser devtools to re-test seeding (only when `hasSeeded` meta is also cleared).

## Build

```bash
yarn workspace @reminder/frontend build
yarn workspace @reminder/frontend preview
```

## Test

```bash
# Frontend unit/component tests (Jest)
yarn workspace @reminder/frontend test

# Watch mode during development
yarn workspace @reminder/frontend test:watch

# All workspaces (when root script is wired)
yarn test
```

Tests use `fake-indexeddb` — no browser required for CI.

## Lint & format

```bash
yarn lint
yarn format
```

(Root scripts delegate to workspaces once implemented.)

## Manual acceptance checklist (P1)

1. **US1**: Journal → create entry → Save → appears in list; Cancel discards draft.
2. **US2**: Brakes filter; toggle date sort and reverse; default odometer desc.
3. **US3**: Save with 0 works, 101-char description, missing mileage target — errors, no save.
4. **US4**: Delete → confirm removes from list; cancel keeps entry.
5. **US5**: Home tiles; menu badge on Reminders; placeholders for Settings/FAQ/Trash/etc.
6. **US6**: Save Mileage/Date works → badge increases; On breakdown → no badge contribution.
7. **US7**: Empty storage → exactly 5 seed entries with 1–4 works each.

## Troubleshooting

| Issue | Action |
|-------|--------|
| Seed does not appear | Application tab → Clear storage; ensure `journalEntries` empty |
| `@reminder/shared` not found | Run `yarn install` at repo root |
| Jest cannot resolve `@/` | Check `jest.config.ts` `moduleNameMapper` matches `vite.config.ts` |
| Tests flaky on timing | Use `user-event` `setup()` and `waitFor` from RTL |

## Related docs

- [plan.md](./plan.md) — architecture and test matrix
- [data-model.md](./data-model.md) — entities and validation
- [contracts/](./contracts/) — repository and schema contracts
