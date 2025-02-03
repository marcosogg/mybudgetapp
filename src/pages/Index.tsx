import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BudgetSummaryCard } from "@/components/dashboard/BudgetSummaryCard";
import { IncomeSummaryCard } from "@/components/dashboard/IncomeSummaryCard";
import { TransactionSummaryCard } from "@/components/dashboard/TransactionSummaryCard";
import { BudgetComparisonChart } from "@/components/dashboard/BudgetComparisonChart";
import { UpcomingReminders } from "@/components/reminders/UpcomingReminders";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MonthPicker } from "@/components/budget/MonthPicker";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch recent transaction count and total
  const { data: transactionStats, error: transactionError } = useQuery({
    queryKey: ['transactionStats'],
    queryFn: async () => {
      console.log('Starting transaction stats query...');
      
      const { data: session } = await supabase.auth.getSession();
      console.log('Auth session:', session?.session ? 'exists' : 'null');
      
      if (!session?.session?.user) {
        console.error('No authenticated user found');
        throw new Error('User not authenticated');
      }

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();
      
      console.log('Date range:', { startOfMonth, endOfMonth });

      const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', session.session.user.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth);

      if (error) {
        console.error('Supabase query error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch transaction statistics",
        });
        throw error;
      }

      console.log('Retrieved transactions:', data?.length || 0);
      console.log('Transaction data:', data);

      const stats = {
        count: data?.length || 0,
        total: data?.reduce((sum, t) => sum + (t.amount < 0 ? Math.abs(t.amount) : 0), 0) || 0
      };

      console.log('Calculated stats:', stats);
      return stats;
    },
    retry: false
  });

  if (transactionError) {
    console.error('Transaction query error:', transactionError);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Your financial overview
          </p>
        </div>
        <Button
          onClick={() => navigate("/transactions/import")}
          variant="outline"
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-medium">Period Overview</CardTitle>
          <MonthPicker />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BudgetSummaryCard />
            <IncomeSummaryCard />
            <TransactionSummaryCard 
              count={transactionStats?.count || 0}
              total={transactionStats?.total || 0}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <BudgetComparisonChart />
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground text-lg">PLACEHOLDER</p>
          </CardContent>
        </Card>
      </div>

      <UpcomingReminders />
    </div>
  );
};

export default Index;