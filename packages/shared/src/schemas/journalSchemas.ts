import { z } from 'zod';
import { WORK_LABELS } from '../constants/categories';

export const categoryLabelSchema = z.enum(WORK_LABELS);

export const workSchema = z
  .object({
    id: z.string().min(1),
    description: z
      .string()
      .transform((s) => s.trim())
      .pipe(z.string().min(1).max(100)),
    labels: z.array(categoryLabelSchema).min(1),
    done: z.boolean(),
    cost: z.number().min(0).nullable(),
    nextCriterion: z.enum(['mileage', 'date', 'on_breakdown']),
    nextTargetMileage: z.number().int().min(0).nullable(),
    nextTargetDate: z.string().nullable(),
  })
  .superRefine((work, ctx) => {
    if (work.nextCriterion === 'mileage') {
      if (work.nextTargetMileage === null || work.nextTargetMileage === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['nextTargetMileage'],
          message: 'Target odometer required for mileage criterion',
        });
      }
    }
    if (work.nextCriterion === 'date') {
      if (!work.nextTargetDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['nextTargetDate'],
          message: 'Target date required for date criterion',
        });
      }
    }
    if (work.nextCriterion === 'on_breakdown') {
      if (work.nextTargetMileage !== null || work.nextTargetDate !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['nextCriterion'],
          message: 'On breakdown criterion should not have target values',
        });
      }
    }
  });

export const journalEntrySchema = z.object({
  id: z.string().min(1),
  workDate: z.string().min(1),
  odometerKm: z.number().int().min(0),
  works: z.array(workSchema).min(1),
  totalCost: z.number().min(0),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type WorkInput = z.input<typeof workSchema>;
export type JournalEntryInput = z.input<typeof journalEntrySchema>;
