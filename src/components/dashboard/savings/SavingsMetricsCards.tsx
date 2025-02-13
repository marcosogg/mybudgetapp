import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface SavingsMetricsProps {
  yearTotal: number;
  averageMonthlySavings: number;
  goalProgress: number | undefined;
}
export function SavingsMetricsCards({
  yearTotal,
  averageMonthlySavings,
  goalProgress
}: SavingsMetricsProps) {
  return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Year to Date</p>
        <p className="font-bold text-lg">${yearTotal.toLocaleString()}</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Monthly Average</p>
        <p className="font-bold text-xl">${averageMonthlySavings.toLocaleString()}</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Goal Progress</p>
        <div className="flex items-end gap-2">
          <p className="font-bold text-xl">{goalProgress ? goalProgress.toFixed(1) : '0.0'}%</p>
          {goalProgress && goalProgress >= 100 && <Badge variant="default" className="mb-1">Achieved!</Badge>}
        </div>
      </Card>
    </div>;
}