
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transaction";
import { startOfMonth, endOfMonth } from "date-fns";

interface UseTransactionsProps {
  selectedMonth: Date;
}

export const useTransactions = ({ selectedMonth }: UseTransactionsProps) => {
  return useQuery({
    queryKey: ["transactions", selectedMonth.toISOString()],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const startDate = startOfMonth(selectedMonth).toISOString();
      const endDate = endOfMonth(selectedMonth).toISOString();

      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          category:categories(name)
        `)
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });
};
