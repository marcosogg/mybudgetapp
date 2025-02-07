
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  ReferenceLine,
  Line,
  ComposedChart
} from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSavingsData } from "./hooks/useSavingsData";
import { SavingsChartTooltip } from "./SavingsChartTooltip";
import { SavingsMetricsCards } from "./SavingsMetricsCards";
import { CHART_CONSTANTS } from "./utils/constants";

export function SavingsChart() {
  const { data: savingsData, isLoading } = useSavingsData();

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" data-testid="skeleton" />;
  }

  const allData = [
    ...(savingsData?.monthlyData || []),
    ...(savingsData?.projections?.map(p => ({
      month: p.month,
      projected_amount: p.projected_amount,
      is_projection: true
    })) || [])
  ];

  const monthlyGoalAmount = savingsData?.currentGoal 
    ? savingsData.currentGoal.target_amount / 12 
    : 0;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Monthly Savings</h3>
          <p className="text-sm text-muted-foreground">Track your savings progress</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={savingsData?.goalProgress && savingsData.goalProgress >= 100 ? "default" : "secondary"}>
            {savingsData?.goalProgress?.toFixed(1)}% of Goal
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Year Total: ${savingsData?.yearTotal?.toLocaleString()}</p>
                <p>Monthly Avg: ${savingsData?.averageMonthlySavings?.toLocaleString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={allData} margin={CHART_CONSTANTS.MARGIN}>
            <XAxis 
              dataKey="month" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${Math.abs(value).toLocaleString()}`}
            />
            <SavingsChartTooltip goalAmount={monthlyGoalAmount} />
            <ReferenceLine 
              y={0} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="3 3" 
            />
            {savingsData?.currentGoal && (
              <ReferenceLine 
                y={monthlyGoalAmount} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="3 3"
                label={{ 
                  value: `Monthly Goal: $${monthlyGoalAmount.toLocaleString()}`,
                  position: "right",
                  fill: "hsl(var(--primary))",
                  fontSize: 12
                }}
              />
            )}
            <Bar
              dataKey="amount"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0] as [number, number, number, number]}
              fillOpacity={CHART_CONSTANTS.FILL_OPACITY}
              isAnimationActive={false}
            />
            <Line
              dataKey="projected_amount"
              stroke="hsl(var(--primary))"
              strokeDasharray={CHART_CONSTANTS.STROKE_DASHARRAY}
              strokeWidth={CHART_CONSTANTS.STROKE_WIDTH}
              dot={{ 
                fill: "hsl(var(--primary))", 
                r: CHART_CONSTANTS.DOT_RADIUS 
              }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {savingsData && (
        <SavingsMetricsCards
          yearTotal={savingsData.yearTotal}
          averageMonthlySavings={savingsData.averageMonthlySavings}
          goalProgress={savingsData.goalProgress}
        />
      )}
    </Card>
  );
}
