
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Edit2, Plus } from "lucide-react";
import { useState } from "react";
import { SavingsDialog } from "../../budget/SavingsDialog";
import { SavingsGoalInfo } from "./SavingsGoalInfo";
import { SavingsProgressDisplay } from "./SavingsProgressDisplay";
import { useSavingsGoal } from "@/hooks/useSavingsGoal";
import { useMonth } from "@/contexts/MonthContext";

export function SavingsGoalsCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { currentGoal } = useSavingsGoal();
  const { selectedMonth } = useMonth();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsEditing(open);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SavingsGoalInfo currentGoal={currentGoal} />
        <SavingsDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          currentSavings={0}
          targetAmount={currentGoal?.target_amount || 0}
        />
      </div>
      {currentGoal && (
        <SavingsProgressDisplay currentGoal={currentGoal} />
      )}
    </div>
  );
}
