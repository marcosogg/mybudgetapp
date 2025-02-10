export const SAVINGS_CONSTANTS = {
  TRENDS: {
    THRESHOLD: 10,
    INDICATORS: {
      UP: 'up',
      DOWN: 'down',
      STABLE: 'stable'
    } as const
  },
  GOALS: {
    MINIMUM_AMOUNT: 1,
    PROGRESS_THRESHOLDS: {
      ON_TRACK: 90,
      WARNING: 75,
      DANGER: 50
    }
  }
} as const;

export type TrendIndicator = typeof SAVINGS_CONSTANTS.TRENDS.INDICATORS[keyof typeof SAVINGS_CONSTANTS.TRENDS.INDICATORS]; 