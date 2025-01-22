import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { transactions, userId } = await req.json()

    if (!transactions || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Processing ${transactions.length} transactions for user ${userId}`)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Filter out transactions with invalid dates
    const validTransactions = transactions.filter(transaction => {
      const date = transaction.date?.trim();
      return date && !isNaN(Date.parse(date));
    });

    if (validTransactions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid transactions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Found ${validTransactions.length} valid transactions out of ${transactions.length} total`)

    // Process transactions in batches of 100
    const batchSize = 100
    const results = []
    
    for (let i = 0; i < validTransactions.length; i += batchSize) {
      const batch = validTransactions.slice(i, i + batchSize)
      console.log(`Inserting batch ${i/batchSize + 1} of ${Math.ceil(validTransactions.length/batchSize)}`)
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(batch)
        .select()

      if (error) {
        console.error('Error inserting batch:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to insert transactions', details: error }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      results.push(...(data || []))
    }

    return new Response(
      JSON.stringify({
        message: 'Transactions processed successfully',
        transactionsCreated: results.length,
        totalTransactions: transactions.length,
        validTransactions: validTransactions.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})