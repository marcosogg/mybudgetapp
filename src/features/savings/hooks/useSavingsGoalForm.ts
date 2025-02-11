
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SavingsGoal, SavingsGoalType } from "../types/goal";
import type { SavingsGoalFormValues } from "../types/form";
import { savingsGoalSchema } from "../types/form";
import { SavingsGoalService } from "../services/goalService";

interface UseSavingsGoalFormProps {
  mode: 'create' | 'edit';
  goal?: SavingsGoal | null;
  onSuccess?: () => void;
}

const savingsGoalService = new SavingsGoalService();

export function useSavingsGoalForm({ mode, goal, onSuccess }: UseSavingsGoalFormProps) {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<SavingsGoalType>(
    goal?.goal_type || 'one_time'
  );

  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: goal?.name || "",
      goal_type: goal?.goal_type || 'one_time',
      target_amount: goal?.target_amount?.toString() || "",
      recurring_amount: goal?.recurring_amount?.toString() || "",
      period_start: goal?.period_start || new Date(),
      period_end: goal?.period_end,
      notes: goal?.notes || "",
    }
  });

  const createGoal = useMutation({
    mutationFn: (values: SavingsGoalFormValues) => savingsGoalService.createGoal({
      user_id: "", // Will be set by service
      name: values.name,
      goal_type: values.goal_type,
      target_amount: parseFloat(values.target_amount),
      recurring_amount: values.recurring_amount ? parseFloat(values.recurring_amount) : undefined,
      period_start: values.period_start,
      period_end: values.period_end,
      notes: values.notes
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-savings-goal'] });
      toast.success("Savings goal created successfully");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error creating savings goal:", error);
      toast.error("Failed to create savings goal");
    }
  });

  const updateGoal = useMutation({
    mutationFn: ({ id, values }: { id: string; values: SavingsGoalFormValues }) => {
      const updates = {
        name: values.name,
        goal_type: values.goal_type,
        target_amount: parseFloat(values.target_amount),
        recurring_amount: values.recurring_amount ? parseFloat(values.recurring_amount) : undefined,
        period_start: values.period_start,
        period_end: values.period_end,
        notes: values.notes
      };
      return savingsGoalService.updateGoal(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-savings-goal'] });
      toast.success("Savings goal updated successfully");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error updating savings goal:", error);
      toast.error("Failed to update savings goal");
    }
  });

  const endCurrentGoal = useMutation({
    mutationFn: async () => {
      if (!goal) throw new Error("No active goal to end");
      return savingsGoalService.updateGoal(goal.id, {
        period_end: new Date()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-savings-goal'] });
      toast.success("Savings goal ended successfully");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error ending savings goal:", error);
      toast.error("Failed to end savings goal");
    }
  });

  const handleSubmit = async (values: SavingsGoalFormValues) => {
    try {
      if (mode === 'edit' && goal) {
        await updateGoal.mutateAsync({
          id: goal.id,
          values
        });
      } else {
        await createGoal.mutateAsync(values);
      }
    } catch (error) {
      // Error handling is done in mutation callbacks
    }
  };

  const handleEndGoal = async () => {
    try {
      await endCurrentGoal.mutateAsync();
    } catch (error) {
      // Error handling is done in mutation callbacks
    }
  };

  return {
    form,
    selectedType,
    setSelectedType,
    handleSubmit,
    handleEndGoal,
    isSubmitting: createGoal.isPending || updateGoal.isPending,
    isEndingGoal: endCurrentGoal.isPending
  };
}
