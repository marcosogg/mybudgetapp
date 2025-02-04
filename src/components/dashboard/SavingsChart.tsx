import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, startOfYear } from "date-fns";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SavingsChart() {
  const { data: savingsData, isLoading } = useQuery({
    queryKey: ["savings-trend"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get the savings category ID
      const { data: savingsCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", "Savings")
        .single();

      if (!savingsCategory) {
        return { monthlyData: [], yearTotal: 0 };
      }

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

      // Group transactions by month
      const monthlyData = transactions?.reduce((acc: any[], transaction) => {
        const month = format(new Date(transaction.date), "MMM");
        const existingMonth = acc.find(item => item.month === month);

        if (existingMonth) {
          existingMonth.amount += transaction.amount;
        } else {
          acc.push({ month, amount: transaction.amount });
        }

        return acc;
      }, []);

      // Calculate year total
      const yearTotal = transactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;

      return { 
        monthlyData: monthlyData || [], 
        yearTotal 
      };
    },
  });

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <p className="text-sm text-muted-foreground">Monthly Savings</p>
        <p className="text-sm font-medium">
          Year Total: ${savingsData?.yearTotal.toLocaleString() || '0'}
        </p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={savingsData?.monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="p-2">
                      <p className="text-sm font-medium">{payload[0].payload.month}</p>
                      <p className="text-sm text-muted-foreground">
                        ${payload[0].value?.toLocaleString()}
                      </p>
                    </Card>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="amount"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}