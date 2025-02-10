import { SAVINGS_CONSTANTS } from "../constants/savings";
import type { TrendIndicator } from "../constants/savings";
import type { MonthlySavingsData, SavingsMetrics, SavingsProjection, SavingsGoal } from "../types/savings";
import { 
  differenceInMonths, 
  differenceInYears, 
  startOfMonth, 
  endOfMonth,
  startOfYear,
  endOfYear,
  isAfter,
  isBefore,
  isSameMonth,
  isSameYear
} from "date-fns";

export function calculateTrendIndicator(current: number, previous: number): TrendIndicator {
  const difference = current - previous;
  if (Math.abs(difference) < SAVINGS_CONSTANTS.TRENDS.THRESHOLD) {
    return SAVINGS_CONSTANTS.TRENDS.INDICATORS.STABLE;
  }
  return difference > 0 ? SAVINGS_CONSTANTS.TRENDS.INDICATORS.UP : SAVINGS_CONSTANTS.TRENDS.INDICATORS.DOWN;
}

export function calculateSavingsMetrics(goals: SavingsGoal[]): SavingsMetrics {
  const activeGoals = goals.filter(goal => {
    if (goal.goal_type === 'one_time') return true;
    const now = new Date();
    if (goal.goal_type === 'recurring_monthly') {
      return isSameMonth(goal.period_start!, now) || isAfter(goal.period_start!, now);
    }
    if (goal.goal_type === 'recurring_yearly') {
      return isSameYear(goal.period_start!, now) || isAfter(goal.period_start!, now);
    }
    return false;
  });
  
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
  const now = new Date();
  
  return goals.reduce((total, goal) => {
    switch (goal.goal_type) {
      case 'one_time':
        return total + goal.target_amount;
      case 'recurring_monthly':
        const monthsRemaining = 12 - now.getMonth();
        return total + ((goal.recurring_amount || 0) * monthsRemaining);
      case 'recurring_yearly':
        return total + (goal.recurring_amount || 0);
      default:
        return total;
    }
  }, 0);
}

function calculateAverageMonthlySavings(goals: SavingsGoal[]): number {
  return goals.reduce((total, goal) => {
    switch (goal.goal_type) {
      case 'one_time':
        return total + (goal.target_amount / 12); // Spread over a year
      case 'recurring_monthly':
        return total + (goal.recurring_amount || 0);
      case 'recurring_yearly':
        return total + ((goal.recurring_amount || 0) / 12);
      default:
        return total;
    }
  }, 0);
}

function calculateAmounts(goals: SavingsGoal[]): { currentAmount: number; expectedAmount: number } {
  const now = new Date();
  
  return goals.reduce(
    (acc, goal) => {
      switch (goal.goal_type) {
        case 'one_time':
          acc.expectedAmount += goal.target_amount;
          acc.currentAmount += goal.target_amount * (goal.progress / 100);
          break;
        case 'recurring_monthly':
          if (goal.period_start) {
            const monthsSinceStart = differenceInMonths(now, goal.period_start);
            const expectedMonths = Math.max(0, monthsSinceStart + 1);
            acc.expectedAmount += (goal.recurring_amount || 0) * expectedMonths;
            acc.currentAmount += (goal.recurring_amount || 0) * expectedMonths * (goal.progress / 100);
          }
          break;
        case 'recurring_yearly':
          if (goal.period_start) {
            const yearsSinceStart = differenceInYears(now, goal.period_start);
            const expectedYears = Math.max(0, yearsSinceStart + 1);
            acc.expectedAmount += (goal.recurring_amount || 0) * expectedYears;
            acc.currentAmount += (goal.recurring_amount || 0) * expectedYears * (goal.progress / 100);
          }
          break;
      }
      return acc;
    },
    { currentAmount: 0, expectedAmount: 0 }
  );
}

function calculateOverallProgress(goals: SavingsGoal[]): number {
  if (!goals.length) return 0;
  
  const totalWeight = goals.reduce((sum, goal) => {
    switch (goal.goal_type) {
      case 'one_time':
        return sum + goal.target_amount;
      case 'recurring_monthly':
      case 'recurring_yearly':
        return sum + (goal.recurring_amount || 0);
    }
  }, 0);

  if (totalWeight === 0) return 0;
  
  const weightedProgress = goals.reduce((sum, goal) => {
    let weight;
    switch (goal.goal_type) {
      case 'one_time':
        weight = goal.target_amount / totalWeight;
        break;
      case 'recurring_monthly':
      case 'recurring_yearly':
        weight = (goal.recurring_amount || 0) / totalWeight;
        break;
      default:
        weight = 0;
    }
    return sum + (goal.progress * weight);
  }, 0);
  
  return weightedProgress;
}

function calculateProjectedEndAmount(goals: SavingsGoal[]): number {
  const now = new Date();
  
  return goals.reduce((total, goal) => {
    switch (goal.goal_type) {
      case 'one_time':
        return total + goal.target_amount;
      case 'recurring_monthly':
        if (goal.period_start) {
          const monthsRemaining = 12 - differenceInMonths(now, goal.period_start);
          return total + ((goal.recurring_amount || 0) * monthsRemaining);
        }
        return total;
      case 'recurring_yearly':
        if (goal.period_start) {
          const yearsRemaining = 1 - differenceInYears(now, goal.period_start);
          return total + ((goal.recurring_amount || 0) * yearsRemaining);
        }
        return total;
      default:
        return total;
    }
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