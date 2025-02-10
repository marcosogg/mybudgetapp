import { z } from "zod";

// Basic type definitions
export type SavingsGoalType = 'one_time' | 'recurring_monthly' | 'recurring_yearly';

export interface SavingsGoal {
  id: string;
  user_id: string;
  goal_type: SavingsGoalType;
  target_amount: number;
  recurring_amount?: number;
  period_start?: Date;
  period_end?: Date;
  notes?: string;
  created_at: Date;
  progress?: number;
}

export interface SavingsProgress {
  current_amount: number;
  expected_amount: number;
  percentage: number;
  is_on_track: boolean;
  projection_end_amount?: number;
}

export interface MonthlySavingsData {
  month: string;
  amount: number;
  goal_amount: number;
  percentage_of_goal: number;
  trend_indicator: 'up' | 'down' | 'stable';
  is_negative: boolean;
}

export interface SavingsProjection {
  month: string;
  projected_amount: number;
  confidence_score: number;
}

export interface SavingsChartData {
  monthlyData: MonthlySavingsData[];
  yearTotal: number;
  currentGoal: SavingsGoal | null;
  projections: SavingsProjection[];
  averageMonthlySavings: number;
  goalProgress: number;
}

// Form-related types
export interface SavingsGoalFormData {
  goal_type: SavingsGoalType;
  target_amount: string;
  recurring_amount?: string;
  period_start: Date;
  period_end?: Date;
  notes?: string;
}

// Validation schemas
export const savingsGoalSchema = z.object({
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
