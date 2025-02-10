
import { supabase } from "@/integrations/supabase/client";
import type { SavingsGoal, SavingsProgress } from "@/types/savings";
import { calculateSavingsProgress } from "./calculations";
import { format } from "date-fns";

export class SavingsGoalService {
  /**
   * Create a new savings goal
   */
  async createGoal(
    goal: Omit<SavingsGoal, 'id' | 'created_at' | 'progress'>
  ): Promise<SavingsGoal> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // If this is a recurring goal, end any existing active goals of the same type
    if (goal.goal_type !== 'one_time') {
      await this.endActiveRecurringGoal(user.id, goal.goal_type);
    }

    const { data, error } = await supabase
      .from("savings_goals")
      .insert({
        user_id: user.id,
        name: goal.name,
        goal_type: goal.goal_type,
        target_amount: goal.target_amount,
        recurring_amount: goal.recurring_amount,
        period_start: goal.period_start ? format(goal.period_start, 'yyyy-MM-dd') : null,
        period_end: goal.period_end ? format(goal.period_end, 'yyyy-MM-dd') : null,
        notes: goal.notes
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapGoalFromDB(data);
  }

  /**
   * Update an existing savings goal
   */
  async updateGoal(
    id: string,
    goal: Partial<Omit<SavingsGoal, 'id' | 'created_at' | 'progress'>>
  ): Promise<SavingsGoal> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Format dates if they exist
    const updates: any = {
      ...goal,
      period_start: goal.period_start ? format(goal.period_start, 'yyyy-MM-dd') : undefined,
      period_end: goal.period_end ? format(goal.period_end, 'yyyy-MM-dd') : undefined
    };

    const { data, error } = await supabase
      .from("savings_goals")
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return this.mapGoalFromDB(data);
  }

  /**
   * Get the current active goal for a user
   */
  async getCurrentGoal(): Promise<SavingsGoal | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("savings_goals")
      .select("*")
      .eq("user_id", user.id)
      .is("period_end", null)
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapGoalFromDB(data) : null;
  }

  /**
   * Get progress for a specific goal
   */
  async getGoalProgress(goalId: string): Promise<SavingsProgress> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Get the goal
    const { data: goal, error: goalError } = await supabase
      .from("savings_goals")
      .select("*")
      .eq("id", goalId)
      .eq("user_id", user.id)
      .single();

    if (goalError) throw goalError;
    if (!goal) throw new Error("Goal not found");

    // Get savings transactions for the goal period
    const query = supabase
      .from("transactions")
      .select("date, amount")
      .eq("user_id", user.id)
      .eq("category_id", await this.getSavingsCategoryId(user.id))
      .order("date", { ascending: true });

    // Only add date filters if they exist
    if (goal.period_start) {
      query.gte("date", goal.period_start);
    }
    if (goal.period_end) {
      query.lte("date", goal.period_end);
    } else {
      // If no end date, use current date
      query.lte("date", new Date().toISOString());
    }

    const { data: transactions, error: txError } = await query;

    if (txError) throw txError;

    return calculateSavingsProgress(this.mapGoalFromDB(goal), transactions || []);
  }

  /**
   * End the currently active recurring goal of a specific type
   */
  private async endActiveRecurringGoal(userId: string, goalType: string): Promise<void> {
    const { error } = await supabase
      .from("savings_goals")
      .update({ period_end: format(new Date(), 'yyyy-MM-dd') })
      .eq("user_id", userId)
      .eq("goal_type", goalType)
      .is("period_end", null);

    if (error) throw error;
  }

  /**
   * Map database goal object to application goal object
   */
  private mapGoalFromDB(data: any): SavingsGoal {
    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      goal_type: data.goal_type,
      target_amount: Number(data.target_amount),
      recurring_amount: data.recurring_amount ? Number(data.recurring_amount) : undefined,
      period_start: data.period_start ? new Date(data.period_start) : undefined,
      period_end: data.period_end ? new Date(data.period_end) : undefined,
      notes: data.notes,
      created_at: new Date(data.created_at)
    };
  }

  /**
   * Get or create the savings category ID for a user
   */
  private async getSavingsCategoryId(userId: string): Promise<string> {
    // Get the savings category ID first
    const { data: existingCategory, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("user_id", userId)
      .eq("name", "Savings")
      .maybeSingle();

    if (categoryError) throw categoryError;

    if (existingCategory) {
      return existingCategory.id;
    }

    // Create the Savings category if it doesn't exist
    const { data: newCategory, error: createError } = await supabase
      .from("categories")
      .insert({ name: "Savings", user_id: userId })
      .select("id")
      .single();
        
    if (createError) throw createError;
    return newCategory.id;
  }
}
