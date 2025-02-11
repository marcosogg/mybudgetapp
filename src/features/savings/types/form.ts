
import { z } from "zod";
import type { SavingsGoalType } from "./goal";

export interface SavingsGoalFormData {
  name: string;
  goal_type: SavingsGoalType;
  target_amount: string;
  recurring_amount?: string;
  period_start: Date;
  period_end?: Date;
  notes?: string;
}

export const savingsGoalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  goal_type: z.enum(['one_time', 'recurring_monthly', 'recurring_yearly']),
  target_amount: z.string()
    .min(1, "Target amount is required")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Must be a positive number"),
  recurring_amount: z.string()
    .optional()
    .refine(val => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), "Must be a positive number if provided"),
  period_start: z.date().optional(),
  period_end: z.date().optional(),
  notes: z.string().optional(),
}).refine(data => {
  if (['recurring_monthly', 'recurring_yearly'].includes(data.goal_type) && !data.recurring_amount) {
    return false;
  }
  return true;
}, {
  message: "Recurring amount is required for recurring goals"
});

export type SavingsGoalFormValues = z.infer<typeof savingsGoalSchema>;
