import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMonth } from "@/contexts/MonthContext";
import { format } from "date-fns";
import { toast } from "sonner";

export function useAIInsights() {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedMonth } = useMonth();

  const refreshInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      console.log('Calling generate-spending-insights with period:', format(selectedMonth, 'yyyy-MM-dd'));
      
      const { data, error } = await supabase.functions.invoke('generate-spending-insights', {
        body: { 
          period: format(selectedMonth, 'yyyy-MM-dd')
        }
      });
      
      console.log('Response from generate-spending-insights:', { data, error });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      if (!data?.insights) {
        console.error('No insights returned from function');
        throw new Error('No insights returned from function');
      }
      
      setInsights(data.insights);
      toast.success('Insights updated successfully');
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError('Failed to generate insights. Please try again.');
      toast.error('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    insights,
    isLoading,
    error,
    refreshInsights,
  };
}