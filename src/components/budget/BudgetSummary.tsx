
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBudgetComparison } from "@/hooks/budget/useBudgetComparison";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const BudgetItem = memo(({ 
  category_name, 
  actual_amount, 
  planned_amount, 
  variance 
}: { 
  category_name: string;
  actual_amount: number;
  planned_amount: number;
  variance: number;
}) => (
  <Card key={category_name}>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">
        {category_name}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Progress
          value={
            planned_amount > 0
              ? (actual_amount / planned_amount) * 100
              : 0
          }
          className="h-2"
        />
        <div className="flex justify-between text-sm">
          <span>
            ${actual_amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span className="text-muted-foreground"> spent</span>
          </span>
          <span>
            ${planned_amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span className="text-muted-foreground"> budgeted</span>
          </span>
        </div>
        <div
          className={`text-sm font-medium ${
            variance >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {variance >= 0 ? "Under" : "Over"} budget by $
          {Math.abs(variance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </CardContent>
  </Card>
));

BudgetItem.displayName = "BudgetItem";

export function BudgetSummary() {
  const { data: comparison, isLoading, error } = useBudgetComparison();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load budget comparison</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Budget Overview</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {comparison?.map((item) => (
          <BudgetItem
            key={item.category_id}
            category_name={item.category_name}
            actual_amount={item.actual_amount}
            planned_amount={item.planned_amount}
            variance={item.variance}
          />
        ))}
      </div>
    </div>
  );
}

