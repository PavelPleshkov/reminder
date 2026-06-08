export const WORK_LABELS = [
  'General',
  'Scheduled maintenance',
  'Engine',
  'Transmission',
  'Brakes',
  'Steering',
  'Intake',
  'Exhaust',
  'Fuel system',
  'Suspension',
  'Body',
  'Electrical',
  'Fluids',
  'Filters',
] as const;

export type CategoryLabel = (typeof WORK_LABELS)[number];

export const FILTER_CATEGORIES = ['All', ...WORK_LABELS] as const;

export type FilterCategory = (typeof FILTER_CATEGORIES)[number];
