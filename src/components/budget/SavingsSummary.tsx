import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMonth } from "@/contexts/MonthContext";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function SavingsSummary() {
  const { selectedMonth } = useMonth();

  const { data: savingsData, isLoading, error } = useQuery({
    queryKey: ["savings", format(selectedMonth, "yyyy-MM")],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get the savings category ID first
      const { data: savingsCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", "Savings")
        .single();

      if (!savingsCategory) {
        return { currentMonth: 0, previousMonth: 0, total: 0 };
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
        .eq("category_id", savingsCategory.id)
        .eq("user_id", user.id)
        .gte("date", currentMonthStart)
        .lt("date", nextMonthStart);

      if (currentError) throw currentError;

      // Get previous month's savings
      const previousMonthStart = format(
        new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1),
        "yyyy-MM-dd"
      );

      const { data: previousMonthData, error: previousError } = await supabase
        .from("transactions")
        .select("amount")
        .eq("category_id", savingsCategory.id)
        .eq("user_id", user.id)
        .gte("date", previousMonthStart)
        .lt("date", currentMonthStart);

      if (previousError) throw previousError;

      // Get total savings (all time)
      const { data: totalData, error: totalError } = await supabase
        .from("transactions")
        .select("amount")
        .eq("category_id", savingsCategory.id)
        .eq("user_id", user.id);

      if (totalError) throw totalError;

      const currentMonth = currentMonthData.reduce((sum, t) => sum + t.amount, 0);
      const previousMonth = previousMonthData.reduce((sum, t) => sum + t.amount, 0);
      const total = totalData.reduce((sum, t) => sum + t.amount, 0);

      return { currentMonth, previousMonth, total };
    },
  });

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
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  const monthChange = savingsData
    ? savingsData.currentMonth - savingsData.previousMonth
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Month Savings</p>
            <p className="text-2xl font-bold">
              ${savingsData?.currentMonth.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${monthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthChange >= 0 ? '↑' : '↓'} ${Math.abs(monthChange).toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Savings</p>
            <p className="text-2xl font-bold">
              ${savingsData?.total.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}