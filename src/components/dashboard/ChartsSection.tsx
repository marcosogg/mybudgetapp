import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart2, PiggyBank, LineChart, RefreshCw } from "lucide-react";
import { BudgetComparisonChart } from "./BudgetComparisonChart";
import { Button } from "@/components/ui/button";
import { useAIInsights } from "@/hooks/useAIInsights";
import { cn } from "@/lib/utils";

export function ChartsSection() {
  const { insights, isLoading, error, refreshInsights } = useAIInsights();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <BudgetComparisonChart />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Spending Analysis</CardTitle>
            <CardDescription>AI-powered insights from your transactions</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshInsights}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw 
              className={cn(
                "h-5 w-5 text-muted-foreground",
                isLoading && "animate-spin"
              )} 
            />
            <span className="sr-only">Refresh insights</span>
          </Button>
        </CardHeader>
        <CardContent className="min-h-[350px] space-y-4">
          {error ? (
            <p className="text-destructive">{error}</p>
          ) : insights ? (
            insights.split('\n').map((insight, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                {insight}
              </p>
            ))
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-center">
                {isLoading ? "Generating insights..." : "Click refresh to generate AI insights"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Savings</CardTitle>
            <CardDescription>Stay on top of your financial deadlines</CardDescription>
          </div>
          <PiggyBank className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="min-h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Coming Soon</p>
        </CardContent>
      </Card>
    </div>
  );
}