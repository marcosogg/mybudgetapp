
import type { Json } from "./json";
import type { BudgetTable } from "./budget";
import type { CategoryTable } from "./category";
import type { MappingTable } from "./mapping";
import type { ProfileTable } from "./profile";
import type { ReminderTable } from "./reminder";
import type { SavingsGoalTable } from "./savings";
import type { TransactionTable } from "./transaction";

export interface Database {
  public: {
    Tables: {
      budgets: BudgetTable
      categories: CategoryTable
      mappings: MappingTable
      profiles: ProfileTable
      reminders: ReminderTable
      savings_goals: SavingsGoalTable
      transactions: TransactionTable
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

export type { Json } from "./json";
export type { BudgetTable } from "./budget";
export type { CategoryTable } from "./category";
export type { MappingTable } from "./mapping";
export type { ProfileTable } from "./profile";
export type { ReminderTable } from "./reminder";
export type { SavingsGoalTable } from "./savings";
export type { TransactionTable } from "./transaction";
