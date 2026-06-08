export const VALIDATION_MESSAGES: Record<string, string> = {
  'works': 'Add at least one work',
  'description': 'Description must be between 1 and 100 characters',
  'odometerKm': 'Enter a valid odometer reading (0 or greater)',
  'nextTargetMileage': 'Enter a target odometer for mileage reminders',
  'nextTargetDate': 'Enter a target date for date reminders',
  'cost': 'Cost must be zero or greater',
  'workDate': 'Enter a valid work date',
};

export function getValidationMessage(path: (string | number)[]): string {
  const key = path[path.length - 1]?.toString() ?? 'unknown';
  if (key === 'description' && path.includes('works')) {
    return 'Description must be 100 characters or fewer';
  }
  return VALIDATION_MESSAGES[key] ?? `Invalid value for ${key}`;
}
