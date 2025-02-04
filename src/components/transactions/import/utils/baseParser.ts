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
  if (!dateStr?.trim()) return null;
  
  console.log('Attempting to parse date:', {
    rawInput: dateStr,
    containsSlash: dateStr.includes('/'),
    containsHyphen: dateStr.includes('-')
  });
  
  try {
    // First try to parse the date with slashes
    let dateToFormat = dateStr;
    if (dateStr.includes('-')) {
      dateToFormat = dateStr.replace(/-/g, '/');
      console.log('Converted hyphens to slashes:', dateToFormat);
    }

    // Parse Wise format (DD/MM/YYYY)
    const wiseDate = parse(dateToFormat, 'dd/MM/yyyy', new Date());
    if (isValid(wiseDate)) {
      const formattedDate = format(wiseDate, 'yyyy-MM-dd');
      console.log('Successfully parsed Wise date:', {
        input: dateStr,
        converted: dateToFormat,
        output: formattedDate
      });
      return formattedDate;
    }

    // Fallback to Revolut format (DD/MM/YYYY HH:mm)
    const revolutDate = parse(dateToFormat, 'dd/MM/yyyy HH:mm', new Date());
    if (isValid(revolutDate)) {
      const formattedDate = format(revolutDate, 'yyyy-MM-dd');
      console.log('Successfully parsed Revolut date:', {
        input: dateStr,
        converted: dateToFormat,
        output: formattedDate
      });
      return formattedDate;
    }

    console.warn(`Unable to parse date: ${dateStr}`, {
      attemptedFormats: ['dd/MM/yyyy', 'dd/MM/yyyy HH:mm'],
      withSlashes: dateToFormat
    });
    return null;
  } catch (error) {
    console.error(`Error parsing date ${dateStr}:`, error);
    return null;
  }
};