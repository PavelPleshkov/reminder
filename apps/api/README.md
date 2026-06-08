# Reminder API (Future)

This workspace is a stub for Feature 001. The backend will be implemented in a future feature.

## Planned stack

- **Runtime**: Node.js 20+ LTS
- **Framework**: Express or Fastify
- **ORM**: Prisma with PostgreSQL
- **Validation**: `@reminder/shared` Zod schemas (same as frontend)

## Planned responsibilities

- REST API for journal entries (`POST/GET/PUT/DELETE /journal/entries`)
- Authentication and multi-device sync
- `ApiJournalRepository` implementing `JournalRepository` from `@reminder/shared`

## Status

Not implemented in Feature 001. The frontend uses `DexieJournalRepository` with IndexedDB only.
