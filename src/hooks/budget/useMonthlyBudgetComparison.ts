
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, subMonths, endOfMonth } from "date-fns";
import { useMonth } from "@/contexts/MonthContext";

interface MonthlyComparison {
  month: string;
  planned_total: number;
  actual_total: number;
}

export function useMonthlyBudgetComparison() {
  const { selectedMonth } = useMonth();
  
  // Get data for the selected month and 2 months prior
  const startDate = startOfMonth(subMonths(selectedMonth, 2));
  const endDate = endOfMonth(selectedMonth);

  return useQuery({
    queryKey: ['monthlyBudgetComparison', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log('Fetching budget comparison for date range:', {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      });

      const { data, error } = await supabase
        .rpc('get_monthly_budget_comparison', {
          p_user_id: user.id,
          p_start_date: startDate.toISOString(),
          p_end_date: endDate.toISOString()
        });

      if (error) {
        console.error('Error fetching budget comparison:', error);
        throw error;
      }

      console.log('Budget comparison data received:', data);
      return data as MonthlyComparison[];
    }
  });
}
