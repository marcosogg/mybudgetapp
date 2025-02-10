import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { useMonth } from "@/contexts/MonthContext";

export function IncomeSummaryCard() {
  const { profile, isLoading } = useProfile();
  const { selectedMonth } = useMonth();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between pt-4 border-t">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const monthlyIncome = profile?.monthlyIncome;
  const totalIncome = monthlyIncome ? monthlyIncome.salary + monthlyIncome.bonus : 0;

  if (!monthlyIncome) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No income data found for {format(selectedMonth, 'MMMM yyyy')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income - {format(selectedMonth, 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Salary</span>
            <span className="font-medium">${monthlyIncome.salary.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Bonus</span>
            <span className="font-medium">${monthlyIncome.bonus.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-4 border-t">
            <span className="font-medium">Total</span>
            <span className="font-bold text-primary">${totalIncome.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}