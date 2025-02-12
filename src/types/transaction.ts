export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  description: string;
  amount: number;
  category_id: string | null;
  tags: string[] | null;
  savings_goal_id: string | null;
  category?: {
    name: string;
  } | null;
}

// Transaction form types
export interface TransactionFormValues {
  date: string;
  description: string;
  amount: string;
  category_id?: string;
  tags?: string[];
  savings_goal_id?: string | null;
}

// Utility type for transaction statistics
export interface TransactionStats {
  count: number;
  total: number;
  average: number;
  categoryBreakdown: CategoryBreakdown[];
}

interface CategoryBreakdown {
  category_id: string;
  category_name: string;
  total: number;
  count: number;
  percentage: number;
}
