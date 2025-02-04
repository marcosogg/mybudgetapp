import { Transaction } from "@/types/transaction";

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
  
  // Try different date formats
  const formats = [
    // ISO format
    (str: string) => new Date(str),
    // DD/MM/YYYY
    (str: string) => {
      const [day, month, year] = str.split('/');
      return new Date(`${year}-${month}-${day}`);
    },
    // DD-MM-YYYY
    (str: string) => {
      const [day, month, year] = str.split('-');
      return new Date(`${year}-${month}-${day}`);
    }
  ];

  for (const format of formats) {
    try {
      const date = format(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch {
      continue;
    }
  }

  return null;
};