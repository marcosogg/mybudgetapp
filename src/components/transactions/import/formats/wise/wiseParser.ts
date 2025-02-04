import { StatementParser, ParsedTransaction } from "../../utils/baseParser";
import { formatDate } from "../../utils/baseParser";
import { Transaction } from "@/types/transaction";

export const WISE_HEADERS = ['TransferWise ID', 'Date', 'Amount', 'Currency', 'Description', 'Payment Reference', 'Running Balance', 'Exchange From', 'Exchange To', 'Exchange Rate', 'Payer Name', 'Payee Name', 'Payee Account Number', 'Merchant', 'Card Last Four Digits', 'Card Holder Full Name', 'Attachment', 'Note', 'Total fees', 'Exchange To Amount'];

export const WiseParser: StatementParser = {
  validateHeaders: (headers: string[]): boolean => {
    return WISE_HEADERS.every(requiredHeader =>
      headers.some(header => header === requiredHeader)
    );
  },

  parseTransaction: (row: string[]): ParsedTransaction | null => {
    const date = formatDate(row[1]); // Date column
    const amount = parseFloat(row[2]); // Amount column
    
    // Only process rows with negative amounts
    if (!date || isNaN(amount) || amount >= 0) {
      return null;
    }

    // Combine Payee Name and Merchant for description
    const payeeName = row[11]?.trim() || '';
    const merchant = row[13]?.trim() || '';
    const description = [payeeName, merchant]
      .filter(Boolean)
      .join(' - ')
      .trim() || 'Unnamed Transaction';

    return {
      date,
      description,
      amount: row[2], // Keep as string for consistent handling
    };
  },

  transformToTransaction: (
    row: string[],
    userId: string
  ): Omit<Transaction, "id" | "created_at"> | null => {
    const date = formatDate(row[1]); // Date column
    const amount = parseFloat(row[2]); // Amount column
    
    // Only process rows with negative amounts
    if (!date || isNaN(amount) || amount >= 0) {
      return null;
    }

    // Combine Payee Name and Merchant for description
    const payeeName = row[11]?.trim() || '';
    const merchant = row[13]?.trim() || '';
    const description = [payeeName, merchant]
      .filter(Boolean)
      .join(' - ')
      .trim() || 'Unnamed Transaction';

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