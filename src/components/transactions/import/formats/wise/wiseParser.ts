import { StatementParser, ParsedTransaction } from "../../utils/baseParser";
import { formatDate } from "../../utils/baseParser";
import { Transaction } from "@/types/transaction";

export const WISE_HEADERS = ['TransferWise ID', 'Date', 'Amount', 'Currency', 'Description', 'Payment Reference', 'Running Balance', 'Exchange From', 'Exchange To', 'Exchange Rate', 'Payer Name', 'Payee Name', 'Payee Account Number', 'Merchant', 'Card Last Four Digits', 'Card Holder Full Name', 'Attachment', 'Note', 'Total fees', 'Exchange To Amount'];

export const WiseParser: StatementParser = {
  validateHeaders: (headers: string[]): boolean => {
    console.log('Validating Wise headers:', {
      provided: headers,
      required: WISE_HEADERS,
    });
    return WISE_HEADERS.every(requiredHeader =>
      headers.some(header => header === requiredHeader)
    );
  },

  parseTransaction: (row: string[]): ParsedTransaction | null => {
    console.log('Processing Wise row:', {
      dateField: row[1],
      amountField: row[2],
      payeeName: row[11],
      merchant: row[13]
    });

    const date = formatDate(row[1]); // Date column
    const amount = parseFloat(row[2]); // Amount column
    
    // Only process rows with negative amounts
    if (!date || isNaN(amount) || amount >= 0) {
      console.log('Skipping row:', { 
        reason: !date ? 'invalid date' : isNaN(amount) ? 'invalid amount' : 'positive amount',
        date,
        amount 
      });
      return null;
    }

    // Combine Payee Name and Merchant for description
    const payeeName = row[11]?.trim() || '';
    const merchant = row[13]?.trim() || '';
    const description = [payeeName, merchant]
      .filter(Boolean)
      .join(' - ')
      .trim() || 'Unnamed Transaction';

    const result = {
      date,
      description,
      amount: row[2],
    };

    console.log('Successfully parsed transaction:', result);
    return result;
  },

  transformToTransaction: (
    row: string[],
    userId: string
  ): Omit<Transaction, "id" | "created_at"> | null => {
    const parsedTransaction = WiseParser.parseTransaction(row);
    if (!parsedTransaction) return null;

    return {
      user_id: userId,
      date: parsedTransaction.date,
      description: parsedTransaction.description,
      amount: parseFloat(parsedTransaction.amount),
      tags: [],
      category_id: null,
    };
  }
};