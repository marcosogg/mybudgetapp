
/**
 * Budget calculation utility functions
 */

import { Budget } from "@/hooks/budget/types";

/**
 * Calculate the total budget amount from an array of budgets
 */
export const calculateTotalBudget = (budgets: Budget[] = []): number => {
  return budgets.reduce((sum, budget) => sum + budget.amount, 0);
};

/**
 * Calculate the remaining budget based on total budget and monthly income
 */
export const calculateRemainingBudget = (totalBudget: number, monthlyIncome: number): number => {
  return monthlyIncome - totalBudget;
};

/**
 * Calculate budget as a percentage of monthly income
 */
export const calculateBudgetPercentage = (totalBudget: number, monthlyIncome: number): number => {
  return monthlyIncome > 0 ? (totalBudget / monthlyIncome) * 100 : 0;
};

/**
 * Calculate total spent amount from budget comparison data
 */
export const calculateTotalSpent = (
  comparison: Array<{ actual_amount: number }> = []
): number => {
  return comparison.reduce((sum, item) => sum + item.actual_amount, 0);
};

/**
 * Format currency value for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
