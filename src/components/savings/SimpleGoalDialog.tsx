
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const goalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  target_amount: z.string()
    .min(1, "Target amount is required")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Must be a positive number")
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface SimpleGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentGoal?: {
    id: string;
    name: string;
    target_amount: number;
  } | null;
}

export function SimpleGoalDialog({ 
  open, 
  onOpenChange,
  currentGoal
}: SimpleGoalDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: currentGoal?.name || "",
      target_amount: currentGoal?.target_amount?.toString() || ""
    }
  });

  const { mutateAsync: saveGoal, isPending: isSaving } = useMutation({
    mutationFn: async (values: GoalFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const goalData = {
        user_id: user.id,
        name: values.name,
        target_amount: parseFloat(values.target_amount)
      };

      if (currentGoal) {
        const { error } = await supabase
          .from("savings_goals")
          .update(goalData)
          .eq('id', currentGoal.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("savings_goals")
          .insert([goalData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-trend'] });
      toast.success(currentGoal ? "Goal updated" : "Goal created");
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error saving goal:", error);
      toast.error("Failed to save goal");
    }
  });

  const { mutateAsync: deleteGoal, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!currentGoal) return;
      
      const { error } = await supabase
        .from("savings_goals")
        .delete()
        .eq('id', currentGoal.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-trend'] });
      toast.success("Goal deleted");
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  });

  const onSubmit = async (values: GoalFormValues) => {
    try {
      await saveGoal(values);
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {currentGoal ? "Update Savings Goal" : "Create New Savings Goal"}
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

          <div className="flex gap-2 justify-end">
            {currentGoal && (
              <Button
                type="button"
                variant="outline"
                onClick={() => deleteGoal()}
                disabled={isDeleting}
              >
                Delete Goal
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : currentGoal
                ? "Update Goal"
                : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
