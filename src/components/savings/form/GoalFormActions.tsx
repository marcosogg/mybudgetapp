
import { Button } from "@/components/ui/button";
import { SavingsGoal } from "@/types/savings";

interface GoalFormActionsProps {
  mode: 'create' | 'edit';
  goal?: SavingsGoal | null;
  onEndGoal?: () => void;
  isSubmitting: boolean;
  isEndingGoal: boolean;
}

export function GoalFormActions({ 
  mode, 
  goal, 
  onEndGoal, 
  isSubmitting,
  isEndingGoal 
}: GoalFormActionsProps) {
  return (
    <div className="flex gap-2 justify-end">
      {mode === 'edit' && !goal?.period_end && onEndGoal && (
        <Button
          type="button"
          variant="outline"
          onClick={onEndGoal}
          disabled={isEndingGoal}
        >
          End Goal
        </Button>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Saving..."
          : mode === 'edit'
          ? "Update Goal"
          : "Create Goal"}
      </Button>
    </div>
  );
}
