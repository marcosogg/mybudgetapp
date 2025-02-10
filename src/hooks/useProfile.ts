import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMonth } from "@/contexts/MonthContext";
import { startOfMonth, format } from "date-fns";

interface Profile {
  id: string;
  email: string;
  name: string | null;
  statement_format: "revolut" | "wise";
  created_at: string;
  updated_at: string;
}

interface MonthlyIncome {
  id: string;
  user_id: string;
  month: string;
  salary: number;
  bonus: number;
  created_at: string;
  updated_at: string;
}

interface ProfileWithIncome extends Profile {
  monthlyIncome?: MonthlyIncome;
}

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { selectedMonth } = useMonth();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  const { data: monthlyIncome, isLoading: isIncomeLoading } = useQuery({
    queryKey: ["monthly_income", selectedMonth],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const monthStart = startOfMonth(selectedMonth);
      const monthString = format(monthStart, "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("monthly_income")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", monthString)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned"
      return data as MonthlyIncome | null;
    },
  });

  const updateIncome = useMutation({
    mutationFn: async ({ salary, bonus }: { salary: number; bonus: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const monthStart = startOfMonth(selectedMonth);
      const monthString = format(monthStart, "yyyy-MM-dd");

      const { error } = await supabase
        .from("monthly_income")
        .upsert({
          user_id: user.id,
          month: monthString,
          salary,
          bonus,
        }, {
          onConflict: "user_id,month"
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly_income"] });
      toast.success("Income updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update income");
      console.error("Error updating income:", error);
    },
  });

  const isLoading = isProfileLoading || isIncomeLoading;

  return {
    profile: profile ? {
      ...profile,
      monthlyIncome,
    } : undefined,
    isLoading,
    updateIncome,
  };
};