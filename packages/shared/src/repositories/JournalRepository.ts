import type { JournalEntry } from '../types/journal';

export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export interface JournalRepository {
  isStorageEmpty(): Promise<boolean>;
  hasSeeded(): Promise<boolean>;
  markSeeded(): Promise<void>;
  listActive(orderBy?: 'odometerKm' | 'workDate', direction?: 'asc' | 'desc'): Promise<JournalEntry[]>;
  getById(id: string): Promise<JournalEntry | undefined>;
  save(entry: JournalEntry): Promise<void>;
  moveToTrash(id: string): Promise<void>;
  countActive(): Promise<number>;
}
