import { differenceInMonths, differenceInDays, startOfMonth, endOfMonth } from "date-fns";
import type { 
  SavingsGoal, 
  SavingsProgress, 
  MonthlySavingsData,
  SavingsProjection 
} from "@/types/savings";
import { SAVINGS_CONSTANTS } from "./constants";

interface Transaction {
  date: string;
  amount: number;
}

/**
 * Calculate the expected progress amount based on goal type and current date
 */
export function calculateExpectedProgress(
  goal: SavingsGoal,
  currentDate: Date = new Date()
): number {
  const startDate = new Date(goal.period_start);
  
  switch (goal.goal_type) {
    case "one_time": {
      if (!goal.period_end) throw new Error("One-time goal must have an end date");
      const endDate = new Date(goal.period_end);
      const totalDays = differenceInDays(endDate, startDate);
      const elapsedDays = differenceInDays(currentDate, startDate);
      return (goal.target_amount / totalDays) * elapsedDays;
    }
    
    case "recurring_monthly": {
      if (!goal.recurring_amount) throw new Error("Monthly goal must have a recurring amount");
      const monthsElapsed = differenceInMonths(currentDate, startDate);
      return goal.recurring_amount * monthsElapsed;
    }
    
    case "recurring_yearly": {
      if (!goal.recurring_amount) throw new Error("Yearly goal must have a recurring amount");
      const monthsElapsed = differenceInMonths(currentDate, startDate);
      return (goal.recurring_amount / 12) * monthsElapsed;
    }
  }
}

/**
 * Calculate savings progress including current amount, expected amount, and progress percentage
 */
export function calculateSavingsProgress(
  goal: SavingsGoal,
  transactions: Transaction[],
  currentDate: Date = new Date()
): SavingsProgress {
  // Calculate current savings amount
  const currentAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Calculate expected progress
  const expectedAmount = calculateExpectedProgress(goal, currentDate);
  
  // Calculate percentage and on-track status
  const percentage = expectedAmount > 0 
    ? (currentAmount / expectedAmount) * 100 
    : 0;
    
  const isOnTrack = percentage >= SAVINGS_CONSTANTS.PROGRESS_THRESHOLDS.ON_TRACK;

  // Calculate projection for end amount
  const projectionEndAmount = calculateProjectedEndAmount(goal, transactions);

  return {
    current_amount: currentAmount,
    expected_amount: expectedAmount,
    percentage,
    is_on_track: isOnTrack,
    projection_end_amount: projectionEndAmount
  };
}

/**
 * Calculate monthly savings data for charts and analysis
 */
export function calculateMonthlySavingsData(
  transactions: Transaction[],
  goal: SavingsGoal
): MonthlySavingsData[] {
  const monthlyData: MonthlySavingsData[] = [];
  let previousAmount = 0;

  // Group transactions by month
  const monthlyAmounts = transactions.reduce((acc: { [key: string]: number }, transaction) => {
    const month = startOfMonth(new Date(transaction.date)).toISOString();
    acc[month] = (acc[month] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {});

  // Calculate monthly goal amount based on goal type
  const getMonthlyGoalAmount = () => {
    switch (goal.goal_type) {
      case "recurring_monthly":
        return goal.recurring_amount || 0;
      case "recurring_yearly":
        return (goal.recurring_amount || 0) / 12;
      case "one_time": {
        if (!goal.period_end) return 0;
        const totalMonths = differenceInMonths(new Date(goal.period_end), new Date(goal.period_start));
        return totalMonths > 0 ? goal.target_amount / totalMonths : goal.target_amount;
      }
    }
  };

  const monthlyGoalAmount = getMonthlyGoalAmount();

  // Create monthly data entries
  Object.entries(monthlyAmounts).forEach(([month, amount]) => {
    const percentageOfGoal = monthlyGoalAmount > 0 
      ? (amount / monthlyGoalAmount) * 100 
      : 0;

    monthlyData.push({
      month: new Date(month).toLocaleDateString('en-US', { month: 'short' }),
      amount,
      goal_amount: monthlyGoalAmount,
      percentage_of_goal: percentageOfGoal,
      trend_indicator: calculateTrendIndicator(amount, previousAmount),
      is_negative: amount < 0
    });

    previousAmount = amount;
  });

  return monthlyData;
}

/**
 * Calculate trend indicator based on current and previous amounts
 */
export function calculateTrendIndicator(
  current: number,
  previous: number
): 'up' | 'down' | 'stable' {
  const difference = current - previous;
  if (Math.abs(difference) < SAVINGS_CONSTANTS.CHART_SETTINGS.TREND_THRESHOLD) {
    return 'stable';
  }
  return difference > 0 ? 'up' : 'down';
}

/**
 * Calculate projected end amount based on current savings trend
 */
function calculateProjectedEndAmount(
  goal: SavingsGoal,
  transactions: Transaction[]
): number | undefined {
  if (goal.goal_type === 'one_time' && goal.period_end) {
    const monthlyData = calculateMonthlySavingsData(transactions, goal);
    
    if (monthlyData.length < SAVINGS_CONSTANTS.PROJECTION_SETTINGS.MIN_MONTHS_FOR_PROJECTION) {
      return undefined;
    }

    // Calculate average monthly savings from recent months
    const recentMonths = monthlyData.slice(-3);
    const avgMonthlySavings = recentMonths.reduce((sum, month) => sum + month.amount, 0) / recentMonths.length;

    // Calculate remaining months until goal end
    const remainingMonths = differenceInMonths(new Date(goal.period_end), new Date());

    // Calculate current total
    const currentTotal = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Project final amount
    return currentTotal + (avgMonthlySavings * remainingMonths);
  }

  return undefined;
} 