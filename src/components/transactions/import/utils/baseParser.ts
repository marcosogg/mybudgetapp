import { Transaction } from "@/types/transaction";
import { parse, isValid, format } from "date-fns";

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: string;
}

export interface StatementParser {
  validateHeaders: (headers: string[]) => boolean;
  parseTransaction: (row: string[]) => ParsedTransaction | null;
  transformToTransaction: (row: string[], userId: string) => Omit<Transaction, "id" | "created_at"> | null;
}

export const formatDate = (dateStr: string): string | null => {
  if (!dateStr?.trim()) {
    console.log('Empty or invalid date string received');
    return null;
  }
  
  console.log('Attempting to parse date:', {
    rawInput: dateStr,
    containsSlash: dateStr.includes('/'),
    containsHyphen: dateStr.includes('-')
  });
  
  try {
    // Normalize date separators to slashes for consistent parsing
    let dateToFormat = dateStr.trim();
    if (dateStr.includes('-')) {
      dateToFormat = dateStr.replace(/-/g, '/');
      console.log('Normalized date separators:', {
        original: dateStr,
        normalized: dateToFormat
      });
    }

    // Try parsing common date formats
    const formats = [
      'dd/MM/yyyy',      // DD/MM/YYYY
      'dd/MM/yyyy HH:mm', // DD/MM/YYYY HH:mm
      'yyyy/MM/dd',      // YYYY/MM/DD
      'yyyy/MM/dd HH:mm' // YYYY/MM/DD HH:mm
    ];

    for (const formatStr of formats) {
      const parsedDate = parse(dateToFormat, formatStr, new Date());
      if (isValid(parsedDate)) {
        const formattedDate = format(parsedDate, 'yyyy-MM-dd');
        console.log('Successfully parsed date:', {
          input: dateStr,
          format: formatStr,
          output: formattedDate
        });
        return formattedDate;
      }
    }

    console.warn('Failed to parse date with any format:', {
      input: dateStr,
      normalized: dateToFormat,
      attemptedFormats: formats
    });
    return null;

  } catch (error) {
    console.error('Error parsing date:', {
      input: dateStr,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return null;
  }
};