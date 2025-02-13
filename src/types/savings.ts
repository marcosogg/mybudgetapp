
import { z } from "zod";

export type SavingsGoalType = 'one_time' | 'recurring_monthly' | 'recurring_yearly';

export interface MonthlySavingsData {
  month: string;
  amount: number;
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
  averageMonthlySavings: number;
  projections: SavingsProjection[];
  currentGoal?: SavingsGoal | null;
  goalProgress?: number;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
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

export const SAVINGS_CONSTANTS = {
  PROGRESS_THRESHOLDS: {
    ON_TRACK: 90, // Percentage threshold for considering a goal "on track"
    WARNING: 75,  // Percentage threshold for warning status
    DANGER: 50    // Percentage threshold for danger status
  },
  CHART_SETTINGS: {
    TREND_THRESHOLD: 10, // Minimum difference to show trend
    MIN_DATA_POINTS: 3   // Minimum number of data points for trends
  },
  PROJECTION_SETTINGS: {
    MIN_MONTHS_FOR_PROJECTION: 3, // Minimum months of data needed for projections
    CONFIDENCE_DECAY: 0.2         // How much confidence decreases per month in projections
  }
};
