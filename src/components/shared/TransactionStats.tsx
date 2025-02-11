
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionStatsProps {
  transactionCount: number;
  totalAmount: number;
  formatCurrency: (amount: number) => string;
}

/**
 * TransactionStats - A reusable component for displaying transaction statistics
 * @param {number} transactionCount - The total number of transactions
 * @param {number} totalAmount - The total amount of transactions
 * @param {function} formatCurrency - Function to format currency values
 */
export const TransactionStats = ({
  transactionCount,
  totalAmount,
  formatCurrency,
}: TransactionStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{transactionCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatCurrency(totalAmount)}</p>
        </CardContent>
      </Card>
    </div>
  );
};
