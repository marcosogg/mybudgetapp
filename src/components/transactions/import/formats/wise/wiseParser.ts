import { StatementParser, ParsedTransaction } from "../../utils/baseParser";
import { formatDate } from "../../utils/baseParser";
import { Transaction } from "@/types/transaction";

export const WISE_HEADERS = ['Date', 'Amount', 'Description'];

export const WiseParser: StatementParser = {
  validateHeaders: (headers: string[]): boolean => {
    // TODO: Implement proper Wise CSV format validation
    return headers.some(header => WISE_HEADERS.includes(header));
  },

  parseTransaction: (row: string[]): ParsedTransaction | null => {
    // TODO: Implement proper Wise transaction parsing
    console.log('Attempting to parse Wise transaction:', row);
    return null;
  },

  transformToTransaction: (
    row: string[], 
    userId: string
  ): Omit<Transaction, "id" | "created_at"> | null => {
    // TODO: Implement proper Wise transaction transformation
    console.log('Attempting to transform Wise transaction:', row);
    return null;
  }
};