
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { useSavingsGoal } from "@/hooks/useSavingsGoal";
import { GOAL_TYPE_LABELS, GOAL_TYPE_DESCRIPTIONS } from "@/lib/savings/constants";
import type { SavingsGoal, SavingsGoalType } from "@/types/savings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { savingsGoalSchema } from "@/types/savings";
import type { SavingsGoalFormValues } from "@/types/savings";
import { useState } from "react";

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
            <Label>Goal Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value: SavingsGoalType) => {
                setSelectedType(value);
                form.setValue("goal_type", value);
              }}
              disabled={mode === 'edit'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a goal type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GOAL_TYPE_LABELS).map(([type, label]) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {GOAL_TYPE_DESCRIPTIONS[selectedType]}
            </p>
          </div>

          {selectedType === 'one_time' ? (
            <div className="space-y-2">
              <Label htmlFor="target_amount">Target Amount</Label>
              <Input
                {...form.register("target_amount")}
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter target amount"
              />
              {form.formState.errors.target_amount && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.target_amount.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="recurring_amount">
                {selectedType === 'recurring_monthly' ? 'Monthly' : 'Yearly'} Target
              </Label>
              <Input
                {...form.register("recurring_amount")}
                type="number"
                min="0"
                step="0.01"
                placeholder={`Enter ${selectedType === 'recurring_monthly' ? 'monthly' : 'yearly'} target`}
              />
              {form.formState.errors.recurring_amount && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.recurring_amount.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Start Date</Label>
            <DatePicker
              date={form.watch("period_start")}
              onChange={(date) => date && form.setValue("period_start", date)}
            />
          </div>

          {selectedType === 'one_time' && (
            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker
                date={form.watch("period_end")}
                onChange={(date) => form.setValue("period_end", date)}
              />
              {form.formState.errors.period_end && (
                <p className="text-sm text-destructive">
                  End date is required for one-time goals
                </p>
              )}
            </div>
          )}

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
