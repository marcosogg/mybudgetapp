export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      budgets: {
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
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      mappings: {
        Row: {
          id: string
          user_id: string
          category_id: string
          description_keyword: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          description_keyword: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          description_keyword?: string
          created_at?: string
        }
      }
      profiles: {
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
      reminders: {
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
      savings_goals: {
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
      transactions: {
        Row: {
          id: string
          user_id: string
          category_id: string
          amount: number
          date: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          amount: number
          date: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          amount?: number
          date?: string
          description?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
