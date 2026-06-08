import type { CategoryLabel } from '../constants/categories';

export type NextCriterion = 'mileage' | 'date' | 'on_breakdown';

export interface Work {
  id: string;
  description: string;
  labels: CategoryLabel[];
  done: boolean;
  cost: number | null;
  nextCriterion: NextCriterion;
  nextTargetMileage: number | null;
  nextTargetDate: string | null;
}

export interface JournalEntry {
  id: string;
  workDate: string;
  odometerKm: number;
  works: Work[];
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrashEntry extends JournalEntry {
  deletedAt: string;
}
