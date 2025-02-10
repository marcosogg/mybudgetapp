import { z } from "zod";
import { TrendIndicator } from "../constants/savings";

export type SavingsGoalType = 'one_time' | 'recurring';

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  goal_type: SavingsGoalType;
  target_amount: number;
  recurring_amount?: number;
  period_start: Date;
  period_end?: Date;
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
  period_start: Date;
  period_end?: Date;
  notes?: string;
}

export const savingsGoalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  goal_type: z.enum(['one_time', 'recurring']),
  target_amount: z.number().min(0.01, "Target amount must be greater than 0"),
  recurring_amount: z.number().min(0.01, "Recurring amount must be greater than 0").optional(),
  period_start: z.date(),
  period_end: z.date().optional(),
  notes: z.string().optional(),
}).refine(data => {
  if (data.goal_type === 'one_time' && !data.period_end) {
    return false;
  }
  if (data.goal_type === 'recurring' && !data.recurring_amount) {
    return false;
  }
  if (data.period_end && data.period_start && data.period_end <= data.period_start) {
    return false;
  }
  return true;
}, {
  message: "Invalid goal configuration. Please check the dates and amounts."
});

export type SavingsGoalFormValues = z.infer<typeof savingsGoalSchema>; 