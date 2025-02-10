
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSavingsGoal } from "@/hooks/useSavingsGoal";
import type { SavingsGoal, SavingsGoalType } from "@/types/savings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { savingsGoalSchema } from "@/types/savings";
import type { SavingsGoalFormValues } from "@/types/savings";
import { useState } from "react";
import { GoalTypeSelect } from "./form/GoalTypeSelect";
import { GoalAmountInput } from "./form/GoalAmountInput";
import { GoalDateFields } from "./form/GoalDateFields";
import { GoalNameField } from "./form/GoalNameField";
import { GoalNotesField } from "./form/GoalNotesField";
import { GoalFormActions } from "./form/GoalFormActions";

interface SavingsGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  goal?: SavingsGoal | null;
}

export function SavingsGoalDialog({ 
  open, 
  onOpenChange,
  mode,
  goal
}: SavingsGoalDialogProps) {
  const { createGoal, updateGoal, endCurrentGoal } = useSavingsGoal();
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
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the mutation callbacks
    }
  };

  const handleEndGoal = async () => {
    if (!goal) return;
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
            {mode === 'edit' ? "Update Savings Goal" : "Create New Savings Goal"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <GoalNameField 
            register={form.register}
            errors={form.formState.errors}
          />

          <GoalTypeSelect
            value={selectedType}
            onChange={(value) => {
              setSelectedType(value);
              form.setValue("goal_type", value);
            }}
            disabled={mode === 'edit'}
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
            mode={mode}
            goal={goal}
            onEndGoal={handleEndGoal}
            isSubmitting={createGoal.isPending || updateGoal.isPending}
            isEndingGoal={endCurrentGoal.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
