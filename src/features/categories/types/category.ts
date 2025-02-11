
export interface Category {
  id: string;
  user_id: string;
  name: string;
  created_at?: Date;
}

export interface CategoryStats {
  id: string;
  name: string;
  transactionCount: number;
  totalSpent: number;
}

export interface CategoryFormData {
  name: string;
}
