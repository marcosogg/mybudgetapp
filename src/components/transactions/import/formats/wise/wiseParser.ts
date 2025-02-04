import { StatementParser, ParsedTransaction } from "../../utils/baseParser";
import { formatDate } from "../../utils/baseParser";
import { Transaction } from "@/types/transaction";

export const WISE_HEADERS = ['Date', 'Amount', 'Description'];

export const WiseParser: StatementParser = {
  validateHeaders: (headers: string[]): boolean => {
    return WISE_HEADERS.every(requiredHeader => 
      headers.some(header => header === requiredHeader)
    );
  },

  parseTransaction: (row: string[]): ParsedTransaction | null => {
    const date = formatDate(row[0]); // Date column
    const amount = parseFloat(row[1]); // Amount column
    const description = row[2]?.trim(); // Description column
    
    if (!date || !description || amount >= 0) return null;
    
    return {
      date,
      description,
      amount: row[1], // Keep as string for consistent handling
    };
  },

  transformToTransaction: (
    row: string[], 
    userId: string
  ): Omit<Transaction, "id" | "created_at"> | null => {
    const date = formatDate(row[0]);
    const amount = parseFloat(row[1]);
    const description = row[2]?.trim();
    
    if (!date || !description || amount >= 0) return null;
    
    return {
      user_id: userId,
      date,
      description,
      amount,
      tags: [],
      category_id: null,
    };
  }
};