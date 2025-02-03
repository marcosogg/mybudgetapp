import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetComparisonChart } from "./BudgetComparisonChart";

export function ChartsSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <BudgetComparisonChart />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground text-lg">PLACEHOLDER</p>
        </CardContent>
      </Card>
    </div>
  );
}