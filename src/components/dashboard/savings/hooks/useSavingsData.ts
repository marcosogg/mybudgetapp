import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfYear, addMonths } from "date-fns";
import type { SavingsChartData, MonthlySavingsData, SavingsProjection } from "@/types/savings";
import type { Database } from "@/types/supabase";

type Tables = Database['public']['Tables'];
type SavingsGoalRow = Tables['savings_goals']['Row'];
type CategoryRow = Tables['categories']['Row'];
type TransactionRow = Tables['transactions']['Row'];

async function fetchSavingsData(): Promise<SavingsChartData> {
  // Check authentication first
  const { data: authData, error: authError } = await supabase.auth.getSession();
  
  if (authError) {
    console.error("Authentication error:", authError);
    throw new Error("Authentication failed");
  }

  if (!authData.session) {
    console.error("No active session");
    throw new Error("Not authenticated");
  }

  const user = authData.session.user;
  if (!user) throw new Error("User not authenticated");

  // Get the savings category ID
  const { data: savingsCategory } = await supabase
    .from("categories")
    .select("id")
    .eq("user_id", user.id)
    .eq("name", "Savings")
    .single();

  if (!savingsCategory) {
    return { 
      monthlyData: [], 
      yearTotal: 0,
      currentGoal: null,
      projections: [],
      averageMonthlySavings: 0,
      goalProgress: 0
    };
  }

  // Get current savings goal
  const { data: goalData, error: goalError } = await supabase
    .from("savings_goals")
    .select("id, user_id, target_amount, start_date, end_date, notes, created_at, goal_type, recurring_amount, period_start, period_end, status, priority, category")
    .eq("user_id", user.id)
    .is("end_date", null)
    .maybeSingle();

  if (goalError) {
    console.error("Error fetching savings goal:", goalError);
    return { 
      monthlyData: [], 
      yearTotal: 0,
      currentGoal: null,
      projections: [],
      averageMonthlySavings: 0,
      goalProgress: 0
    };
  }

  const currentGoal = goalData ? {
    id: goalData.id,
    user_id: goalData.user_id,
    goal_type: goalData.goal_type,
    target_amount: Number(goalData.target_amount),
    recurring_amount: goalData.recurring_amount ? Number(goalData.recurring_amount) : undefined,
    period_start: new Date(goalData.period_start),
    period_end: goalData.period_end ? new Date(goalData.period_end) : undefined,
    notes: goalData.notes,
    created_at: new Date(goalData.created_at),
    status: goalData.status,
    priority: goalData.priority,
    category: goalData.category
  } : null;

  // Get this year's savings data
  const startDate = startOfYear(new Date());
  const endDate = new Date();

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("date, amount")
    .eq("category_id", savingsCategory.id)
    .eq("user_id", user.id)
    .gte("date", format(startDate, "yyyy-MM-dd"))
    .lte("date", format(endDate, "yyyy-MM-dd"))
    .order("date", { ascending: true });

  if (error) throw error;

  // Ensure savings amounts are positive for deposits
  const processedTransactions = transactions?.map(t => ({
    ...t,
    amount: Math.abs(t.amount)
  }));

  // Group transactions by month with enhanced metrics
  const monthlyData: MonthlySavingsData[] = [];
  let previousAmount = 0;

  // Create a map of all months from start of year to current month
  const monthsMap: { [key: string]: number } = {};
  let currentDate = startOfYear(new Date());
  const now = new Date();
  
  while (currentDate <= now) {
    monthsMap[format(currentDate, "MMM")] = 0;
    currentDate = addMonths(currentDate, 1);
  }

  // Fill in actual transaction amounts
  const monthlyAmounts = processedTransactions?.reduce((acc: { [key: string]: number }, transaction) => {
    const month = format(new Date(transaction.date), "MMM");
    acc[month] = (acc[month] || 0) + transaction.amount;
    return acc;
  }, {...monthsMap}); // Start with all months initialized to 0

  Object.entries(monthlyAmounts || {}).forEach(([month, amount]) => {
    const monthlyGoalAmount = currentGoal ? currentGoal.target_amount / 12 : 0;
    
    monthlyData.push({
      month,
      amount,
      goal_amount: monthlyGoalAmount,
      percentage_of_goal: monthlyGoalAmount ? (amount / monthlyGoalAmount) * 100 : 0,
      trend_indicator: calculateTrendIndicator(amount, previousAmount),
      is_negative: amount < 0
    });

    previousAmount = amount;
  });

  const yearTotal = monthlyData.reduce((sum, month) => sum + month.amount, 0);
  const averageMonthlySavings = yearTotal / monthlyData.length || 0;
  const projections = calculateProjections(monthlyData);
  const goalProgress = currentGoal 
    ? (yearTotal / currentGoal.target_amount) * 100 
    : 0;

  return { 
    monthlyData, 
    yearTotal,
    currentGoal,
    projections,
    averageMonthlySavings,
    goalProgress
  };
}

export function useSavingsData() {
  return useQuery<SavingsChartData, Error>({
    queryKey: ["savings-trend"],
    queryFn: fetchSavingsData,
  });
}
