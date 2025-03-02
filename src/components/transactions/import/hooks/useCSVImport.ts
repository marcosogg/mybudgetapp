
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseCSVFile } from "../utils/csvValidation";
import { ParsedTransaction } from "../utils/baseParser";
import { useCSVProcessing } from "./useCSVProcessing";
import { getParser } from "../utils/parserRegistry";

export interface ImportState {
  file: File | null;
  previewData: ParsedTransaction[];
  error: string | null;
}

export const useCSVImport = () => {
  const [state, setState] = useState<ImportState>({
    file: null,
    previewData: [],
    error: null,
  });

  const { toast } = useToast();
  const {
    isProcessing,
    totalRows,
    processedRows,
    isComplete,
    processFile,
    setTotalRows
  } = useCSVProcessing();

  const resetState = () => {
    setState(prev => ({
      ...prev,
      error: null,
      previewData: [],
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
    
    parseCSVFile(
      selectedFile,
      async (results) => {
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

        const format = userProfile?.statement_format || 'revolut';
        const parser = getParser(format);
        
        if (!parser.validateHeaders(headers)) {
          setState(prev => ({ 
            ...prev, 
            error: `Invalid ${format} CSV format. Please ensure you're using the correct export format.` 
          }));
          return;
        }

        const rows = results.data.slice(1) as string[][];
        const parsedData = rows
          .map(row => parser.parseTransaction(row))
          .filter((row): row is NonNullable<typeof row> => row !== null);
        
        if (parsedData.length === 0) {
          setState(prev => ({
            ...prev,
            error: "No valid transactions found in the file. Please check the date format and ensure there are negative amounts."
          }));
          return;
        }

        setTotalRows(parsedData.length);
        setState(prev => ({
          ...prev,
          previewData: parsedData.slice(0, 5),
        }));
      },
      (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      }
    );
  };

  return {
    ...state,
    isProcessing,
    totalRows,
    processedRows,
    isComplete,
    handleFileChange,
    processFile: () => state.file && processFile(state.file),
  };
};
