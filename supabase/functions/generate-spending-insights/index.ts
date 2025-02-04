import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { period } = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the comparison data for the selected period
    const { data: comparison, error: comparisonError } = await supabase.rpc(
      'get_budget_comparison',
      { 
        p_user_id: req.auth.uid,
        p_period: period
      }
    );

    if (comparisonError) throw comparisonError;

    // Calculate total planned and actual amounts
    const totalPlanned = comparison.reduce((sum, item) => sum + Number(item.planned_amount), 0);
    const totalActual = comparison.reduce((sum, item) => sum + Number(item.actual_amount), 0);
    
    // Find the most overspent category
    const overspentCategories = comparison
      .filter(item => Number(item.actual_amount) > Number(item.planned_amount))
      .sort((a, b) => 
        (Number(b.actual_amount) - Number(b.planned_amount)) - 
        (Number(a.actual_amount) - Number(a.planned_amount))
      );

    let insights = [];

    // Overall budget status
    const difference = totalPlanned - totalActual;
    if (totalActual === 0) {
      insights.push("No transactions recorded for this period yet.");
    } else {
      insights.push(
        difference >= 0 
          ? `Under budget by $${Math.abs(difference).toFixed(0)}`
          : `Over budget by $${Math.abs(difference).toFixed(0)}`
      );

      // Add insight about most overspent category if any
      if (overspentCategories.length > 0) {
        const worst = overspentCategories[0];
        const overAmount = Number(worst.actual_amount) - Number(worst.planned_amount);
        insights.push(
          `${worst.category_name} is over budget by $${overAmount.toFixed(0)}`
        );
      }
    }

    return new Response(
      JSON.stringify({ insights: insights.join('\n') }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});