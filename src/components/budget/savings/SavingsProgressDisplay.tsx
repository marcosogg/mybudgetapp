
import { Progress } from "@/components/ui/progress";
import type { SavingsGoal } from "@/types/savings";

interface SavingsProgressDisplayProps {
  currentGoal: SavingsGoal;
}

export function SavingsProgressDisplay({ currentGoal }: SavingsProgressDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span>{currentGoal.progress?.toFixed(1)}%</span>
      </div>
      <Progress value={currentGoal.progress || 0} className="h-2" />
      {currentGoal.notes && (
        <p className="text-sm text-muted-foreground mt-2">{currentGoal.notes}</p>
      )}
    </div>
  );
}
