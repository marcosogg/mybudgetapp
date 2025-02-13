
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SavingsGoal, SavingsProgress, SavingsGoalFormValues } from "@/types/savings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSavingsGoal() {
  const queryClient = useQueryClient();

  // Query current goal
  const { 
    data: currentGoal,
    isLoading: isLoadingGoal,
    error: goalError 
  } = useQuery({
    queryKey: ['current-savings-goal'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .maybeSingle();

      if (error) throw error;
      return data as SavingsGoal | null;
    }
  });

  // Calculate progress based on actual savings
  const {
    data: progress,
    isLoading: isLoadingProgress,
    error: progressError
  } = useQuery({
    queryKey: ['savings-progress', currentGoal?.id],
    queryFn: async () => {
      if (!currentGoal) return null;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get the savings category ID
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", "Savings")
        .maybeSingle();

      if (!category) return null;

      // Get total savings amount for this goal's tag
      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount")
        .eq("category_id", category.id)
        .eq("user_id", user.id)
        .contains('tags', [currentGoal.tag]);

      const currentAmount = transactions?.reduce(
        (sum, t) => sum + Math.abs(t.amount || 0),
        0
      ) || 0;

      const percentage = (currentAmount / currentGoal.target_amount) * 100;
      
      return {
        current_amount: currentAmount,
        expected_amount: currentGoal.target_amount,
        percentage,
        is_on_track: percentage >= 90
      } as SavingsProgress;
    },
    enabled: !!currentGoal
  });

  // Create goal mutation
  const createGoal = useMutation({
    mutationFn: async (values: SavingsGoalFormValues & { tag: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("savings_goals")
        .insert({
          user_id: user.id,
          name: values.name,
          target_amount: parseFloat(values.target_amount),
          notes: values.notes,
          tag: values.tag,
          progress: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['current-savings-goal'] });
      toast.success("Savings goal created successfully");
    },
    onError: (error) => {
      console.error("Error creating savings goal:", error);
      toast.error("Failed to create savings goal");
    }
  });

  // Update goal mutation
  const updateGoal = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: SavingsGoalFormValues & { tag: string } }) => {
      const { data, error } = await supabase
        .from("savings_goals")
        .update({
          name: values.name,
          target_amount: parseFloat(values.target_amount),
          notes: values.notes,
          tag: values.tag
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['current-savings-goal'] });
      toast.success("Savings goal updated successfully");
    },
    onError: (error) => {
      console.error("Error updating savings goal:", error);
      toast.error("Failed to update savings goal");
    }
  });

  // End current goal mutation
  const endCurrentGoal = useMutation({
    mutationFn: async () => {
      if (!currentGoal) throw new Error("No active goal to end");
      
      const { data, error } = await supabase
        .from("savings_goals")
        .delete()
        .eq('id', currentGoal.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['current-savings-goal'] });
      toast.success("Savings goal ended successfully");
    },
    onError: (error) => {
      console.error("Error ending savings goal:", error);
      toast.error("Failed to end savings goal");
    }
  });

  return {
    currentGoal,
    progress,
    isLoading: isLoadingGoal || isLoadingProgress,
    error: goalError || progressError,
    createGoal,
    updateGoal,
    endCurrentGoal,
  };
}
