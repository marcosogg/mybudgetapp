
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
import { useState } from "react";
import { SimpleGoalDialog } from "@/components/savings/SimpleGoalDialog";
import { Separator } from "@/components/ui/separator";

export function SavingsChart() {
  const { data: savingsData, isLoading } = useSavingsData();
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);

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
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Savings Trend</h3>
        {savingsData?.currentGoal && (
          <Badge variant={savingsData.goalProgress >= 100 ? "default" : "secondary"}>
            {savingsData.goalProgress.toFixed(1)}% of Goal
          </Badge>
        )}
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
              radius={CHART_CONSTANTS.BAR_RADIUS}
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
      
      <Separator className="my-6" />
      
      {savingsData && (
        <SavingsMetricsCards
          yearTotal={savingsData.yearTotal}
          averageMonthlySavings={savingsData.averageMonthlySavings}
          goalProgress={savingsData.goalProgress}
          hasGoal={!!savingsData.currentGoal}
          onSetGoal={() => setIsGoalDialogOpen(true)}
        />
      )}

      <SimpleGoalDialog
        open={isGoalDialogOpen}
        onOpenChange={setIsGoalDialogOpen}
        currentGoal={savingsData?.currentGoal || undefined}
      />
    </Card>
  );
}
