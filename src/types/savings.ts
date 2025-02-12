
import { z } from "zod";

// Basic type definitions
export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  notes?: string;
  progress: number;
  created_at: Date;
  updated_at: Date;
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
  target_amount: string;
  notes?: string;
}

// Validation schemas
export const savingsGoalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  target_amount: z.string()
    .min(1, "Target amount is required")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Must be a positive number"),
  notes: z.string().optional(),
});

export type SavingsGoalFormValues = z.infer<typeof savingsGoalSchema>;
