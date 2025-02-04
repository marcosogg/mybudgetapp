import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')?.split(' ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      throw new Error('Invalid token');
    }

    // Get current month's data
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Fetch budget comparison data
    const { data: budgetComparison } = await supabase
      .rpc('get_budget_comparison', {
        p_user_id: user.id,
        p_period: startOfMonth.toISOString(),
      });

    // Calculate total budget and spending
    const totalBudget = budgetComparison?.reduce((sum, item) => sum + Number(item.planned_amount), 0) || 0;
    const totalSpent = budgetComparison?.reduce((sum, item) => sum + Number(item.actual_amount), 0) || 0;
    
    // Find most overspent category
    const overspentCategories = budgetComparison
      ?.filter(item => item.actual_amount > item.planned_amount)
      .sort((a, b) => (b.actual_amount - b.planned_amount) - (a.actual_amount - a.planned_amount));
    
    const mostOverspentCategory = overspentCategories?.[0];

    // Generate focused insights
    const insights = [];

    // Overall budget status
    const budgetPercentage = (totalSpent / totalBudget) * 100;
    if (budgetPercentage > 100) {
      insights.push(`You're ${(budgetPercentage - 100).toFixed(0)}% over your total monthly budget.`);
    } else {
      insights.push(`You've used ${budgetPercentage.toFixed(0)}% of your total monthly budget.`);
    }

    // Most overspent category
    if (mostOverspentCategory) {
      const overAmount = mostOverspentCategory.actual_amount - mostOverspentCategory.planned_amount;
      insights.push(`${mostOverspentCategory.category_name} is your most overspent category, exceeding budget by $${overAmount.toFixed(0)}.`);
    }

    // Response with exactly 2 insights
    return new Response(
      JSON.stringify({ insights: insights.join('\n') }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating insights:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});