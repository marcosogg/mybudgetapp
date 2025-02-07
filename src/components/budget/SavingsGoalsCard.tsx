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
import { GOAL_TYPE_LABELS } from "@/lib/savings/constants";
import { SavingsDialog } from "./SavingsDialog";
import { useMonth } from "@/contexts/MonthContext";

interface SavingsTrendData {
  yearTotal: number;
}

const savingsGoalSchema = z.object({
  target_amount: z.string()
    .min(1, "Target amount is required")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Must be a positive number"),
  period_start: z.date(),
  period_end: z.date().optional(),
  notes: z.string().optional(),
});

type SavingsGoalFormValues = z.infer<typeof savingsGoalSchema>;

export function SavingsGoalsCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { selectedMonth } = useMonth();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      target_amount: "",
      period_start: new Date(),
      notes: "",
    },
  });

  const { data: savingsData } = useQuery<SavingsTrendData>({
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
        .is("period_end", null)
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
          .update({ period_end: format(new Date(), "yyyy-MM-dd") })
          .eq("id", currentGoal.id);
      }

      // Create new goal
      const { data, error } = await supabase
        .from("savings_goals")
        .insert([
          {
            user_id: user.id,
            target_amount: parseFloat(values.target_amount),
            period_start: format(values.period_start, "yyyy-MM-dd"),
            period_end: values.period_end ? format(values.period_end, "yyyy-MM-dd") : null,
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
        period_start: new Date(currentGoal.period_start),
        period_end: currentGoal.period_end ? new Date(currentGoal.period_end) : undefined,
        notes: currentGoal.notes || "",
      });
    } else if (!open) {
      form.reset();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsEditing(open);
  };

  const { data: monthlySavings } = useQuery({
    queryKey: ["monthly-savings", format(selectedMonth, "yyyy-MM")],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("User not authenticated");
          throw new Error("User not authenticated");
        }

        // Get the savings category ID first
        const { data: existingCategory, error: categoryError } = await supabase
          .from("categories")
          .select("id")
          .eq("user_id", user.id)
          .eq("name", "Savings")
          .maybeSingle();

        if (categoryError) {
          console.error("Category fetch error:", categoryError);
          throw categoryError;
        }

        let categoryId;
        if (!existingCategory) {
          // Create the Savings category if it doesn't exist
          const { data: newCategory, error: createError } = await supabase
            .from("categories")
            .insert({ name: "Savings", user_id: user.id })
            .select("id")
            .single();
            
          if (createError) {
            console.error("Category creation error:", createError);
            throw createError;
          }
          categoryId = newCategory.id;
        } else {
          categoryId = existingCategory.id;
        }

        // Get current month's savings
        const currentMonthStart = format(selectedMonth, "yyyy-MM-01");
        const nextMonthStart = format(
          new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1),
          "yyyy-MM-dd"
        );

        const { data: currentMonthData, error: currentError } = await supabase
          .from("transactions")
          .select("amount")
          .eq("category_id", categoryId)
          .eq("user_id", user.id)
          .gte("date", currentMonthStart)
          .lt("date", nextMonthStart);

        if (currentError) {
          console.error("Transactions fetch error:", currentError);
          throw currentError;
        }

        return currentMonthData?.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0) || 0;
      } catch (error) {
        console.error("Monthly savings fetch error:", error);
        toast.error("Failed to load monthly savings data");
        throw error;
      }
    },
  });

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
                  date={form.watch("period_start")}
                  onChange={(date) => date && form.setValue("period_start", date)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <DatePicker
                  date={form.watch("period_end")}
                  onChange={(date) => form.setValue("period_end", date)}
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
