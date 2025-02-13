
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SavingsGoalFormValues } from "@/types/savings";
import { savingsGoalSchema } from "@/types/savings";
import { useSavingsGoal } from "@/hooks/useSavingsGoal";
import { normalizeTags } from "@/utils/tagUtils";

interface SimpleGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SimpleGoalDialog({ open, onOpenChange }: SimpleGoalDialogProps) {
  const { createGoal } = useSavingsGoal();

  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: "",
      target_amount: "",
      notes: "",
      goal_type: "custom",
      milestone_notifications: true
    }
  });

  const onSubmit = async (values: SavingsGoalFormValues) => {
    try {
      // Generate tag from goal name
      const normalizedTag = normalizeTags(values.name)[0];
      await createGoal.mutateAsync({
        ...values,
        tag: normalizedTag
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Savings Goal</DialogTitle>
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

          <Button 
            type="submit" 
            className="w-full"
            disabled={createGoal.isPending}
          >
            {createGoal.isPending ? "Creating..." : "Create Goal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
