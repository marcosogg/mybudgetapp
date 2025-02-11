
export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: Date;
  created_at?: Date;
}

export interface BudgetWithCategory extends Budget {
  category: {
    name: string;
  };
}

export interface BudgetComparison {
  category_id: string;
  category_name: string;
  planned_amount: number;
  actual_amount: number;
  variance: number;
}

export interface MonthlyBudgetMetrics {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  spendingPercentage: number;
  isOverBudget: boolean;
}
