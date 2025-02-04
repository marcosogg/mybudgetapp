import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { BudgetComparisonChart } from "./BudgetComparisonChart";
import { Button } from "@/components/ui/button";
import { useAIInsights } from "@/hooks/useAIInsights";
import { cn } from "@/lib/utils";
import { SavingsChart } from "./SavingsChart";

const InsightItem = ({ content }: { content: string }) => {
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
      <p className="text-sm leading-tight">{content}</p>
    </div>
  );
};

export function ChartsSection() {
  const { insights, isLoading, error, refreshInsights } = useAIInsights();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <BudgetComparisonChart />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Quick Insights</CardTitle>
            <CardDescription>AI-powered budget analysis</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshInsights}
            disabled={isLoading}
            className="h-8 w-8"
            aria-label="Refresh insights"
          >
            <RefreshCw 
              className={cn(
                "h-4 w-4 text-muted-foreground",
                isLoading && "animate-spin"
              )} 
            />
            <span className="sr-only">Refresh insights</span>
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-sm text-destructive">
              Failed to load insights
            </div>
          ) : insights ? (
            <div className="space-y-0">
              {insights.split('\n').map((insight, index) => (
                <InsightItem key={index} content={insight} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              {isLoading ? "Analyzing your spending..." : "Click refresh to generate insights"}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Savings Trend</CardTitle>
            <CardDescription>Monthly savings progress</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <SavingsChart />
        </CardContent>
      </Card>
    </div>
  );
}