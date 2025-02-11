
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
  projection_end_amount?: number;
}

export interface Transaction {
  date: string;
  amount: number;
}

// Constants for the savings feature
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

export const GOAL_TYPE_LABELS: Record<SavingsGoalType, string> = {
  'one_time': 'One-Time Goal',
  'recurring_monthly': 'Monthly Goal',
  'recurring_yearly': 'Yearly Goal'
};

export const GOAL_TYPE_DESCRIPTIONS: Record<SavingsGoalType, string> = {
  'one_time': 'Set a target amount to reach by a specific date',
  'recurring_monthly': 'Set a monthly savings target to maintain',
  'recurring_yearly': 'Set a yearly savings goal to work towards'
};
