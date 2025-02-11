
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/budget/calculations";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TransactionSummaryCardProps {
  count: number;
  total: number;
}

export function TransactionSummaryCard({ count, total }: TransactionSummaryCardProps) {
  // Calculate trend (this is a simple example, you might want to compare with previous period)
  const trend = total > 1000 ? "increase" : "decrease";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Transactions</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{count}</span>
              <Badge variant="secondary" className="ml-2">
                {count > 0 ? "Active" : "No transactions"}
              </Badge>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-medium">Total Spent</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">{formatCurrency(total)}</span>
              {trend === "increase" ? (
                <TrendingUp className="h-4 w-4 text-destructive" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
