import { SAVINGS_CONSTANTS } from "../constants/savings";
import type { TrendIndicator } from "../constants/savings";
import type { MonthlySavingsData, SavingsMetrics, SavingsProjection } from "../types/savings";
import { differenceInMonths, differenceInYears, startOfMonth, endOfMonth } from "date-fns";
import type { SavingsGoal } from "../types/savings";

export function calculateTrendIndicator(current: number, previous: number): TrendIndicator {
  const difference = current - previous;
  if (Math.abs(difference) < SAVINGS_CONSTANTS.TRENDS.THRESHOLD) {
    return SAVINGS_CONSTANTS.TRENDS.INDICATORS.STABLE;
  }
  return difference > 0 ? SAVINGS_CONSTANTS.TRENDS.INDICATORS.UP : SAVINGS_CONSTANTS.TRENDS.INDICATORS.DOWN;
}

export function calculateSavingsMetrics(goals: SavingsGoal[]): SavingsMetrics {
  const activeGoals = goals.filter(goal => !goal.period_end || new Date(goal.period_end) > new Date());
  
  const yearTotal = calculateYearTotal(activeGoals);
  const averageMonthlySavings = calculateAverageMonthlySavings(activeGoals);
  const { currentAmount, expectedAmount } = calculateAmounts(activeGoals);
  const goalProgress = calculateOverallProgress(activeGoals);
  const projectionEndAmount = calculateProjectedEndAmount(activeGoals);
  
  return {
    yearTotal,
    averageMonthlySavings,
    goalProgress,
    currentAmount,
    expectedAmount,
    isOnTrack: currentAmount >= expectedAmount,
    projectionEndAmount,
  };
}

function calculateYearTotal(goals: SavingsGoal[]): number {
  return goals.reduce((total, goal) => {
    if (goal.goal_type === 'one_time') {
      const yearsSpan = differenceInYears(
        new Date(goal.period_end || new Date()),
        new Date(goal.period_start)
      );
      return total + (goal.target_amount / Math.max(1, yearsSpan));
    }
    
    return total + ((goal.recurring_amount || 0) * 12);
  }, 0);
}

function calculateAverageMonthlySavings(goals: SavingsGoal[]): number {
  return goals.reduce((total, goal) => {
    if (goal.goal_type === 'one_time') {
      const monthsSpan = differenceInMonths(
        new Date(goal.period_end || new Date()),
        new Date(goal.period_start)
      );
      return total + (goal.target_amount / Math.max(1, monthsSpan));
    }
    
    return total + (goal.recurring_amount || 0);
  }, 0);
}

function calculateAmounts(goals: SavingsGoal[]): { currentAmount: number; expectedAmount: number } {
  const now = new Date();
  
  return goals.reduce(
    (acc, goal) => {
      const start = new Date(goal.period_start);
      const end = goal.period_end ? new Date(goal.period_end) : now;
      const totalMonths = differenceInMonths(end, start) || 1;
      const elapsedMonths = differenceInMonths(now, start) || 1;
      
      if (goal.goal_type === 'one_time') {
        const expectedProgress = elapsedMonths / totalMonths;
        acc.expectedAmount += goal.target_amount * expectedProgress;
        acc.currentAmount += goal.target_amount * (goal.progress / 100);
      } else {
        acc.expectedAmount += (goal.recurring_amount || 0) * elapsedMonths;
        acc.currentAmount += (goal.recurring_amount || 0) * elapsedMonths * (goal.progress / 100);
      }
      
      return acc;
    },
    { currentAmount: 0, expectedAmount: 0 }
  );
}

function calculateOverallProgress(goals: SavingsGoal[]): number {
  if (!goals.length) return 0;
  
  const totalWeight = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const weightedProgress = goals.reduce((sum, goal) => {
    const weight = goal.target_amount / totalWeight;
    return sum + goal.progress * weight;
  }, 0);
  
  return weightedProgress;
}

function calculateProjectedEndAmount(goals: SavingsGoal[]): number {
  return goals.reduce((total, goal) => {
    if (goal.goal_type === 'one_time') {
      return total + goal.target_amount;
    }
    
    const end = goal.period_end ? new Date(goal.period_end) : new Date();
    const start = new Date(goal.period_start);
    const months = differenceInMonths(end, start) || 1;
    
    return total + ((goal.recurring_amount || 0) * months);
  }, 0);
}

export function calculateProjections(monthlyData: MonthlySavingsData[]): SavingsProjection[] {
  // Simple linear projection for the next 3 months
  const projections: SavingsProjection[] = [];
  if (monthlyData.length < 2) return projections;

  const lastThreeMonths = monthlyData.slice(-3);
  const averageChange = lastThreeMonths.reduce((sum, month, index, array) => {
    if (index === 0) return sum;
    return sum + (month.amount - array[index - 1].amount);
  }, 0) / (lastThreeMonths.length - 1);

  const lastMonth = monthlyData[monthlyData.length - 1];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lastMonthIndex = months.indexOf(lastMonth.month.slice(0, 3));

  for (let i = 1; i <= 3; i++) {
    const monthIndex = (lastMonthIndex + i) % 12;
    const projectedAmount = lastMonth.amount + (averageChange * i);
    
    projections.push({
      month: months[monthIndex],
      projectedAmount: Math.max(0, projectedAmount),
      confidenceScore: Math.max(0, 1 - (i * 0.2)) // Confidence decreases with time
    });
  }

  return projections;
} 