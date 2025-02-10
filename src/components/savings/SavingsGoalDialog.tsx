
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              {...form.register("name")}
              placeholder="Enter goal name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              {...form.register("notes")}
              placeholder="Add notes about your goal"
            />
          </div>

          <div className="flex gap-2 justify-end">
            {mode === 'edit' && !goal?.period_end && (
              <Button
                type="button"
                variant="outline"
                onClick={handleEndGoal}
                disabled={endCurrentGoal.isPending}
              >
                End Goal
              </Button>
            )}
            <Button
              type="submit"
              disabled={createGoal.isPending || updateGoal.isPending}
            >
              {createGoal.isPending || updateGoal.isPending
                ? "Saving..."
                : mode === 'edit'
                ? "Update Goal"
                : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
