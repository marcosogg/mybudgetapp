
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMonth } from "@/contexts/MonthContext";
import { format } from "date-fns";

interface BudgetComparison {
  category_id: string;
  category_name: string;
  planned_amount: number;
  actual_amount: number;
  variance: number;
}

export function useBudgetComparison() {
  const { selectedMonth } = useMonth();
  const formattedDate = format(selectedMonth, "yyyy-MM-dd");

  return useQuery({
    queryKey: ["budgetComparison", formattedDate],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<BudgetComparison[]>(
        "get-budget-comparison",
        {
          body: { period: formattedDate },
        }
      );

      if (error) throw error;
      return data;
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
}
