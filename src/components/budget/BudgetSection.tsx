import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Copy } from "lucide-react";
import { BudgetDialog } from "./BudgetDialog";
import { BudgetTable } from "./BudgetTable";
import { useBudgets } from "@/hooks/budget/useBudgets";
import { useProfile } from "@/hooks/useProfile";
import { Progress } from "@/components/ui/progress";
import { Budget } from "@/hooks/budget/types";
import { MonthPicker } from "./MonthPicker";
import { useMonth } from "@/contexts/MonthContext";
import { toast } from "sonner";
import { format, subMonths } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export function BudgetSection() {
  const [open, setOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>();
  const { selectedMonth, onMonthChange } = useMonth();
  const { data: budgets, isLoading: isLoadingBudgets, refetch } = useBudgets();
  const { profile, isLoading: isLoadingProfile } = useProfile();

  const totalBudget = budgets?.reduce((sum, budget) => sum + budget.amount, 0) || 0;
  const monthlyIncome = (profile?.monthlyIncome?.salary || 0) + (profile?.monthlyIncome?.bonus || 0);
  const budgetPercentage = monthlyIncome > 0 ? (totalBudget / monthlyIncome) * 100 : 0;
  const remainingBudget = monthlyIncome - totalBudget;

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    setOpen(true);
  };

  const handleAddNew = () => {
    setSelectedBudget(undefined);
    setOpen(true);
  };

  const handleCopyPreviousMonth = async () => {
    const previousMonth = subMonths(selectedMonth, 1);
    const previousMonthFormatted = format(previousMonth, "yyyy-MM-dd");
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      // Fetch previous month's budgets
      const { data: previousBudgets, error: fetchError } = await supabase
        .from("budgets")
        .select("*")
        .eq("period", previousMonthFormatted)
        .eq("user_id", user.id);

      if (fetchError) throw fetchError;
      if (!previousBudgets?.length) {
        toast.error("No budgets found for the previous month");
        return;
      }

      // Insert new budgets for current month
      const { error: insertError } = await supabase
        .from("budgets")
        .insert(
          previousBudgets.map(budget => ({
            category_id: budget.category_id,
            amount: budget.amount,
            period: format(selectedMonth, "yyyy-MM-dd"),
            user_id: user.id // Include user_id in the new budgets
          }))
        );

      if (insertError) throw insertError;

      toast.success("Successfully copied previous month's budgets");
      refetch();
    } catch (error) {
      console.error("Error copying budgets:", error);
      toast.error("Failed to copy previous month's budgets");
    }
  };

  const isLoading = isLoadingBudgets || isLoadingProfile;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <CardTitle>Budget Allocation</CardTitle>
          <MonthPicker 
            selectedMonth={selectedMonth}
            onMonthChange={onMonthChange}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCopyPreviousMonth} size="sm" variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copy Previous Month
          </Button>
          <Button onClick={handleAddNew} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <p className="text-muted-foreground">Loading budgets...</p>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Budget</span>
                <span className="font-medium">${totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Income</span>
                <span className="font-medium">${monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className={`font-medium ${remainingBudget < 0 ? 'text-destructive' : 'text-green-600'}`}>
                  ${remainingBudget.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={Math.min(budgetPercentage, 100)} 
                className="h-2"
                indicatorClassName={budgetPercentage > 100 ? 'bg-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground text-right">
                {budgetPercentage.toFixed(1)}% of income budgeted
              </p>
            </div>
            <BudgetTable budgets={budgets || []} onEdit={handleEdit} />
          </>
        )}
      </CardContent>
      <BudgetDialog 
        open={open} 
        onOpenChange={setOpen} 
        selectedBudget={selectedBudget}
      />
    </Card>
  );
}
