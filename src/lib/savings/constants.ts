
export const SAVINGS_CONSTANTS = {
  GOAL_TYPES: {
    RECURRING_MONTHLY: 'recurring_monthly' as const,
    RECURRING_YEARLY: 'recurring_yearly' as const,
  },
  
  MINIMUM_AMOUNTS: {
    TARGET: 1,
    RECURRING: 1,
  },

  PROGRESS_THRESHOLDS: {
    ON_TRACK: 90, // Percentage of expected progress to be considered "on track"
    WARNING: 75, // Percentage of expected progress to show warning
    DANGER: 50, // Percentage of expected progress to show danger
  },

  PROJECTION_SETTINGS: {
    MIN_MONTHS_FOR_PROJECTION: 3,
    CONFIDENCE_DECREASE_RATE: 0.2,
    MAX_PROJECTION_MONTHS: 6,
  },

  CHART_SETTINGS: {
    DEFAULT_MONTHS_TO_SHOW: 12,
    MIN_MONTHS_TO_SHOW: 3,
    TREND_THRESHOLD: 10, // Minimum difference to show trend
  },
} as const;

export const GOAL_TYPE_LABELS = {
  [SAVINGS_CONSTANTS.GOAL_TYPES.RECURRING_MONTHLY]: 'Monthly Goal',
  [SAVINGS_CONSTANTS.GOAL_TYPES.RECURRING_YEARLY]: 'Yearly Goal',
} as const;

export const GOAL_TYPE_DESCRIPTIONS = {
  [SAVINGS_CONSTANTS.GOAL_TYPES.RECURRING_MONTHLY]: 'Set a monthly savings target',
  [SAVINGS_CONSTANTS.GOAL_TYPES.RECURRING_YEARLY]: 'Set a yearly savings target',
} as const;
