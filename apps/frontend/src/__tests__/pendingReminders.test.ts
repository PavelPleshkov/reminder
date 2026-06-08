import { isPendingReminderWork, countPendingReminderWorks } from '../domain/pendingReminders';
import type { Work, JournalEntry } from '@reminder/shared';

function makeWork(overrides: Partial<Work> = {}): Work {
  return {
    id: '1',
    description: 'Test',
    labels: ['General'],
    done: false,
    cost: null,
    nextCriterion: 'mileage',
    nextTargetMileage: 50000,
    nextTargetDate: null,
    ...overrides,
  };
}

function makeEntry(works: Work[]): JournalEntry {
  return {
    id: 'e1',
    workDate: '2024-01-01',
    odometerKm: 40000,
    works,
    totalCost: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe('pending reminder eligibility', () => {
  it('counts mileage criterion with target when not done', () => {
    expect(isPendingReminderWork(makeWork())).toBe(true);
  });

  it('counts date criterion with target when not done', () => {
    expect(
      isPendingReminderWork(
        makeWork({
          nextCriterion: 'date',
          nextTargetMileage: null,
          nextTargetDate: '2025-06-01',
        }),
      ),
    ).toBe(true);
  });

  it('excludes on_breakdown criterion', () => {
    expect(
      isPendingReminderWork(
        makeWork({
          nextCriterion: 'on_breakdown',
          nextTargetMileage: null,
          nextTargetDate: null,
        }),
      ),
    ).toBe(false);
  });

  it('excludes done works', () => {
    expect(isPendingReminderWork(makeWork({ done: true }))).toBe(false);
  });

  it('counts eligible works across entries', () => {
    const entries = [
      makeEntry([makeWork(), makeWork({ done: true })]),
      makeEntry([
        makeWork({
          nextCriterion: 'on_breakdown',
          nextTargetMileage: null,
          nextTargetDate: null,
        }),
      ]),
    ];
    expect(countPendingReminderWorks(entries)).toBe(1);
  });
});
