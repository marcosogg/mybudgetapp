
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

  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: currentGoal?.name || "",
      target_amount: currentGoal?.target_amount?.toString() || "",
      notes: currentGoal?.notes || ""
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
      console.error("Error saving goal:", error);
    }
  };

  const handleEndGoal = async () => {
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
            {currentGoal ? "Update Savings Goal" : "Set New Savings Goal"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

          <div className="flex flex-col gap-2">
            {currentSavings > 0 && (
              <p className="text-sm text-muted-foreground">
                Current savings: ${currentSavings.toLocaleString()}
              </p>
            )}
            <div className="flex gap-2 justify-end">
              {currentGoal && (
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
                  : currentGoal
                  ? "Update Goal"
                  : "Create Goal"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
