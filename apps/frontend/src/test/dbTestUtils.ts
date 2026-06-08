import { db } from '../data/db';

export async function resetTestDatabase(): Promise<void> {
  if (!db.isOpen()) {
    await db.open();
  }
  await Promise.all([
    db.journalEntries.clear(),
    db.trashEntries.clear(),
    db.meta.clear(),
  ]);
}
