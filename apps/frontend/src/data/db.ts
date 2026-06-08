import Dexie, { type Table } from 'dexie';
import type { JournalEntry, TrashEntry } from '@reminder/shared';

export interface MetaRecord {
  key: string;
  value: boolean | string | number;
}

export class ReminderDatabase extends Dexie {
  journalEntries!: Table<JournalEntry, string>;
  trashEntries!: Table<TrashEntry, string>;
  meta!: Table<MetaRecord, string>;

  constructor() {
    super('ReminderDB');
    this.version(1).stores({
      journalEntries: 'id, workDate, odometerKm',
      trashEntries: 'id, deletedAt',
      meta: 'key',
    });
  }
}

export const db = new ReminderDatabase();
