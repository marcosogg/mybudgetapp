import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useTransactionStats(selectedMonth: Date) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['transactionStats', selectedMonth.toISOString()],
    queryFn: async () => {
      console.log('Starting transaction stats query...');
      
      const { data: session } = await supabase.auth.getSession();
      console.log('Auth session:', session?.session ? 'exists' : 'null');
      
      if (!session?.session?.user) {
        console.error('No authenticated user found');
        throw new Error('User not authenticated');
      }

      const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).toISOString();
      const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).toISOString();
      
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

      return {
        count: data?.length || 0,
        total: data?.reduce((sum, t) => sum + (t.amount < 0 ? Math.abs(t.amount) : 0), 0) || 0
      };
    },
    retry: false
  });
}