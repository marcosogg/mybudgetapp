
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

export const GOAL_TYPE_LABELS: Record<string, string> = {
  'one_time': 'One-Time Goal',
  'recurring_monthly': 'Monthly Goal',
  'recurring_yearly': 'Yearly Goal'
};

export const GOAL_TYPE_DESCRIPTIONS: Record<string, string> = {
  'one_time': 'Set a target amount to reach by a specific date',
  'recurring_monthly': 'Set a monthly savings target to maintain',
  'recurring_yearly': 'Set a yearly savings goal to work towards'
};
