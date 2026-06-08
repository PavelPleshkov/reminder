import type { JournalEntry, Work } from '@reminder/shared';

function work(partial: Omit<Work, 'id'> & { id?: string }): Work {
  return { id: partial.id ?? crypto.randomUUID(), ...partial };
}

export function buildFiveEntries(): JournalEntry[] {
  const base = new Date().toISOString();

  return [
    {
      id: crypto.randomUUID(),
      workDate: '2024-01-10',
      odometerKm: 45000,
      totalCost: 85,
      createdAt: base,
      updatedAt: base,
      works: [
        work({
          description: 'Engine oil and filter change',
          labels: ['Engine', 'Filters'],
          done: false,
          cost: 85,
          nextCriterion: 'mileage',
          nextTargetMileage: 50000,
          nextTargetDate: null,
        }),
      ],
    },
    {
      id: crypto.randomUUID(),
      workDate: '2024-04-15',
      odometerKm: 52000,
      totalCost: 320,
      createdAt: base,
      updatedAt: base,
      works: [
        work({
          description: 'Front brake pads replacement',
          labels: ['Brakes'],
          done: false,
          cost: 220,
          nextCriterion: 'mileage',
          nextTargetMileage: 72000,
          nextTargetDate: null,
        }),
        work({
          description: 'Coolant flush',
          labels: ['Fluids'],
          done: true,
          cost: 100,
          nextCriterion: 'date',
          nextTargetMileage: null,
          nextTargetDate: '2026-04-15',
        }),
      ],
    },
    {
      id: crypto.randomUUID(),
      workDate: '2024-08-01',
      odometerKm: 61000,
      totalCost: 145,
      createdAt: base,
      updatedAt: base,
      works: [
        work({
          description: 'Cabin air filter replacement',
          labels: ['Filters'],
          done: false,
          cost: 35,
          nextCriterion: 'date',
          nextTargetMileage: null,
          nextTargetDate: '2025-08-01',
        }),
        work({
          description: 'General inspection',
          labels: ['General'],
          done: true,
          cost: null,
          nextCriterion: 'date',
          nextTargetMileage: null,
          nextTargetDate: '2025-02-01',
        }),
        work({
          description: 'Battery terminal cleaning',
          labels: ['Electrical'],
          done: false,
          cost: 110,
          nextCriterion: 'on_breakdown',
          nextTargetMileage: null,
          nextTargetDate: null,
        }),
      ],
    },
    {
      id: crypto.randomUUID(),
      workDate: '2025-01-20',
      odometerKm: 70500,
      totalCost: 410,
      createdAt: base,
      updatedAt: base,
      works: [
        work({
          description: 'Transmission fluid change',
          labels: ['Transmission', 'Fluids'],
          done: false,
          cost: 180,
          nextCriterion: 'mileage',
          nextTargetMileage: 90000,
          nextTargetDate: null,
        }),
        work({
          description: 'Steering rack inspection',
          labels: ['Steering'],
          done: true,
          cost: null,
          nextCriterion: 'on_breakdown',
          nextTargetMileage: null,
          nextTargetDate: null,
        }),
        work({
          description: 'Exhaust muffler check',
          labels: ['Exhaust'],
          done: false,
          cost: 80,
          nextCriterion: 'date',
          nextTargetMileage: null,
          nextTargetDate: '2026-01-20',
        }),
        work({
          description: 'Suspension bushings lubrication',
          labels: ['Suspension'],
          done: false,
          cost: 150,
          nextCriterion: 'mileage',
          nextTargetMileage: 80000,
          nextTargetDate: null,
        }),
      ],
    },
    {
      id: crypto.randomUUID(),
      workDate: '2025-05-01',
      odometerKm: 78000,
      totalCost: 95,
      createdAt: base,
      updatedAt: base,
      works: [
        work({
          description: 'Fuel system cleaner additive',
          labels: ['Fuel system'],
          done: true,
          cost: 45,
          nextCriterion: 'date',
          nextTargetMileage: null,
          nextTargetDate: '2025-11-01',
        }),
        work({
          description: 'Body panel rust prevention',
          labels: ['Body'],
          done: false,
          cost: 50,
          nextCriterion: 'mileage',
          nextTargetMileage: 88000,
          nextTargetDate: null,
        }),
      ],
    },
  ];
}
