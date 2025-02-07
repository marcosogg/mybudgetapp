import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMonth } from "@/contexts/MonthContext";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SavingsDialog } from "./SavingsDialog";
import { toast } from "sonner";
import { useSavingsGoal } from "@/hooks/useSavingsGoal";
import { GOAL_TYPE_LABELS } from "@/lib/savings/constants";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function SavingsSummary() {
  const [isEditing, setIsEditing] = useState(false);
  const { selectedMonth } = useMonth();
  const { currentGoal, progress, isLoading, error } = useSavingsGoal();

  // Get current month's savings
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsEditing(open);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load savings data</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Savings</CardTitle>
            {currentGoal && (
              <p className="text-sm text-muted-foreground">
                {GOAL_TYPE_LABELS[currentGoal.goal_type]}
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleEditClick}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Current Month:</span>
              <span className="font-medium">${monthlySavings?.toLocaleString() || 0}</span>
            </div>
            {currentGoal && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {currentGoal.goal_type === 'recurring_monthly' ? 'Monthly Target:' :
                     currentGoal.goal_type === 'recurring_yearly' ? 'Yearly Target:' :
                     'Target Goal:'}
                  </span>
                  <span className="font-medium">
                    ${(currentGoal.goal_type === 'recurring_monthly' ? currentGoal.recurring_amount :
                       currentGoal.goal_type === 'recurring_yearly' ? currentGoal.recurring_amount :
                       currentGoal.target_amount)?.toLocaleString() || 0}
                  </span>
                </div>
                {progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <Badge variant={progress.is_on_track ? "default" : "secondary"}>
                        {progress.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      ${progress.current_amount.toLocaleString()} of ${progress.expected_amount.toLocaleString()} expected
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <SavingsDialog
        open={isEditing}
        onOpenChange={handleDialogClose}
        currentSavings={progress?.current_amount || 0}
        targetAmount={currentGoal?.target_amount || 0}
      />
    </>
  );
}