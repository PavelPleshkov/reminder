import { resetTestDatabase } from '../test/dbTestUtils';
import { DexieJournalRepository } from '../data/repositories/DexieJournalRepository';
import { buildFiveEntries } from '../data/seed/demoJournalSeed';

const repo = new DexieJournalRepository();

describe('demonstration data seed', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it('buildFiveEntries returns exactly 5 entries with 1-4 works each', () => {
    const entries = buildFiveEntries();
    expect(entries).toHaveLength(5);
    const workCounts = entries.map((e) => e.works.length);
    expect(workCounts).toEqual([1, 2, 3, 4, 2]);
    for (const count of workCounts) {
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(4);
    }
  });

  it('seeds once when storage is empty', async () => {
    expect(await repo.isStorageEmpty()).toBe(true);
    expect(await repo.hasSeeded()).toBe(false);

    const entries = buildFiveEntries();
    for (const e of entries) await repo.save(e);
    await repo.markSeeded();

    expect(await repo.countActive()).toBe(5);
    expect(await repo.hasSeeded()).toBe(true);

    await repo.markSeeded();
    expect(await repo.countActive()).toBe(5);
  });

  it('seed data supports Brakes filter', async () => {
    const entries = buildFiveEntries();
    for (const e of entries) await repo.save(e);

    const brakes = entries.filter((e) => e.works.some((w) => w.labels.includes('Brakes')));
    expect(brakes.length).toBeGreaterThan(0);
  });
});
