
import { supabase } from "@/integrations/supabase/client";
import type { Budget, BudgetComparison } from "../types/budget";
import { format } from "date-fns";

export class BudgetService {
  async getBudgets(period: Date): Promise<Budget[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const formattedPeriod = format(period, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from("budgets")
      .select(`
        *,
        category:categories(name)
      `)
      .eq("user_id", user.id)
      .eq("period", formattedPeriod);

    if (error) throw error;
    return data;
  }

  async createBudget(budget: Omit<Budget, 'id' | 'user_id' | 'created_at'>): Promise<Budget> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("budgets")
      .insert({
        user_id: user.id,
        category_id: budget.category_id,
        amount: budget.amount,
        period: format(budget.period, 'yyyy-MM-dd')
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateBudget(id: string, updates: Partial<Omit<Budget, 'id' | 'user_id' | 'created_at'>>): Promise<Budget> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("budgets")
      .update({
        ...updates,
        period: updates.period ? format(updates.period, 'yyyy-MM-dd') : undefined
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteBudget(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("budgets")
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  async getBudgetComparison(period: Date): Promise<BudgetComparison[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .rpc('get_budget_comparison', {
        p_user_id: user.id,
        p_period: format(period, 'yyyy-MM-dd')
      });

    if (error) throw error;
    return data;
  }
}
