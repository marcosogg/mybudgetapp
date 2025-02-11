
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Budget } from "./types";
import { useMonth } from "@/contexts/MonthContext";
import { format } from "date-fns";

export function useBudgets() {
  const { selectedMonth } = useMonth();
  const formattedDate = format(selectedMonth, "yyyy-MM-dd");

  return useQuery({
    queryKey: ["budgets", formattedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budgets")
        .select(`
          *,
          category:categories(*)
        `)
        .eq("period", formattedDate)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Budget[];
    },
  });
}
