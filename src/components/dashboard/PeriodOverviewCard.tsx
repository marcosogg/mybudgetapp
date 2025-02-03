import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthPicker } from "@/components/budget/MonthPicker";
import { BudgetSummaryCard } from "./BudgetSummaryCard";
import { IncomeSummaryCard } from "./IncomeSummaryCard";
import { TransactionSummaryCard } from "./TransactionSummaryCard";

interface PeriodOverviewCardProps {
  transactionCount: number;
  transactionTotal: number;
}

export function PeriodOverviewCard({ 
  transactionCount, 
  transactionTotal 
}: PeriodOverviewCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-medium">Period Overview</CardTitle>
        <MonthPicker />
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <BudgetSummaryCard />
          <IncomeSummaryCard />
          <TransactionSummaryCard 
            count={transactionCount}
            total={transactionTotal}
          />
        </div>
      </CardContent>
    </Card>
  );
}