import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMonth } from "@/contexts/MonthContext";
import { format } from "date-fns";

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

      const { data, error } = await supabase.functions.invoke('generate-spending-insights', {
        body: { 
          period: format(selectedMonth, 'yyyy-MM-dd')
        }
      });
      
      if (error) throw error;
      
      setInsights(data.insights);
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError('Failed to generate insights. Please try again.');
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