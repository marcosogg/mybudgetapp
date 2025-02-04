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
  
  try {
    // Try parsing as Revolut format (with time)
    const revolutDate = parse(dateStr, 'dd/MM/yyyy HH:mm', new Date());
    if (isValid(revolutDate)) {
      return format(revolutDate, 'yyyy-MM-dd');
    }

    // Try parsing as Wise format (without time)
    const wiseDate = parse(dateStr, 'dd/MM/yyyy', new Date());
    if (isValid(wiseDate)) {
      return format(wiseDate, 'yyyy-MM-dd');
    }

    // Try parsing ISO format as fallback
    const isoDate = new Date(dateStr);
    if (isValid(isoDate)) {
      return format(isoDate, 'yyyy-MM-dd');
    }

    console.warn(`Unable to parse date: ${dateStr}`);
    return null;
  } catch (error) {
    console.error(`Error parsing date ${dateStr}:`, error);
    return null;
  }
};