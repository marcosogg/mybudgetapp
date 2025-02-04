import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { BudgetComparisonChart } from "./BudgetComparisonChart";
import { Button } from "@/components/ui/button";
import { useAIInsights } from "@/hooks/useAIInsights";
import { cn } from "@/lib/utils";

const InsightItem = ({ content }: { content: string }) => {
  const isPositive = content.toLowerCase().includes('under') || 
                     !content.toLowerCase().includes('over');
  
  return (
    <div className={cn(
      "p-4 rounded-lg flex items-start gap-3",
      "bg-card hover:bg-accent/50 transition-colors",
      "border border-border"
    )}>
      <span className="mt-1">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-primary" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive" />
        )}
      </span>
      <p className="text-sm">{content}</p>
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
                "h-5 w-5 text-muted-foreground",
                isLoading && "animate-spin"
              )} 
            />
            <span className="sr-only">Refresh insights</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="text-sm text-destructive">
              Failed to load insights
            </div>
          ) : insights ? (
            insights.split('\n').map((insight, index) => (
              <InsightItem key={index} content={insight} />
            ))
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
            <CardTitle>Savings</CardTitle>
            <CardDescription>Stay on top of your financial deadlines</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="min-h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Coming Soon</p>
        </CardContent>
      </Card>
    </div>
  );
}