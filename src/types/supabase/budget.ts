
import type { Json } from "./json";

export interface BudgetTable {
  Row: {
    id: string
    user_id: string
    category_id: string
    amount: number
    period: string
    created_at: string
  }
  Insert: {
    id?: string
    user_id: string
    category_id: string
    amount: number
    period: string
    created_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    category_id?: string
    amount?: number
    period?: string
    created_at?: string
  }
}
