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
    const date = formatDate(row[1]); // Date column is at index 1
    const amount = parseFloat(row[2]); // Amount column is at index 2
    const description = row[4]?.trim(); // Description column is at index 4
    const merchant = row[13]?.trim(); // Merchant column is at index 13

    // Check if it's a valid row: date and amount must be present
    if (!date || isNaN(amount)) return null;

    // If it's a transfer and the amount is negative, capture the description
    if (amount < 0 && !merchant && description) {
      return {
        date,
        description,
        amount: row[2], // Keep as string for consistent handling
      };
    }

    // If it's not a transfer, proceed as before but only for negative amounts
    if (amount < 0 && merchant) {
      return {
        date,
        description: merchant, // Use merchant as description
        amount: row[2], // Keep as string for consistent handling
      };
    }

    return null; // Skip the row if it's not a valid expense or transfer out
  },

  transformToTransaction: (
    row: string[],
    userId: string
  ): Omit<Transaction, "id" | "created_at"> | null => {
    const date = formatDate(row[1]);
    const amount = parseFloat(row[2]);
    const description = row[4]?.trim();
    const merchant = row[13]?.trim();

    // Check if it's a valid row: date and amount must be present
    if (!date || isNaN(amount)) return null;

    // If it's a transfer and the amount is negative, use the description
    if (amount < 0 && !merchant && description) {
      return {
        user_id: userId,
        date,
        description,
        amount,
        tags: ['transfer'], // Add transfer tag for better categorization
        category_id: null,
      };
    }

    // If it's not a transfer, proceed as before but only for negative amounts
    if (amount < 0 && merchant) {
      return {
        user_id: userId,
        date,
        description: merchant,
        amount,
        tags: [],
        category_id: null,
      };
    }

    return null; // Skip the row if it's not a valid expense or transfer out
  }
};