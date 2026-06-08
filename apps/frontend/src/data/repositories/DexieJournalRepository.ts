import type { JournalEntry, JournalRepository } from '@reminder/shared';
import { RepositoryError } from '@reminder/shared';
import { db } from '../db';

const SEEDED_KEY = 'hasSeeded';

export class DexieJournalRepository implements JournalRepository {
  async isStorageEmpty(): Promise<boolean> {
    try {
      const [journalCount, trashCount] = await Promise.all([
        db.journalEntries.count(),
        db.trashEntries.count(),
      ]);
      return journalCount === 0 && trashCount === 0;
    } catch {
      throw new RepositoryError('Failed to check storage state');
    }
  }

  async hasSeeded(): Promise<boolean> {
    try {
      const record = await db.meta.get(SEEDED_KEY);
      return record?.value === true;
    } catch {
      throw new RepositoryError('Failed to check seed status');
    }
  }

  async markSeeded(): Promise<void> {
    try {
      await db.meta.put({ key: SEEDED_KEY, value: true });
    } catch {
      throw new RepositoryError('Failed to mark seeded');
    }
  }

  async listActive(
    orderBy: 'odometerKm' | 'workDate' = 'odometerKm',
    direction: 'asc' | 'desc' = 'desc',
  ): Promise<JournalEntry[]> {
    try {
      const collection = db.journalEntries.orderBy(orderBy);
      return direction === 'desc' ? collection.reverse().toArray() : collection.toArray();
    } catch {
      throw new RepositoryError('Failed to list entries');
    }
  }

  async getById(id: string): Promise<JournalEntry | undefined> {
    try {
      return db.journalEntries.get(id);
    } catch {
      throw new RepositoryError('Failed to get entry');
    }
  }

  async save(entry: JournalEntry): Promise<void> {
    try {
      const now = new Date().toISOString();
      const existing = await db.journalEntries.get(entry.id);
      const toSave: JournalEntry = {
        ...entry,
        createdAt: existing?.createdAt ?? entry.createdAt ?? now,
        updatedAt: now,
      };
      await db.journalEntries.put(toSave);
    } catch {
      throw new RepositoryError('Failed to save entry');
    }
  }

  async moveToTrash(id: string): Promise<void> {
    try {
      const entry = await db.journalEntries.get(id);
      if (!entry) {
        throw new RepositoryError('Entry not found');
      }
      const deletedAt = new Date().toISOString();
      await db.transaction('rw', db.journalEntries, db.trashEntries, async () => {
        await db.trashEntries.put({ ...entry, deletedAt });
        await db.journalEntries.delete(id);
      });
    } catch (error) {
      if (error instanceof RepositoryError) throw error;
      throw new RepositoryError('Failed to move entry to trash');
    }
  }

  async countActive(): Promise<number> {
    try {
      return db.journalEntries.count();
    } catch {
      throw new RepositoryError('Failed to count entries');
    }
  }
}
