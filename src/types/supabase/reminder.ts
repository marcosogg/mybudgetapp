
import type { Json } from "./json";

export interface ReminderTable {
  Row: {
    id: string
    user_id: string
    category_id: string
    amount: number
    created_at: string
    period: string
  }
  Insert: {
    id?: string
    user_id: string
    category_id: string
    amount: number
    created_at?: string
    period: string
  }
  Update: {
    id?: string
    user_id?: string
    category_id?: string
    amount?: number
    created_at?: string
    period?: string
  }
}
