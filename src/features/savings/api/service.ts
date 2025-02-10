import { supabaseClient } from "@/integrations/supabase/client";
import type { 
  SavingsGoal, 
  SavingsState,
  MonthlySavingsData,
  SavingsMetrics,
  SavingsGoalFormValues
} from "../types/savings";
import { calculateSavingsMetrics, calculateProjections } from "../utils/calculations";

export class SavingsService {
  private static instance: SavingsService;
  
  private constructor() {}
  
  static getInstance(): SavingsService {
    if (!SavingsService.instance) {
      SavingsService.instance = new SavingsService();
    }
    return SavingsService.instance;
  }

  async getState(): Promise<SavingsState> {
    const [currentGoal, goals, monthlyData] = await Promise.all([
      this.getCurrentGoal(),
      this.getAllGoals(),
      this.getMonthlySavings()
    ]);

    const metrics = calculateSavingsMetrics(monthlyData);
    const projections = calculateProjections(monthlyData);

    return {
      currentGoal,
      goals,
      monthlyData,
      projections,
      metrics
    };
  }

  async getCurrentGoal(): Promise<SavingsGoal | null> {
    const { data, error } = await supabaseClient
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching current savings goal:', error);
      return null;
    }

    return data ? this.transformGoalData(data) : null;
  }

  async getMonthlySavings(): Promise<MonthlySavingsData[]> {
    const { data, error } = await supabaseClient
      .from('monthly_savings')
      .select('*')
      .order('month', { ascending: true });

    if (error) {
      console.error('Error fetching monthly savings:', error);
      return [];
    }

    return data ? this.transformMonthlyData(data) : [];
  }

  async getAllGoals(): Promise<SavingsGoal[]> {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabaseClient
      .from('savings_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching savings goals:', error);
      return [];
    }

    return data ? data.map(this.transformGoalData) : [];
  }

  async createGoal(values: SavingsGoalFormValues): Promise<SavingsGoal> {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabaseClient
      .from('savings_goals')
      .insert({
        user_id: user.id,
        goal_type: values.type,
        target_amount: parseFloat(values.targetAmount),
        recurring_amount: values.recurringAmount ? parseFloat(values.recurringAmount) : null,
        period_start: values.periodStart.toISOString(),
        period_end: values.periodEnd?.toISOString() || null,
        notes: values.notes
      })
      .select()
      .single();

    if (error) throw error;
    return this.transformGoalData(data);
  }

  async updateGoal(goalId: string, values: SavingsGoalFormValues): Promise<SavingsGoal> {
    const { data, error } = await supabaseClient
      .from('savings_goals')
      .update({
        goal_type: values.type,
        target_amount: parseFloat(values.targetAmount),
        recurring_amount: values.recurringAmount ? parseFloat(values.recurringAmount) : null,
        period_start: values.periodStart.toISOString(),
        period_end: values.periodEnd?.toISOString() || null,
        notes: values.notes
      })
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;
    return this.transformGoalData(data);
  }

  async deleteGoal(goalId: string): Promise<void> {
    const { error } = await supabaseClient
      .from('savings_goals')
      .delete()
      .eq('id', goalId);

    if (error) throw error;
  }

  async endGoal(goalId: string): Promise<SavingsGoal> {
    const { data, error } = await supabaseClient
      .from('savings_goals')
      .update({
        period_end: new Date().toISOString()
      })
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;
    return this.transformGoalData(data);
  }

  private transformGoalData(data: any): SavingsGoal {
    return {
      id: data.id,
      userId: data.user_id,
      type: data.goal_type,
      targetAmount: data.target_amount,
      recurringAmount: data.recurring_amount,
      periodStart: new Date(data.period_start),
      periodEnd: data.period_end ? new Date(data.period_end) : undefined,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      progress: data.progress
    };
  }

  private transformMonthlyData(data: any[]): MonthlySavingsData[] {
    return data.map(item => ({
      month: item.month,
      amount: item.amount,
      goalAmount: item.goal_amount,
      percentageOfGoal: item.percentage_of_goal,
      trendIndicator: item.trend_indicator,
      isNegative: item.amount < 0
    }));
  }
} 