
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import type { SavingsGoalFormValues } from "@/types/savings";

interface GoalNotesFieldProps {
  register: UseFormRegister<SavingsGoalFormValues>;
}

export function GoalNotesField({ register }: GoalNotesFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes (Optional)</Label>
      <Textarea
        {...register("notes")}
        placeholder="Add notes about your goal"
      />
    </div>
  );
}
