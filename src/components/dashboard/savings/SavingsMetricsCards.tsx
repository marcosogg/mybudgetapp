
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Plus } from "lucide-react";

interface SavingsMetricsProps {
  yearTotal: number;
  averageMonthlySavings: number;
  goalProgress: number | undefined;
  onSetGoal: () => void;
  hasGoal: boolean;
}

export function SavingsMetricsCards({
  yearTotal,
  averageMonthlySavings,
  goalProgress,
  onSetGoal,
  hasGoal
}: SavingsMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Year to Date</p>
        <p className="font-bold text-lg">${yearTotal.toLocaleString()}</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Monthly Average</p>
        <p className="font-bold text-xl">${averageMonthlySavings.toLocaleString()}</p>
      </Card>
      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <p className="text-sm text-muted-foreground">Goal Management</p>
            {hasGoal ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xl">{goalProgress ? goalProgress.toFixed(1) : '0.0'}%</p>
                  {goalProgress && goalProgress >= 100 && (
                    <Badge variant="default">Achieved!</Badge>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onSetGoal}
                  className="w-full"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Manage Savings Goal
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSetGoal}
                className="mt-1 w-full"
              >
                <Plus className="h-4 w-4 mr-1" />
                Set Savings Goal
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
