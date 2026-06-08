import type { JournalEntry, Work } from '@reminder/shared';

export function isPendingReminderWork(work: Work): boolean {
  if (work.done) return false;
  if (work.nextCriterion === 'on_breakdown') return false;
  if (work.nextCriterion === 'mileage') {
    return work.nextTargetMileage !== null && work.nextTargetMileage !== undefined;
  }
  if (work.nextCriterion === 'date') {
    return work.nextTargetDate !== null && work.nextTargetDate !== '';
  }
  return false;
}

export function countPendingReminderWorks(entries: JournalEntry[]): number {
  return entries.reduce((count, entry) => {
    return count + entry.works.filter(isPendingReminderWork).length;
  }, 0);
}
