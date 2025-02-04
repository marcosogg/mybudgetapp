import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCw, TrendingUp, TrendingDown, AlertTriangle, PiggyBank } from "lucide-react";
import { BudgetComparisonChart } from "./BudgetComparisonChart";
import { Button } from "@/components/ui/button";
import { useAIInsights } from "@/hooks/useAIInsights";
import { cn } from "@/lib/utils";

interface InsightProps {
  type: 'positive' | 'warning' | 'alert';
  content: string;
}

const InsightItem = ({ type, content }: InsightProps) => {
  const getIcon = () => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'alert':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <PiggyBank className="h-4 w-4" />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'positive':
        return 'border-l-4 border-green-500 bg-green-50 dark:bg-green-950/10';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/10';
      case 'alert':
        return 'border-l-4 border-destructive bg-destructive/10';
      default:
        return '';
    }
  };

  return (
    <div className={cn(
      "p-3 rounded-md flex items-start gap-3 transition-colors",
      "hover:bg-muted/50",
      getTypeStyles()
    )}>
      <span className="mt-1">{getIcon()}</span>
      <p className="text-sm text-muted-foreground">{content}</p>
    </div>
  );
};

const parseInsightType = (insight: string): 'positive' | 'warning' | 'alert' => {
  const lowerInsight = insight.toLowerCase();
  if (lowerInsight.includes('increase') || lowerInsight.includes('saved') || lowerInsight.includes('under budget')) {
    return 'positive';
  }
  if (lowerInsight.includes('warning') || lowerInsight.includes('attention')) {
    return 'warning';
  }
  if (lowerInsight.includes('over budget') || lowerInsight.includes('exceeded')) {
    return 'alert';
  }
  return 'positive';
};

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
            aria-label="Refresh financial insights"
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
            <div className="flex items-center gap-2 text-destructive p-3 rounded-md bg-destructive/10">
              <AlertTriangle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          ) : insights ? (
            <div className="space-y-3">
              {insights.split('\n').map((insight, index) => (
                <InsightItem 
                  key={index}
                  type={parseInsightType(insight)}
                  content={insight}
                />
              ))}
            </div>
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