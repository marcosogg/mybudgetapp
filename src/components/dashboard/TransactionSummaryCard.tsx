
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionSummaryCardProps {
  count: number;
  total: number;
}

export function TransactionSummaryCard({ count, total }: TransactionSummaryCardProps) {
  console.log('TransactionSummaryCard rendered with:', { count, total });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Transactions</span>
            <span className="font-medium">{count}</span>
          </div>
          <div className="flex justify-between pt-4 border-t">
            <span className="font-medium">Total Spent</span>
            <span className="font-bold text-primary">${total.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
