import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateBudgetInput } from "./types";
import { toast } from "sonner";

export function useBudgetSubmit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budget: CreateBudgetInput) => {
      const { error } = await supabase.from("budgets").insert(budget);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add budget");
      console.error("Error adding budget:", error);
    },
  });
}