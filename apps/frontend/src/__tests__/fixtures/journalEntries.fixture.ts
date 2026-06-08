import type { JournalEntry, Work } from '@reminder/shared';

function work(partial: Omit<Work, 'id'>): Work {
  return { id: crypto.randomUUID(), ...partial };
}

function entry(
  partial: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'works'> & { works: Omit<Work, 'id'>[] },
): JournalEntry {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...partial,
    works: partial.works.map(work),
  };
}

export function buildJournalFixture(count = 24): JournalEntry[] {
  const labels = ['Engine', 'Brakes', 'Fluids', 'Filters', 'General', 'Electrical'] as const;
  const entries: JournalEntry[] = [];

  for (let i = 0; i < count; i++) {
    const label = labels[i % labels.length];
    entries.push(
      entry({
        workDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
        odometerKm: 40000 + i * 1500,
        totalCost: 50 + i * 10,
        works: [
          {
            description: `Maintenance work ${i + 1} for ${label}`,
            labels: [label],
            done: i % 3 === 0,
            cost: 50 + i * 10,
            nextCriterion: i % 2 === 0 ? 'mileage' : 'date',
            nextTargetMileage: i % 2 === 0 ? 50000 + i * 1000 : null,
            nextTargetDate: i % 2 === 1 ? `2025-${String((i % 12) + 1).padStart(2, '0')}-01` : null,
          },
        ],
      }),
    );
  }

  return entries;
}
