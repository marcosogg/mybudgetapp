
import { z } from "zod";

// Basic type definitions
export type SavingsGoalType = 'one_time' | 'recurring_monthly' | 'recurring_yearly';
export type SavingsGoalStatus = 'active' | 'completed' | 'cancelled';
export type SavingsGoalCategory = 'general' | 'emergency' | 'retirement' | 'house' | 'car' | 'education' | 'vacation' | 'other';

export interface SavingsGoal {
  id: string;
  user_id: string;
  goal_type: SavingsGoalType;
  target_amount: number;
  recurring_amount?: number;
  period_start: Date;
  period_end?: Date;
  notes?: string;
  created_at: Date;
  status: SavingsGoalStatus;
  priority: number;
  category: SavingsGoalCategory;
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
  category: SavingsGoalCategory;
  priority: number;
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
  period_start: z.date(),
  period_end: z.date().optional(),
  notes: z.string().optional(),
  category: z.enum(['general', 'emergency', 'retirement', 'house', 'car', 'education', 'vacation', 'other']).default('general'),
  priority: z.number().int().min(0).default(0)
}).refine(data => {
  if (data.goal_type === 'one_time' && !data.period_end) {
    return false;
  }
  if (['recurring_monthly', 'recurring_yearly'].includes(data.goal_type) && !data.recurring_amount) {
    return false;
  }
  return true;
}, {
  message: "End date is required for one-time goals, and recurring amount is required for recurring goals"
});

export type SavingsGoalFormValues = z.infer<typeof savingsGoalSchema>;
