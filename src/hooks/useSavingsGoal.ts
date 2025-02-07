import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SavingsGoal, SavingsProgress, SavingsGoalFormValues } from "@/types/savings";
import { SavingsGoalService } from "@/lib/savings/savingsGoalService";
import { toast } from "sonner";

const savingsGoalService = new SavingsGoalService();

export function useSavingsGoal() {
  const queryClient = useQueryClient();

  // Query current goal
  const { 
    data: currentGoal,
    isLoading: isLoadingGoal,
    error: goalError 
  } = useQuery<SavingsGoal | null>({
    queryKey: ['current-savings-goal'],
    queryFn: () => savingsGoalService.getCurrentGoal()
  });

  // Query goal progress
  const {
    data: progress,
    isLoading: isLoadingProgress,
    error: progressError
  } = useQuery<SavingsProgress>({
    queryKey: ['savings-progress', currentGoal?.id],
    queryFn: () => currentGoal ? savingsGoalService.getGoalProgress(currentGoal.id) : null,
    enabled: !!currentGoal
  });

  // Create goal mutation
  const createGoal = useMutation({
    mutationFn: async (values: SavingsGoalFormValues) => {
      const goalData = {
        goal_type: values.goal_type,
        target_amount: parseFloat(values.target_amount),
        recurring_amount: values.recurring_amount ? parseFloat(values.recurring_amount) : undefined,
        period_start: values.period_start,
        period_end: values.period_end,
        notes: values.notes
      };

      return savingsGoalService.createGoal(goalData);
    },
    onSuccess: () => {
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
    mutationFn: async ({ id, values }: { id: string; values: Partial<SavingsGoalFormValues> }) => {
      const updates: any = {};
      
      if (values.goal_type) updates.goal_type = values.goal_type;
      if (values.target_amount) updates.target_amount = parseFloat(values.target_amount);
      if (values.recurring_amount) updates.recurring_amount = parseFloat(values.recurring_amount);
      if (values.period_start) updates.period_start = values.period_start;
      if (values.period_end) updates.period_end = values.period_end;
      if (values.notes !== undefined) updates.notes = values.notes;

      return savingsGoalService.updateGoal(id, updates);
    },
    onSuccess: () => {
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
      return savingsGoalService.updateGoal(currentGoal.id, {
        period_end: new Date()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-savings-goal'] });
      toast.success("Savings goal ended successfully");
    },
    onError: (error) => {
      console.error("Error ending savings goal:", error);
      toast.error("Failed to end savings goal");
    }
  });

  return {
    // Queries
    currentGoal,
    progress,
    isLoading: isLoadingGoal || isLoadingProgress,
    error: goalError || progressError,

    // Mutations
    createGoal,
    updateGoal,
    endCurrentGoal,
  };
} 