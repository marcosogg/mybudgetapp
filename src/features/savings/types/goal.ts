
export type SavingsGoalType = 'one_time' | 'recurring_monthly' | 'recurring_yearly';

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
}
