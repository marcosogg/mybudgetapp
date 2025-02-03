import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudgetComparison } from "@/hooks/budget/useBudgetComparison";
import { useMonth } from "@/contexts/MonthContext";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export function BudgetSummaryCard() {
  const { selectedMonth } = useMonth();
  const { data: comparison } = useBudgetComparison();

  const totalBudget = comparison?.reduce((sum, item) => sum + item.planned_amount, 0) || 0;
  const totalSpent = comparison?.reduce((sum, item) => sum + item.actual_amount, 0) || 0;
  const remaining = totalBudget - totalSpent;
  const percentageSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverBudget = percentageSpent > 100;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Monthly Budget</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Planned Budget</span>
            <span className="font-medium">
              ${totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Actual Spending</span>
            <span className="font-medium">
              ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div 
            className="h-2 w-full rounded-full bg-gray-100 overflow-hidden" 
            role="progressbar" 
            aria-valuenow={percentageSpent} 
            aria-valuemin={0} 
            aria-valuemax={100}
            aria-label={isOverBudget ? "Over budget warning" : "Budget progress"}
          >
            <div 
              className={cn(
                "h-full transition-all duration-300",
                isOverBudget ? "bg-[#EF4444]" : "bg-[#3B82F6]"
              )} 
              style={{ width: `${Math.min(percentageSpent, 100)}%` }} 
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Remaining:</span>
              <div className="flex items-center gap-1">
                <span className={cn(
                  "font-medium",
                  remaining >= 0 ? "text-green-500" : "text-[#EF4444]"
                )}>
                  ${Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {isOverBudget && (
                  <AlertTriangle 
                    className="h-4 w-4 text-[#EF4444]" 
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
            <span className={cn(
              "text-sm font-medium",
              isOverBudget ? "text-[#EF4444]" : "text-gray-600"
            )}>
              {percentageSpent.toFixed(1)}% spent
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}