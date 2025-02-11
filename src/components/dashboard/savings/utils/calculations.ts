
import { MonthlySavingsData, SavingsProjection } from "@/types/savings";
import { format, addMonths } from "date-fns";
import { CHART_CONSTANTS } from "./constants";

export type TrendIndicator = 'up' | 'down' | 'stable';

export const calculateTrendIndicator = (current: number, previous: number): TrendIndicator => {
  const difference = current - previous;
  if (Math.abs(difference) < CHART_CONSTANTS.TREND_THRESHOLD) return 'stable';
  return difference > 0 ? 'up' : 'down';
};

export const calculateProjections = (
  historicalData: MonthlySavingsData[],
  monthsAhead: number = CHART_CONSTANTS.MONTHS_TO_PROJECT
): SavingsProjection[] => {
  if (historicalData.length < CHART_CONSTANTS.MIN_MONTHS_FOR_PROJECTION) return [];

  const last3Months = historicalData.slice(-3);
  const avgChange = last3Months.reduce((sum, curr, idx, arr) => {
    if (idx === 0) return sum;
    return sum + (curr.amount - arr[idx - 1].amount);
  }, 0) / 2;

  const lastMonth = last3Months[last3Months.length - 1];
  const projections: SavingsProjection[] = [];

  for (let i = 1; i <= monthsAhead; i++) {
    const projectedDate = addMonths(new Date(), i);
    const projectedAmount = lastMonth.amount + (avgChange * i);
    
    projections.push({
      month: format(projectedDate, "MMM"),
      projected_amount: projectedAmount,
      confidence_score: 1 - (i * CHART_CONSTANTS.CONFIDENCE_DECREASE_RATE)
    });
  }

  return projections;
};
