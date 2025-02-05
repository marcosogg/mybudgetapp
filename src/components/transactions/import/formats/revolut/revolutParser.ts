import { StatementParser, ParsedTransaction } from "../../utils/baseParser";
import { formatDate } from "../../utils/baseParser";
import { Transaction } from "@/types/transaction";

const DATE_INDEX = 3;
const DESCRIPTION_INDEX = 4;
const AMOUNT_INDEX = 5;

export const REVOLUT_HEADERS = [
  'Type', 'Product', 'Started Date', 'Completed Date', 
  'Description', 'Amount', 'Fee', 'Currency', 'State', 'Balance'
];

export const RevolutParser: StatementParser = {
  validateHeaders: (headers: string[]): boolean => {
    return REVOLUT_HEADERS.every((header, index) => headers[index] === header);
  },

  parseTransaction: (row: string[]): ParsedTransaction | null => {
    const date = formatDate(row[DATE_INDEX]);
    const amount = parseFloat(row[AMOUNT_INDEX]);
    
    if (!date || amount >= 0) return null;
    
    return {
      date,
      description: row[DESCRIPTION_INDEX],
      amount: row[AMOUNT_INDEX],
    };
  },

  transformToTransaction: (
    row: string[], 
    userId: string
  ): Omit<Transaction, "id" | "created_at"> | null => {
    const date = formatDate(row[DATE_INDEX]);
    const amount = parseFloat(row[AMOUNT_INDEX]);
    
    if (!date || amount >= 0) return null;
    
    return {
      user_id: userId,
      date,
      description: row[DESCRIPTION_INDEX],
      amount,
      tags: [],
      category_id: null,
    };
  }
};