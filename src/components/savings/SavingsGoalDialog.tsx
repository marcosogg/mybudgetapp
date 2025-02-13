
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SavingsGoal, SavingsGoalFormValues } from "@/types/savings";
import { savingsGoalSchema } from "@/types/savings";
import { useSavingsGoal } from "@/hooks/useSavingsGoal";
import { normalizeTags } from "@/utils/tagUtils";

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

  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: goal?.name || "",
      target_amount: goal?.target_amount?.toString() || "",
      notes: goal?.notes || "",
      goal_type: goal?.goal_type || "custom",
      milestone_notifications: goal?.milestone_notifications ?? true
    }
  });

  const onSubmit = async (values: SavingsGoalFormValues) => {
    try {
      // Generate tag from goal name
      const normalizedTag = normalizeTags(values.name)[0];
      
      if (mode === 'edit' && goal) {
        await updateGoal.mutateAsync({
          id: goal.id,
          values: {
            ...values,
            tag: normalizedTag
          }
        });
      } else {
        await createGoal.mutateAsync({
          ...values,
          tag: normalizedTag
        });
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  const handleEndGoal = async () => {
    if (!goal) return;
    try {
      await endCurrentGoal.mutateAsync();
      onOpenChange(false);
    } catch (error) {
      console.error("Error ending goal:", error);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter goal name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_amount">Target Amount</Label>
            <Input
              id="target_amount"
              type="number"
              step="0.01"
              min="0"
              {...form.register("target_amount")}
              placeholder="Enter target amount"
            />
            {form.formState.errors.target_amount && (
              <p className="text-sm text-destructive">
                {form.formState.errors.target_amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Add any notes about your goal"
            />
          </div>

          <div className="flex gap-2 justify-end">
            {mode === 'edit' && (
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
