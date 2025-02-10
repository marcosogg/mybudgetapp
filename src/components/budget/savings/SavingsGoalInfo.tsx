
import { Button } from "@/components/ui/button";
import { Edit2, Plus } from "lucide-react";
import type { SavingsGoal } from "@/types/savings";

interface SavingsGoalInfoProps {
  currentGoal: SavingsGoal | null;
}

export function SavingsGoalInfo({ currentGoal }: SavingsGoalInfoProps) {
  return (
    <div>
      <h3 className="font-medium">Savings Goal</h3>
      {currentGoal && (
        <p className="text-sm text-muted-foreground">
          Target: ${currentGoal.target_amount.toLocaleString()}
        </p>
      )}
    </div>
  );
}
