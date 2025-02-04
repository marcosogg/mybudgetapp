import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths } from "date-fns";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
        return [];
      }

      // Get last 6 months of savings data
      const endDate = new Date();
      const startDate = subMonths(endDate, 5); // Get 6 months of data

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

      return monthlyData || [];
    },
  });

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={savingsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          <Area
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}