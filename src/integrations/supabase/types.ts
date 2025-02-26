export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      budgets: {
        Row: {
          amount: number
          category_id: string
          created_at: string | null
          id: string
          period: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id: string
          created_at?: string | null
          id?: string
          period: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string
          created_at?: string | null
          id?: string
          period?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mappings: {
        Row: {
          category_id: string
          created_at: string | null
          description_keyword: string
          id: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description_keyword: string
          id?: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description_keyword?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mappings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_income: {
        Row: {
          bonus: number
          created_at: string
          id: string
          month: string
          salary: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bonus?: number
          created_at?: string
          id?: string
          month: string
          salary?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bonus?: number
          created_at?: string
          id?: string
          month?: string
          salary?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_income_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          email_notifications_enabled: boolean | null
          id: string
          intercom_enabled: boolean | null
          name: string | null
          statement_format:
            | Database["public"]["Enums"]["statement_format"]
            | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          email_notifications_enabled?: boolean | null
          id: string
          intercom_enabled?: boolean | null
          name?: string | null
          statement_format?:
            | Database["public"]["Enums"]["statement_format"]
            | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_notifications_enabled?: boolean | null
          id?: string
          intercom_enabled?: boolean | null
          name?: string | null
          statement_format?:
            | Database["public"]["Enums"]["statement_format"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string
          id: string
          is_recurring: boolean
          name: string
          parent_reminder_id: string | null
          recurrence: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date: string
          id?: string
          is_recurring?: boolean
          name: string
          parent_reminder_id?: string | null
          recurrence: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string
          id?: string
          is_recurring?: boolean
          name?: string
          parent_reminder_id?: string | null
          recurrence?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_parent_reminder_id_fkey"
            columns: ["parent_reminder_id"]
            isOneToOne: false
            referencedRelation: "reminders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_goals: {
        Row: {
          created_at: string
          id: string
          name: string
          target_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          target_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          target_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      savings_goals_backup: {
        Row: {
          created_at: string | null
          goal_type: string | null
          id: string | null
          name: string | null
          notes: string | null
          period_end: string | null
          period_start: string | null
          progress: number | null
          recurring_amount: number | null
          target_amount: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          goal_type?: string | null
          id?: string | null
          name?: string | null
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          progress?: number | null
          recurring_amount?: number | null
          target_amount?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          goal_type?: string | null
          id?: string | null
          name?: string | null
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          progress?: number | null
          recurring_amount?: number | null
          target_amount?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          tags: string[] | null
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          tags?: string[] | null
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          tags?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_budget_comparison: {
        Args: {
          p_user_id: string
          p_period: string
        }
        Returns: {
          category_id: string
          category_name: string
          planned_amount: number
          actual_amount: number
          variance: number
        }[]
      }
      get_monthly_budget_comparison: {
        Args: {
          p_user_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          month: string
          planned_total: number
          actual_total: number
        }[]
      }
    }
    Enums: {
      statement_format: "revolut" | "wise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
