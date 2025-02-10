import { z } from "zod";
import { TrendIndicator } from "../constants/savings";

export type SavingsGoalType = 'one_time' | 'recurring_monthly' | 'recurring_yearly';

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  goal_type: SavingsGoalType;
  target_amount: number;
  recurring_amount?: number;
  period_start: Date | null;
  period_end: Date | null;
  progress: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SavingsState {
  currentGoal: SavingsGoal | null;
  goals: SavingsGoal[];
  monthlyData: MonthlySavingsData[];
  projections: SavingsProjection[];
  metrics: SavingsMetrics;
}

export interface SavingsMetrics {
  yearTotal: number;
  averageMonthlySavings: number;
  goalProgress: number;
  currentAmount: number;
  expectedAmount: number;
  isOnTrack: boolean;
  projectionEndAmount?: number;
}

export interface MonthlySavingsData {
  month: string;
  amount: number;
  goalAmount: number;
  percentageOfGoal: number;
  trendIndicator: TrendIndicator;
  isNegative: boolean;
}

export interface SavingsProjection {
  month: string;
  projectedAmount: number;
  confidenceScore: number;
}

// Form-related types and validation
export interface SavingsGoalFormData {
  name: string;
  goal_type: SavingsGoalType;
  target_amount: number;
  recurring_amount?: number;
  period_start: Date | null;
  period_end: Date | null;
  notes?: string;
}

export const savingsGoalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  goal_type: z.enum(['one_time', 'recurring_monthly', 'recurring_yearly']),
  target_amount: z.number().min(0.01, "Target amount must be greater than 0"),
  recurring_amount: z.number().min(0.01, "Recurring amount must be greater than 0").optional(),
  period_start: z.date().nullable(),
  period_end: z.date().nullable(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  // One-time goals don't need dates
  if (data.goal_type === 'one_time') {
    if (data.period_start !== null || data.period_end !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "One-time goals should not have dates",
        path: ["period_start"],
      });
    }
    if (data.recurring_amount !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "One-time goals should not have recurring amounts",
        path: ["recurring_amount"],
      });
    }
  }

  // Monthly goals need a start date and recurring amount
  if (data.goal_type === 'recurring_monthly') {
    if (!data.period_start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Monthly goals require a start month",
        path: ["period_start"],
      });
    }
    if (!data.recurring_amount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Monthly goals require a recurring amount",
        path: ["recurring_amount"],
      });
    }
  }

  // Yearly goals need a recurring amount
  if (data.goal_type === 'recurring_yearly') {
    if (!data.recurring_amount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Yearly goals require a recurring amount",
        path: ["recurring_amount"],
      });
    }
  }
});

export type SavingsGoalFormValues = z.infer<typeof savingsGoalSchema>; 