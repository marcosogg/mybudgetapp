import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Papa from 'papaparse';
import { supabase } from "@/integrations/supabase/client";
import { validateWiseFormat, transformWiseData } from "../utils/wiseTransformer";

// Constants for Revolut format
const REVOLUT_HEADERS = [
  'Type', 'Product', 'Started Date', 'Completed Date', 
  'Description', 'Amount', 'Fee', 'Currency', 'State', 'Balance'
];

const DATE_INDEX = 3;
const DESCRIPTION_INDEX = 4;
const AMOUNT_INDEX = 5;

export interface ImportState {
  file: File | null;
  previewData: Array<{ date: string; description: string; amount: string; }>;
  error: string | null;
  isProcessing: boolean;
  totalRows: number;
  processedRows: number;
  isComplete: boolean;
}

const formatDate = (dateStr: string): string | null => {
  if (!dateStr?.trim()) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
};

export const useCSVImport = () => {
  const [state, setState] = useState<ImportState>({
    file: null,
    previewData: [],
    error: null,
    isProcessing: false,
    totalRows: 0,
    processedRows: 0,
    isComplete: false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const resetState = () => {
    setState(prev => ({
      ...prev,
      error: null,
      isComplete: false,
      processedRows: 0,
    }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    resetState();
    
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, file: selectedFile }));
    
    Papa.parse(selectedFile, {
      complete: async (results) => {
        if (results.data.length === 0) {
          setState(prev => ({ ...prev, error: "The CSV file is empty" }));
          return;
        }

        const headers = results.data[0] as string[];
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setState(prev => ({ ...prev, error: "User not authenticated" }));
          return;
        }

        const { data: userProfile } = await supabase
          .from('profiles')
          .select('statement_format')
          .eq('id', user.id)
          .single();

        const isWiseFormat = userProfile?.statement_format === 'wise';
        
        if (isWiseFormat) {
          if (!validateWiseFormat(headers)) {
            setState(prev => ({ 
              ...prev, 
              error: "Invalid Wise CSV format. Please ensure you're using the correct export format from Wise." 
            }));
            return;
          }
          console.log('Processing Wise format');
          toast({
            title: "Wise Format Detected",
            description: "Note: Wise import support is coming soon.",
          });
          return;
        }

        // Existing Revolut format validation
        if (!REVOLUT_HEADERS.every((header, index) => headers[index] === header)) {
          setState(prev => ({ 
            ...prev, 
            error: "Invalid CSV format. Please ensure the file matches the expected Revolut format." 
          }));
          return;
        }

        const rows = results.data.slice(1) as string[][];
        const parsedData = rows.map(row => ({
          date: formatDate(row[DATE_INDEX]) || '',
          description: row[DESCRIPTION_INDEX],
          amount: row[AMOUNT_INDEX],
        }));

        const validData = parsedData.filter(row => {
          const amount = parseFloat(row.amount);
          return row.date && amount < 0;
        });
        
        if (validData.length === 0) {
          setState(prev => ({
            ...prev,
            error: "No valid transactions found in the file. Please check the date format and ensure there are negative amounts."
          }));
          return;
        }

        setState(prev => ({
          ...prev,
          previewData: validData.slice(0, 5),
          totalRows: validData.length,
        }));
      },
      error: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const processFile = async () => {
    if (!state.file) return;

    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const transactions: any[] = await new Promise((resolve, reject) => {
        Papa.parse(state.file!, {
          complete: (results) => {
            const rows = results.data.slice(1) as string[][];
            const parsedTransactions = rows
              .map(row => {
                const date = formatDate(row[DATE_INDEX]);
                const amount = parseFloat(row[AMOUNT_INDEX]);
                if (!date || amount >= 0) return null;
                
                return {
                  user_id: user.id,
                  date,
                  description: row[DESCRIPTION_INDEX],
                  amount,
                  tags: [],
                  category_id: null,
                };
              })
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
    handleFileChange,
    processFile,
  };
};
