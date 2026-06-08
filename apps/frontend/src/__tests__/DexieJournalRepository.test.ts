import { db } from '../data/db';
import { resetTestDatabase } from '../test/dbTestUtils';
import { DexieJournalRepository } from '../data/repositories/DexieJournalRepository';
import { buildFiveEntries } from '../data/seed/demoJournalSeed';

const repo = new DexieJournalRepository();

describe('DexieJournalRepository', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it('moveToTrash removes from active and stores in trash', async () => {
    const entry = buildFiveEntries()[0];
    await repo.save(entry);

    await repo.moveToTrash(entry.id);

    expect(await repo.countActive()).toBe(0);
    const trashed = await db.trashEntries.get(entry.id);
    expect(trashed).toBeDefined();
    expect(trashed?.deletedAt).toBeDefined();
  });

  it('isStorageEmpty returns true for empty db', async () => {
    expect(await repo.isStorageEmpty()).toBe(true);
  });

  it('hasSeeded and markSeeded work correctly', async () => {
    expect(await repo.hasSeeded()).toBe(false);
    await repo.markSeeded();
    expect(await repo.hasSeeded()).toBe(true);
  });
});
