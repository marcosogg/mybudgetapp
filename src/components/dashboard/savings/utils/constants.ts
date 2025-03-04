
export const CHART_CONSTANTS = {
  MARGIN: { top: 10, right: 30, left: 10, bottom: 0 },
  CHART_HEIGHT: 300,
  DOT_RADIUS: 4,
  BAR_RADIUS: [4, 4, 0, 0] as [number, number, number, number],
  STROKE_WIDTH: 2,
  STROKE_DASHARRAY: "5 5",
  FILL_OPACITY: 0.8,
  CONFIDENCE_DECREASE_RATE: 0.2,
  MIN_MONTHS_FOR_PROJECTION: 3,
  TREND_THRESHOLD: 10,
  MONTHS_TO_PROJECT: 2
} as const;
