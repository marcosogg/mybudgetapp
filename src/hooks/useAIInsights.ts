import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAIInsights() {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-spending-insights');
      
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