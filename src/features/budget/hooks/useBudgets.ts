
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetService } from "../services/budgetService";
import type { Budget } from "../types/budget";
import { toast } from "sonner";

const budgetService = new BudgetService();

export function useBudgets(period: Date) {
  const queryClient = useQueryClient();
  const queryKey = ['budgets', period.toISOString()];

  const { 
    data: budgets,
    isLoading,
    error 
  } = useQuery({
    queryKey,
    queryFn: () => budgetService.getBudgets(period)
  });

  const createBudget = useMutation({
    mutationFn: (newBudget: Omit<Budget, 'id' | 'user_id' | 'created_at'>) =>
      budgetService.createBudget(newBudget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Budget created successfully");
    },
    onError: (error) => {
      console.error("Error creating budget:", error);
      toast.error("Failed to create budget");
    }
  });

  const updateBudget = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Budget, 'id' | 'user_id' | 'created_at'>> }) =>
      budgetService.updateBudget(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Budget updated successfully");
    },
    onError: (error) => {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
    }
  });

  const deleteBudget = useMutation({
    mutationFn: (id: string) => budgetService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Budget deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget");
    }
  });

  return {
    budgets,
    isLoading,
    error,
    createBudget,
    updateBudget,
    deleteBudget
  };
}
