
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SavingsGoal, SavingsProgress } from "../types/goal";
import { SavingsGoalService } from "../services/goalService";
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

  return {
    currentGoal,
    progress,
    isLoading: isLoadingGoal || isLoadingProgress,
    error: goalError || progressError
  };
}
