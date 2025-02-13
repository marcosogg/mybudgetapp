
import { z } from "zod";

// Basic type definitions
export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  goal_type: 'emergency_fund' | 'vacation' | 'major_purchase' | 'custom';
  target_amount: number;
  recurring_amount?: number;
  period_start?: Date;
  period_end?: Date;
  notes?: string;
  progress: number;
  created_at: Date;
  updated_at: Date;
  streak_count: number;
  last_contribution_date?: Date;
  best_month_amount?: number;
  best_month_date?: Date;
  milestone_notifications: boolean;
  tag?: string;
}

export interface SavingsProgress {
  current_amount: number;
  expected_amount: number;
  percentage: number;
  is_on_track: boolean;
  projection_end_amount?: number;
}

// Form-related types
export interface SavingsGoalFormData {
  name: string;
  goal_type: 'emergency_fund' | 'vacation' | 'major_purchase' | 'custom';
  target_amount: string;
  recurring_amount?: string;
  period_start?: Date;
  period_end?: Date;
  notes?: string;
  milestone_notifications?: boolean;
}

// Validation schemas
export const savingsGoalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  goal_type: z.enum(['emergency_fund', 'vacation', 'major_purchase', 'custom']),
  target_amount: z.string()
    .min(1, "Target amount is required")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Must be a positive number"),
  recurring_amount: z.string()
    .optional()
    .refine(val => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), "Must be a positive number if provided"),
  period_start: z.date().optional(),
  period_end: z.date().optional(),
  notes: z.string().optional(),
  milestone_notifications: z.boolean().default(true)
});

export type SavingsGoalFormValues = z.infer<typeof savingsGoalSchema>;

export const GOAL_TYPE_LABELS: Record<SavingsGoal['goal_type'], string> = {
  'emergency_fund': 'Emergency Fund',
  'vacation': 'Vacation Fund',
  'major_purchase': 'Major Purchase',
  'custom': 'Custom Goal'
};

export const GOAL_TYPE_DESCRIPTIONS: Record<SavingsGoal['goal_type'], string> = {
  'emergency_fund': 'Build an emergency fund for unexpected expenses',
  'vacation': 'Save for your dream vacation',
  'major_purchase': 'Save for a significant purchase',
  'custom': 'Create a custom savings goal'
};

export const GOAL_TYPE_SUGGESTIONS: Record<SavingsGoal['goal_type'], number> = {
  'emergency_fund': 6000, // Suggesting 6 months of basic expenses
  'vacation': 2000,      // Typical vacation fund
  'major_purchase': 5000, // Generic major purchase
  'custom': 1000         // Default custom goal amount
};
