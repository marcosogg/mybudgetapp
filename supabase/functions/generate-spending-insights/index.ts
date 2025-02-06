import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting generate-spending-insights function');

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')!,
    });

    console.log('OpenAI client initialized');

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Supabase client initialized');

    // Get the user ID from the authorization header
    const authHeader = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the JWT and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);
    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Invalid token');
    }

    console.log('User authenticated:', user.id);

    const { period } = await req.json();
    console.log('Requested period:', period);
    
    // Get the comparison data for the selected period
    const { data: comparison, error: comparisonError } = await supabase.rpc(
      'get_budget_comparison',
      { 
        p_user_id: user.id,
        p_period: period
      }
    );

    if (comparisonError) {
      console.error('Budget comparison error:', comparisonError);
      throw comparisonError;
    }

    console.log('Budget comparison data retrieved:', comparison?.length || 0, 'categories');

    // Get transactions for the period
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select(`
        amount,
        date,
        description,
        categories (name)
      `)
      .eq('user_id', user.id)
      .gte('date', period)
      .lte('date', new Date(new Date(period).getFullYear(), new Date(period).getMonth() + 1, 0).toISOString());

    if (transactionsError) {
      console.error('Transactions error:', transactionsError);
      throw transactionsError;
    }

    console.log('Transactions retrieved:', transactions?.length || 0, 'transactions');

    // Prepare data for OpenAI
    const budgetData = {
      totalPlanned: comparison.reduce((sum, item) => sum + Number(item.planned_amount), 0),
      totalActual: comparison.reduce((sum, item) => sum + Number(item.actual_amount), 0),
      categories: comparison.map(item => ({
        name: item.category_name,
        planned: Number(item.planned_amount),
        actual: Number(item.actual_amount),
        difference: Number(item.planned_amount) - Number(item.actual_amount)
      })),
      transactions: transactions.map(t => ({
        amount: t.amount,
        date: t.date,
        description: t.description,
        category: t.categories?.name
      }))
    };

    console.log('Data prepared for OpenAI');

    // Generate insights using OpenAI
    const prompt = `As a financial advisor, analyze this budget data and provide 3-4 clear, actionable insights. Focus on patterns, concerns, and opportunities for improvement.

Budget Summary for ${period}:
Total Planned: $${budgetData.totalPlanned}
Total Actual: $${budgetData.totalActual}

Category Breakdown:
${budgetData.categories.map(c => 
  `${c.name}: Planned $${c.planned} | Actual $${c.actual} | ${c.difference >= 0 ? 'Under' : 'Over'} by $${Math.abs(c.difference)}`
).join('\n')}

Recent Transactions Summary:
${budgetData.transactions.length} transactions this period
${budgetData.transactions.slice(0, 5).map(t => 
  `- $${Math.abs(t.amount)} on ${t.date} for ${t.description} (${t.category || 'Uncategorized'})`
).join('\n')}

Please provide insights in this format:
1. Overall budget status
2. Category-specific insights
3. Spending patterns and recommendations
Each insight should be on a new line and be clear and actionable.`;

    console.log('Calling OpenAI API');

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful financial advisor providing budget insights. Keep insights clear, specific, and actionable. Focus on patterns and opportunities for improvement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    console.log('OpenAI API response received');

    const insights = completion.choices[0].message.content?.split('\n').filter(Boolean) || [];
    console.log('Generated insights:', insights);

    return new Response(
      JSON.stringify({ insights: insights.join('\n') }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});