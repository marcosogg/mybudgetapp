
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { BudgetComparisonChart } from "./BudgetComparisonChart";
import { useAIInsights } from "@/hooks/useAIInsights";
import { cn } from "@/lib/utils";
import { SavingsChart } from "./savings/SavingsChart";
import { QuickInsightsDialog } from "./QuickInsightsDialog";

const InsightPreview = memo(({ content }: { content: string }) => {
  const isPositive = content.toLowerCase().includes('under') || 
                     content.toLowerCase().includes('no transactions');
  
  return (
    <div className={cn(
      "flex items-start gap-3 py-3",
      "border-b last:border-b-0 border-border"
    )}>
      <span className="mt-0.5">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-primary" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive" />
        )}
      </span>
      <p className="text-sm leading-tight line-clamp-2">{content}</p>
    </div>
  );
});

InsightPreview.displayName = "InsightPreview";

const MemoizedBudgetComparisonChart = memo(BudgetComparisonChart);
const MemoizedSavingsChart = memo(SavingsChart);

export const ChartsSection = memo(function ChartsSection() {
  const { insights, isLoading, error } = useAIInsights();

  // Get first 2 insights for preview
  const previewInsights = insights?.split('\n').slice(0, 2) || [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <MemoizedBudgetComparisonChart />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Savings Trend</CardTitle>
            <CardDescription>Monthly savings progress</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <MemoizedSavingsChart />
        </CardContent>
      </Card>
    </div>
  );
});

