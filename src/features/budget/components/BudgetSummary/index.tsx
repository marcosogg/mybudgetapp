
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/budget/calculations";

interface BudgetSummaryProps {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  spendingPercentage: number;
}

export function BudgetSummary({
  totalBudget,
  totalSpent,
  remainingBudget,
  spendingPercentage
}: BudgetSummaryProps) {
  const isOverBudget = spendingPercentage > 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
            <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Remaining</p>
            <p className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-destructive' : 'text-green-600'}`}>
              {formatCurrency(remainingBudget)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress 
            value={Math.min(spendingPercentage, 100)} 
            className="h-2"
            indicatorClassName={isOverBudget ? 'bg-destructive' : undefined}
          />
          <p className="text-xs text-muted-foreground text-right">
            {spendingPercentage.toFixed(1)}% of budget used
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
