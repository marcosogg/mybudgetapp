
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { getParser } from '../utils/parserRegistry';

interface ProcessingState {
  isProcessing: boolean;
  totalRows: number;
  processedRows: number;
  isComplete: boolean;
}

export const useCSVProcessing = () => {
  const [state, setState] = useState<ProcessingState>({
    isProcessing: false,
    totalRows: 0,
    processedRows: 0,
    isComplete: false,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const processFile = async (file: File) => {
    if (!file) return;

    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('statement_format')
        .eq('id', user.id)
        .single();

      const format = userProfile?.statement_format || 'revolut';
      const parser = getParser(format);

      const transactions: any[] = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          complete: (results) => {
            const rows = results.data.slice(1) as string[][];
            const parsedTransactions = rows
              .map(row => parser.transformToTransaction(row, user.id))
              .filter((t): t is NonNullable<typeof t> => t !== null);
            
            resolve(parsedTransactions);
          },
          error: reject,
        });
      });

      if (transactions.length === 0) {
        throw new Error("No valid transactions found in the file");
      }

      const { data, error } = await supabase.functions.invoke('process-csv', {
        body: { transactions, userId: user.id }
      });

      if (error) throw error;

      const interval = setInterval(() => {
        setState(prev => {
          const next = prev.processedRows + Math.floor(Math.random() * 5) + 1;
          return {
            ...prev,
            processedRows: next > prev.totalRows ? prev.totalRows : next
          };
        });
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setState(prev => ({
          ...prev,
          processedRows: prev.totalRows,
          isComplete: true,
        }));
        toast({
          title: "Success",
          description: `Successfully imported ${data.transactionsCreated} transactions`,
        });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        
        setTimeout(() => {
          navigate('/transactions');
        }, 2000);
      }, 1000);

    } catch (error: any) {
      console.error("Processing error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  return {
    ...state,
    processFile,
    setTotalRows: (totalRows: number) => setState(prev => ({ ...prev, totalRows })),
  };
};
