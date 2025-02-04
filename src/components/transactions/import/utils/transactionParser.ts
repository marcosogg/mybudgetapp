import { formatDate } from './csvValidation';
import { Transaction } from '@/types/transaction';

const DATE_INDEX = 3;
const DESCRIPTION_INDEX = 4;
const AMOUNT_INDEX = 5;

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: string;
}

export const parseTransactionRow = (row: string[]): ParsedTransaction | null => {
  const date = formatDate(row[DATE_INDEX]);
  const amount = parseFloat(row[AMOUNT_INDEX]);
  
  if (!date || amount >= 0) return null;
  
  return {
    date,
    description: row[DESCRIPTION_INDEX],
    amount: row[AMOUNT_INDEX],
  };
};

export const transformToTransaction = (
  row: string[], 
  userId: string
): Omit<Transaction, 'id' | 'created_at'> | null => {
  const date = formatDate(row[DATE_INDEX]);
  const amount = parseFloat(row[AMOUNT_INDEX]);
  
  if (!date || amount >= 0) return null;
  
  return {
    date,
    description: row[DESCRIPTION_INDEX],
    amount,
    tags: [],
    category_id: null,
  };
};