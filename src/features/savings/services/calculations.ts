
import { differenceInMonths, differenceInDays } from "date-fns";
import type { SavingsGoal, SavingsProgress } from "../types/goal";
import { SAVINGS_CONSTANTS } from "../utils/constants";

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

  return {
    current_amount: currentAmount,
    expected_amount: expectedAmount,
    percentage,
    is_on_track: isOnTrack
  };
}
