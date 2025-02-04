import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart2, PiggyBank, LineChart } from "lucide-react";
import { BudgetComparisonChart } from "./BudgetComparisonChart";

export function ChartsSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <BudgetComparisonChart />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Spending Analysis</CardTitle>
            <CardDescription>Track your spending patterns and trends</CardDescription>
          </div>
          <BarChart2 className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="min-h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Coming Soon</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Savings</CardTitle>
            <CardDescription>Stay on top of your financial deadlines</CardDescription>
          </div>
          <PiggyBank className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="min-h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Coming Soon</p>
        </CardContent>
      </Card>
    </div>
  );
}