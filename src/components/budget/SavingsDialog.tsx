
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSavingsGoal } from "@/hooks/useSavingsGoal";
import type { SavingsGoalType } from "@/types/savings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { savingsGoalSchema } from "@/types/savings";
import type { SavingsGoalFormValues } from "@/types/savings";
import { GoalTypeSelect } from "../savings/form/GoalTypeSelect";
import { GoalAmountInput } from "../savings/form/GoalAmountInput";
import { GoalDateFields } from "../savings/form/GoalDateFields";
import { GoalNotesField } from "../savings/form/GoalNotesField";
import { GoalFormActions } from "../savings/form/GoalFormActions";

interface SavingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSavings: number;
  targetAmount: number;
}

export function SavingsDialog({ 
  open, 
  onOpenChange, 
  currentSavings 
}: SavingsDialogProps) {
  const { currentGoal, createGoal, updateGoal, endCurrentGoal } = useSavingsGoal();
  const [selectedType, setSelectedType] = useState<SavingsGoalType>(
    currentGoal?.goal_type || 'one_time'
  );

  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: currentGoal?.name || "",
      goal_type: currentGoal?.goal_type || 'one_time',
      target_amount: currentGoal?.target_amount?.toString() || "",
      recurring_amount: currentGoal?.recurring_amount?.toString() || "",
      period_start: currentGoal?.period_start || new Date(),
      period_end: currentGoal?.period_end,
      notes: currentGoal?.notes || "",
    }
  });

  const handleSubmit = async (values: SavingsGoalFormValues) => {
    try {
      if (currentGoal) {
        await updateGoal.mutateAsync({
          id: currentGoal.id,
          values
        });
      } else {
        await createGoal.mutateAsync(values);
      }
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the mutation callbacks
    }
  };

  const handleEndGoal = async () => {
    try {
      await endCurrentGoal.mutateAsync();
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the mutation callbacks
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {currentGoal ? "Update Savings Goal" : "Set New Savings Goal"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <GoalTypeSelect
            value={selectedType}
            onChange={(value) => {
              setSelectedType(value);
              form.setValue("goal_type", value);
            }}
            disabled={!!currentGoal}
          />

          <GoalAmountInput
            goalType={selectedType}
            register={form.register}
            errors={form.formState.errors}
          />

          <GoalDateFields
            goalType={selectedType}
            watch={form.watch}
            setValue={form.setValue}
            errors={form.formState.errors}
          />

          <GoalNotesField register={form.register} />

          <GoalFormActions 
            mode={currentGoal ? 'edit' : 'create'}
            goal={currentGoal}
            onEndGoal={handleEndGoal}
            isSubmitting={createGoal.isPending || updateGoal.isPending}
            isEndingGoal={endCurrentGoal.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
