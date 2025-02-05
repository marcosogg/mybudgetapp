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
  
  // Strip any time component by taking only the date part
  const datePart = dateStr.split(' ')[0];
  
  // Normalize separators to slashes
  const normalizedDate = datePart.replace(/-/g, '/');
  
  // Try parsing with common date formats
  const formats = [
    'dd/MM/yyyy',
    'yyyy/MM/dd'
  ];

  for (const formatStr of formats) {
    const parsedDate = parse(normalizedDate, formatStr, new Date());
    if (isValid(parsedDate)) {
      return format(parsedDate, 'yyyy-MM-dd');
    }
  }
  
  return null;
};