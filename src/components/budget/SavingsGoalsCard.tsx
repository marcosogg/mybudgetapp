
import { useState } from "react";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSavingsGoal } from "@/hooks/useSavingsGoal";
import type { SavingsGoalFormValues, SavingsGoalCategory, SavingsGoalType } from "@/types/savings";
import { savingsGoalSchema } from "@/types/savings";

const GOAL_TYPE_LABELS: Record<SavingsGoalType, string> = {
  one_time: "One-time Goal",
  recurring_monthly: "Monthly Recurring",
  recurring_yearly: "Yearly Recurring"
};

const GOAL_CATEGORIES: Record<SavingsGoalCategory, string> = {
  general: "General Savings",
  emergency: "Emergency Fund",
  retirement: "Retirement",
  house: "House/Property",
  car: "Vehicle",
  education: "Education",
  vacation: "Vacation",
  other: "Other"
};

export function SavingsGoalsCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentGoal, createGoal, updateGoal, endCurrentGoal } = useSavingsGoal();

  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      goal_type: 'one_time',
      target_amount: "",
      period_start: new Date(),
      category: 'general',
      priority: 0
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open && currentGoal) {
      form.reset({
        goal_type: currentGoal.goal_type,
        target_amount: currentGoal.target_amount.toString(),
        recurring_amount: currentGoal.recurring_amount?.toString(),
        period_start: new Date(currentGoal.period_start),
        period_end: currentGoal.period_end ? new Date(currentGoal.period_end) : undefined,
        notes: currentGoal.notes,
        category: currentGoal.category,
        priority: currentGoal.priority
      });
    } else if (!open) {
      form.reset();
    }
  };

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
                <Label>Goal Type</Label>
                <Select
                  value={form.watch("goal_type")}
                  onValueChange={(value: SavingsGoalType) => form.setValue("goal_type", value)}
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
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value: SavingsGoalCategory) => form.setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(GOAL_CATEGORIES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              {form.watch("goal_type") !== 'one_time' && (
                <div className="space-y-2">
                  <Label htmlFor="recurring_amount">
                    {form.watch("goal_type") === 'recurring_monthly' ? 'Monthly' : 'Yearly'} Target
                  </Label>
                  <Input
                    {...form.register("recurring_amount")}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={`Enter ${form.watch("goal_type") === 'recurring_monthly' ? 'monthly' : 'yearly'} target`}
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

              {form.watch("goal_type") === 'one_time' && (
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
                <Label htmlFor="priority">Priority (0-10)</Label>
                <Input
                  {...form.register("priority", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="10"
                  step="1"
                  placeholder="Enter priority (0 = lowest)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  {...form.register("notes")}
                  placeholder="Add notes about your goal"
                />
              </div>

              <div className="flex gap-2 justify-end">
                {currentGoal && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => endCurrentGoal.mutate()}
                    disabled={endCurrentGoal.isPending}
                  >
                    End Goal
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={createGoal.isPending || updateGoal.isPending || !form.formState.isValid}
                >
                  {createGoal.isPending || updateGoal.isPending
                    ? "Saving..."
                    : currentGoal
                    ? "Update Goal"
                    : "Create Goal"}
                </Button>
              </div>
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
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span className="font-medium">Category:</span>{" "}
              {GOAL_CATEGORIES[currentGoal.category]}
            </p>
            {currentGoal.priority > 0 && (
              <p className="text-sm">
                <span className="font-medium">Priority:</span> {currentGoal.priority}
              </p>
            )}
            {currentGoal.notes && (
              <p className="text-sm text-muted-foreground">{currentGoal.notes}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
