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

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')?.split(' ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      throw new Error('Invalid token');
    }

    // Fetch recent transactions and budget data
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount, description, category:categories(name)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50);

    const { data: budgetComparison } = await supabase
      .rpc('get_budget_comparison', {
        p_user_id: user.id,
        p_period: new Date().toISOString(),
      });

    // Prepare data for AI analysis
    const transactionSummary = transactions?.map(t => ({
      amount: t.amount,
      description: t.description,
      category: t.category?.name,
    }));

    const budgetSummary = budgetComparison?.map(b => ({
      category: b.category_name,
      planned: b.planned_amount,
      actual: b.actual_amount,
      variance: b.variance,
    }));

    // Generate insights using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor analyzing spending patterns and budget data. Provide 3 concise, actionable insights based on the data. Focus on areas of overspending, potential savings, and spending patterns. Keep each insight to 1-2 sentences.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              transactions: transactionSummary,
              budgets: budgetSummary,
            }),
          },
        ],
      }),
    });

    const aiResponse = await response.json();
    const insights = aiResponse.choices[0].message.content;

    return new Response(
      JSON.stringify({ insights }),
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