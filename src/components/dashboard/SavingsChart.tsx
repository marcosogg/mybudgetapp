import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, startOfYear, addMonths } from "date-fns";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  Tooltip, 
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
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SavingsChartData, MonthlySavingsData, SavingsProjection, SavingsGoal, SavingsGoalType } from "@/types/savings";
import type { Database } from "@/types/supabase";

type Tables = Database['public']['Tables'];
type SavingsGoalRow = Tables['savings_goals']['Row'];
type CategoryRow = Tables['categories']['Row'];
type TransactionRow = Tables['transactions']['Row'];

const calculateTrendIndicator = (current: number, previous: number): 'up' | 'down' | 'stable' => {
  const difference = current - previous;
  if (Math.abs(difference) < 10) return 'stable';
  return difference > 0 ? 'up' : 'down';
};

const calculateProjections = (
  historicalData: MonthlySavingsData[],
  monthsAhead: number = 2
): SavingsProjection[] => {
  if (historicalData.length < 3) return [];

  const last3Months = historicalData.slice(-3);
  const avgChange = last3Months.reduce((sum, curr, idx, arr) => {
    if (idx === 0) return sum;
    return sum + (curr.amount - arr[idx - 1].amount);
  }, 0) / 2;

  const lastMonth = last3Months[last3Months.length - 1];
  const projections: SavingsProjection[] = [];

  for (let i = 1; i <= monthsAhead; i++) {
    const projectedDate = addMonths(new Date(), i);
    const projectedAmount = lastMonth.amount + (avgChange * i);
    
    projections.push({
      month: format(projectedDate, "MMM"),
      projected_amount: projectedAmount,
      confidence_score: 1 - (i * 0.2) // Confidence decreases as we project further
    });
  }

  return projections;
};

export function SavingsChart() {
  const { data: savingsData, isLoading } = useQuery<SavingsChartData, Error>({
    queryKey: ["savings-trend"],
    queryFn: async () => {
      // Check authentication first
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error("Authentication error:", authError);
        throw new Error("Authentication failed");
      }

      if (!authData.session) {
        console.error("No active session");
        throw new Error("Not authenticated");
      }

      const user = authData.session.user;
      if (!user) throw new Error("User not authenticated");

      // Get the savings category ID
      const { data: savingsCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", "Savings")
        .single();

      if (!savingsCategory) {
        return { 
          monthlyData: [], 
          yearTotal: 0,
          currentGoal: null,
          projections: [],
          averageMonthlySavings: 0,
          goalProgress: 0
        } as SavingsChartData;
      }

      // Get current savings goal
      const { data: goalData, error: goalError } = await supabase
        .from("savings_goals")
        .select(`
          id, user_id, target_amount, goal_type,
          recurring_amount, period_start, period_end,
          notes, created_at
        `)
        .eq("user_id", user.id)
        .is("period_end", null)
        .maybeSingle();

      if (goalError) {
        console.error("Error fetching savings goal:", goalError);
        // Return empty data instead of throwing
        return { 
          monthlyData: [], 
          yearTotal: 0,
          currentGoal: null,
          projections: [],
          averageMonthlySavings: 0,
          goalProgress: 0
        } as SavingsChartData;
      }

      const currentGoal = goalData ? {
        id: goalData.id,
        user_id: goalData.user_id,
        goal_type: goalData.goal_type as SavingsGoalType,
        target_amount: Number(goalData.target_amount),
        recurring_amount: goalData.recurring_amount ? Number(goalData.recurring_amount) : undefined,
        period_start: new Date(goalData.period_start),
        period_end: goalData.period_end ? new Date(goalData.period_end) : undefined,
        notes: goalData.notes,
        created_at: new Date(goalData.created_at)
      } : null;

      // Get this year's savings data
      const startDate = startOfYear(new Date());
      const endDate = new Date();

      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("date, amount")
        .eq("category_id", savingsCategory.id)
        .eq("user_id", user.id)
        .gte("date", format(startDate, "yyyy-MM-dd"))
        .lte("date", format(endDate, "yyyy-MM-dd"))
        .order("date", { ascending: true });

      if (error) throw error;

      // Ensure savings amounts are positive for deposits
      const processedTransactions = transactions?.map(t => ({
        ...t,
        // Convert negative amounts to positive for savings deposits
        amount: Math.abs(t.amount)
      }));

      // Group transactions by month with enhanced metrics
      const monthlyData: MonthlySavingsData[] = [];
      let previousAmount = 0;

      // Create a map of all months from start of year to current month
      const monthsMap: { [key: string]: number } = {};
      let currentDate = startOfYear(new Date());
      const now = new Date();
      
      while (currentDate <= now) {
        monthsMap[format(currentDate, "MMM")] = 0;
        currentDate = addMonths(currentDate, 1);
      }

      // Fill in actual transaction amounts
      const monthlyAmounts = processedTransactions?.reduce((acc: { [key: string]: number }, transaction) => {
        const month = format(new Date(transaction.date), "MMM");
        acc[month] = (acc[month] || 0) + transaction.amount;
        return acc;
      }, {...monthsMap}); // Start with all months initialized to 0

      Object.entries(monthlyAmounts || {}).forEach(([month, amount]) => {
        const monthlyGoalAmount = currentGoal ? currentGoal.target_amount / 12 : 0;
        
        monthlyData.push({
          month,
          amount,
          goal_amount: monthlyGoalAmount,
          percentage_of_goal: monthlyGoalAmount ? (amount / monthlyGoalAmount) * 100 : 0,
          trend_indicator: calculateTrendIndicator(amount, previousAmount),
          is_negative: amount < 0
        });

        previousAmount = amount;
      });

      const yearTotal = monthlyData.reduce((sum, month) => sum + month.amount, 0);
      const averageMonthlySavings = yearTotal / monthlyData.length || 0;
      const projections = calculateProjections(monthlyData);
      const goalProgress = currentGoal 
        ? (yearTotal / currentGoal.target_amount) * 100 
        : 0;

      return { 
        monthlyData, 
        yearTotal,
        currentGoal,
        projections,
        averageMonthlySavings,
        goalProgress
      } as SavingsChartData;
    },
  });

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  const allData = [
    ...(savingsData?.monthlyData || []),
    ...(savingsData?.projections?.map(p => ({
      month: p.month,
      projected_amount: p.projected_amount,
      is_projection: true
    })) || [])
  ];

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
            <UITooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Year Total: ${savingsData?.yearTotal?.toLocaleString()}</p>
                <p>Monthly Avg: ${savingsData?.averageMonthlySavings?.toLocaleString()}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={allData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
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
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as any;
                  const goalAmount = savingsData?.currentGoal?.target_amount ? 
                    savingsData.currentGoal.target_amount / 12 : 0;
                  
                  return (
                    <Card className="p-3 space-y-2 border-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{data.month}</p>
                        {data.trend_indicator && (
                          <Badge variant={
                            data.trend_indicator === 'up' ? 'default' :
                            data.trend_indicator === 'down' ? 'destructive' : 
                            'secondary'
                          }>
                            {data.trend_indicator === 'up' ? '↑' :
                             data.trend_indicator === 'down' ? '↓' : '→'}
                          </Badge>
                        )}
                      </div>
                      {data.is_projection ? (
                        <div className="space-y-1">
                          <p className="text-sm">
                            Projected: ${data.projected_amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Confidence: {(data.confidence_score * 100).toFixed(0)}%
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-sm">
                            Saved: ${data.amount.toLocaleString()}
                          </p>
                          {goalAmount > 0 && (
                            <>
                              <p className="text-xs text-muted-foreground">
                                Monthly Goal: ${goalAmount.toLocaleString()}
                              </p>
                              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-primary h-full transition-all"
                                  style={{ 
                                    width: `${Math.min(100, (data.amount / goalAmount) * 100)}%`
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine 
              y={0} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="3 3" 
            />
            {savingsData?.currentGoal && (
              <ReferenceLine 
                y={savingsData.currentGoal.target_amount / 12} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="3 3"
                label={{ 
                  value: `Monthly Goal: $${(savingsData.currentGoal.target_amount / 12).toLocaleString()}`,
                  position: "right",
                  fill: "hsl(var(--primary))",
                  fontSize: 12
                }}
              />
            )}
            <Bar
              dataKey="amount"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.8}
              isAnimationActive={false}
            />
            <Line
              dataKey="projected_amount"
              stroke="hsl(var(--primary))"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Add summary metrics below chart */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Year to Date</p>
          <p className="text-2xl font-bold">${savingsData?.yearTotal.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Monthly Average</p>
          <p className="text-2xl font-bold">${savingsData?.averageMonthlySavings.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Goal Progress</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold">{savingsData?.goalProgress.toFixed(1)}%</p>
            {savingsData?.goalProgress >= 100 && (
              <Badge variant="default" className="mb-1">Achieved!</Badge>
            )}
          </div>
        </Card>
      </div>
    </Card>
  );
}