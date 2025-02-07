import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Edit2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { SavingsGoal } from "@/types/savings";

const savingsGoalSchema = z.object({
  target_amount: z.string()
    .min(1, "Target amount is required")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Must be a positive number"),
  start_date: z.date(),
  end_date: z.date().optional(),
  notes: z.string().optional(),
});

type SavingsGoalFormValues = z.infer<typeof savingsGoalSchema>;

export function SavingsGoalsCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      target_amount: "",
      start_date: new Date(),
      notes: "",
    },
  });

  const { data: savingsData } = useQuery({
    queryKey: ["savings-trend"],
    enabled: false,
  });

  const { data: currentGoal, isLoading } = useQuery({
    queryKey: ["current-savings-goal"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .is("end_date", null)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Calculate progress based on total savings
        const progress = savingsData?.yearTotal 
          ? (savingsData.yearTotal / data.target_amount) * 100
          : 0;
        
        return { ...data, progress } as SavingsGoal;
      }

      return null;
    },
  });

  const createGoal = useMutation({
    mutationFn: async (values: SavingsGoalFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // If there's an existing active goal, end it
      if (currentGoal) {
        await supabase
          .from("savings_goals")
          .update({ end_date: format(new Date(), "yyyy-MM-dd") })
          .eq("id", currentGoal.id);
      }

      // Create new goal
      const { data, error } = await supabase
        .from("savings_goals")
        .insert([
          {
            user_id: user.id,
            target_amount: parseFloat(values.target_amount),
            start_date: format(values.start_date, "yyyy-MM-dd"),
            end_date: values.end_date ? format(values.end_date, "yyyy-MM-dd") : null,
            notes: values.notes?.trim() || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-savings-goal"] });
      queryClient.invalidateQueries({ queryKey: ["savings-trend"] });
      toast.success("Savings goal updated successfully");
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to update savings goal");
      console.error("Error updating savings goal:", error);
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open && currentGoal) {
      form.reset({
        target_amount: currentGoal.target_amount.toString(),
        start_date: new Date(currentGoal.start_date),
        end_date: currentGoal.end_date ? new Date(currentGoal.end_date) : undefined,
        notes: currentGoal.notes || "",
      });
    } else if (!open) {
      form.reset();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Savings Goal</h3>
          {currentGoal && (
            <p className="text-sm text-muted-foreground">
              Target: ${currentGoal.target_amount.toLocaleString()}
            </p>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              {currentGoal ? (
                <>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Goal
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Set Goal
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentGoal ? "Update Savings Goal" : "Set New Savings Goal"}
              </DialogTitle>
              <DialogDescription>
                Set a target amount and timeframe for your savings goal.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit((values) => createGoal.mutate(values))} className="space-y-4">
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
                  <p className="text-sm text-destructive">{form.formState.errors.target_amount.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker
                  date={form.watch("start_date")}
                  onChange={(date) => date && form.setValue("start_date", date)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <DatePicker
                  date={form.watch("end_date")}
                  onChange={(date) => form.setValue("end_date", date)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  {...form.register("notes")}
                  placeholder="Add notes about your goal"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={createGoal.isPending || !form.formState.isValid}
              >
                {createGoal.isPending ? "Saving..." : "Save Goal"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {currentGoal && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span>{currentGoal.progress?.toFixed(1)}%</span>
          </div>
          <Progress value={currentGoal.progress || 0} className="h-2" />
          {currentGoal.notes && (
            <p className="text-sm text-muted-foreground mt-2">{currentGoal.notes}</p>
          )}
        </div>
      )}
    </div>
  );
} 