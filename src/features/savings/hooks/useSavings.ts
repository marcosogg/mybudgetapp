import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SavingsGoal, SavingsGoalFormValues } from "../types/savings";
import { calculateSavingsMetrics } from "../utils/calculations";

const SAVINGS_KEYS = {
  all: ["savings"] as const,
  goals: () => [...SAVINGS_KEYS.all, "goals"] as const,
  goal: (id: string) => [...SAVINGS_KEYS.goals(), id] as const,
  metrics: () => [...SAVINGS_KEYS.all, "metrics"] as const,
};

export function useSavings() {
  const queryClient = useQueryClient();

  // Fetch all savings goals
  const { data: goals = [], isLoading: isLoadingGoals } = useQuery({
    queryKey: SAVINGS_KEYS.goals(),
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SavingsGoal[];
    },
  });

  // Calculate metrics with caching
  const { data: metrics } = useQuery({
    queryKey: SAVINGS_KEYS.metrics(),
    queryFn: () => calculateSavingsMetrics(goals),
    enabled: goals.length > 0,
  });

  // Create goal mutation
  const createGoal = useMutation({
    mutationFn: async (values: SavingsGoalFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("savings_goals")
        .insert([{
          user_id: user.id,
          ...values,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(SAVINGS_KEYS.goals());
    },
  });

  // Update goal mutation
  const updateGoal = useMutation({
    mutationFn: async ({ id, ...values }: SavingsGoalFormValues & { id: string }) => {
      const { error } = await supabase
        .from("savings_goals")
        .update(values)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(SAVINGS_KEYS.goal(variables.id));
      queryClient.invalidateQueries(SAVINGS_KEYS.goals());
    },
  });

  // Delete goal mutation
  const deleteGoal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("savings_goals")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(SAVINGS_KEYS.goals());
    },
  });

  return {
    goals,
    metrics,
    isLoadingGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
} 