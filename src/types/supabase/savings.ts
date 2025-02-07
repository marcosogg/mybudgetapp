
import type { Json } from "./json";

export interface SavingsGoalTable {
  Row: {
    id: string
    user_id: string
    target_amount: number
    recurring_amount: number | null
    period_start: string
    period_end: string | null
    notes: string | null
    created_at: string
    goal_type: string
    status: string
    priority: number
    category: string
  }
  Insert: {
    id?: string
    user_id: string
    target_amount: number
    recurring_amount?: number | null
    period_start: string
    period_end?: string | null
    notes?: string | null
    created_at?: string
    goal_type: string
    status?: string
    priority?: number
    category?: string
  }
  Update: {
    id?: string
    user_id?: string
    target_amount?: number
    recurring_amount?: number | null
    period_start?: string
    period_end?: string | null
    notes?: string | null
    created_at?: string
    goal_type?: string
    status?: string
    priority?: number
    category?: string
  }
}
