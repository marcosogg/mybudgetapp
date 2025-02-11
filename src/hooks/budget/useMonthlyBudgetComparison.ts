
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfYear, addMonths } from "date-fns";

interface MonthlyComparison {
  month: string;
  planned_total: number;
  actual_total: number;
}

export function useMonthlyBudgetComparison() {
  return useQuery({
    queryKey: ['monthlyBudgetComparison'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const startDate = startOfYear(new Date());
      const endDate = addMonths(startDate, 11); // Get full year of data

      const { data, error } = await supabase
        .rpc('get_monthly_budget_comparison', {
          p_user_id: user.id,
          p_start_date: startDate.toISOString(),
          p_end_date: endDate.toISOString()
        });

      if (error) throw error;
      return data as MonthlyComparison[];
    }
  });
}
