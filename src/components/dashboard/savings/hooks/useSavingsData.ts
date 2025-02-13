
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfYear, format, addMonths } from "date-fns";
import type { SavingsChartData, MonthlySavingsData } from "@/types/savings";
import { calculateTrendIndicator, calculateProjections } from "../utils/calculations";

async function fetchSavingsData(): Promise<SavingsChartData> {
  // Check authentication first
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error("Authentication error:", authError);
    throw new Error("Authentication failed");
  }

  if (!user) {
    console.error("No active user");
    throw new Error("Not authenticated");
  }

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
      averageMonthlySavings: 0,
      projections: []
    };
  }

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
    monthlyData.push({
      month,
      amount,
      trend_indicator: calculateTrendIndicator(amount, previousAmount),
      is_negative: amount < 0
    });

    previousAmount = amount;
  });

  const yearTotal = monthlyData.reduce((sum, month) => sum + month.amount, 0);
  const averageMonthlySavings = yearTotal / monthlyData.length || 0;

  // Calculate projections based on historical data
  const projections = calculateProjections(monthlyData);

  return { 
    monthlyData, 
    yearTotal,
    averageMonthlySavings,
    projections
  };
}

export function useSavingsData() {
  return useQuery({
    queryKey: ["savings-trend"],
    queryFn: fetchSavingsData,
  });
}
