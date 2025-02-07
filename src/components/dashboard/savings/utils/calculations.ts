import type { MonthlySavingsData, SavingsProjection } from "@/types/savings";
import { addMonths, format } from "date-fns";

export type TrendIndicator = 'up' | 'down' | 'stable';

export function calculateTrendIndicator(current: number, previous: number): TrendIndicator {
  const difference = current - previous;
  if (Math.abs(difference) < 10) return 'stable';
  return difference > 0 ? 'up' : 'down';
}

export function calculateProjections(
  historicalData: MonthlySavingsData[],
  monthsAhead: number = 2
): SavingsProjection[] {
  if (historicalData.length < 3) return [];

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
      confidence_score: 1 - (i * 0.2) // Confidence decreases as we project further
    });
  }

  return projections;
} 