import { TrendingUp, TrendingDown, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useMonthlyBudgetComparison } from "@/hooks/budget/useMonthlyBudgetComparison";
import { format, subMonths } from "date-fns";
import { useMonth } from "@/contexts/MonthContext";

const chartConfig = {
  planned: {
    label: "Planned",
    color: "hsl(var(--chart-1))", // Light blue
  },
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-2))", // Dark blue
  },
} satisfies ChartConfig;

export function BudgetComparisonChart() {
  const { selectedMonth } = useMonth();
  // Get start date as 2 months before selected month
  const startDate = subMonths(selectedMonth, 2);
  const endDate = selectedMonth;
  
  const { data: comparison } = useMonthlyBudgetComparison();

  // Process and sort the data to ensure we have exactly 3 months
  const chartData = Array.from({ length: 3 }, (_, index) => {
    const monthDate = subMonths(selectedMonth, 2 - index);
    const monthData = comparison?.find(
      (item) => format(new Date(item.month), 'yyyy-MM') === format(monthDate, 'yyyy-MM')
    );

    return {
      month: format(monthDate, 'MMMM'),
      monthDate, // Keep the full date for sorting
      planned: monthData?.planned_total || 0,
      actual: monthData?.actual_total || 0,
    };
  }).sort((a, b) => a.monthDate.getTime() - b.monthDate.getTime());

  // Calculate trend percentage based on the last two months
  const lastTwoMonths = chartData.slice(-2);
  const trend = lastTwoMonths.length === 2 && lastTwoMonths[0].actual !== 0
    ? ((lastTwoMonths[1].actual - lastTwoMonths[0].actual) / lastTwoMonths[0].actual) * 100
    : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Monthly Budget Overview</CardTitle>
          <CardDescription>Showing budget comparison for the last 3 months</CardDescription>
        </div>
        <LineChart className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} height={350}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={({ label, payload }) => (
                <ChartTooltipContent 
                  label={label}
                  payload={payload}
                  indicator="dashed"
                  formatter={(value: number) => 
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(value)
                  }
                />
              )}
            />
            <Bar 
              dataKey="planned" 
              fill={chartConfig.planned.color}
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="actual" 
              fill={chartConfig.actual.color}
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {trend > 0 ? (
            <>
              Trending up by {Math.abs(trend).toFixed(1)}% this month
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(trend).toFixed(1)}% this month
              <TrendingDown className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing budget comparison for the last 3 months
        </div>
      </CardFooter>
    </Card>
  );
}