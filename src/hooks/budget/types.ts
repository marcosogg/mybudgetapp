
import { Category } from "@/components/categories/types";

/**
 * Represents a budget entry in the system
 * Links a category with a monetary amount for a specific period
 */
export interface Budget {
  /** Unique identifier for the budget entry */
  id: string;
  /** ID of the associated category */
  category_id: string;
  /** Optional category details */
  category?: Category;
  /** Budget amount in the system's currency */
  amount: number;
  /** Budget period in YYYY-MM format */
  period: string;
}

/**
 * Input type for creating a new budget
 * Omits the ID as it will be generated by the backend
 */
export interface CreateBudgetInput {
  category_id: string;
  amount: number;
  period: string;
}

