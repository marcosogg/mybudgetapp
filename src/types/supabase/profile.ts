
import type { Json } from "./json";

export interface ProfileTable {
  Row: {
    id: string
    user_id: string
    name: string
    email: string
    created_at: string
    updated_at: string
    email_notifications_enabled: boolean
    statement_format: "revolut" | "wise"
    salary: number
    bonus: number
  }
  Insert: {
    id?: string
    user_id: string
    name: string
    email: string
    created_at?: string
    updated_at?: string
    email_notifications_enabled?: boolean
    statement_format?: "revolut" | "wise"
    salary?: number
    bonus?: number
  }
  Update: {
    id?: string
    user_id?: string
    name?: string
    email?: string
    created_at?: string
    updated_at?: string
    email_notifications_enabled?: boolean
    statement_format?: "revolut" | "wise"
    salary?: number
    bonus?: number
  }
}
