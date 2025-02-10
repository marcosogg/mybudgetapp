import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SavingsGoalType } from "../../../types/savings";

interface GoalTypeSelectProps {
  value: SavingsGoalType;
  onChange: (value: SavingsGoalType) => void;
  disabled?: boolean;
}

export function GoalTypeSelect({ value, onChange, disabled }: GoalTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="goal-type">Goal Type</Label>
      <Select
        value={value}
        onValueChange={onChange as (value: string) => void}
        disabled={disabled}
      >
        <SelectTrigger id="goal-type">
          <SelectValue placeholder="Select a goal type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one_time">One Time Goal</SelectItem>
          <SelectItem value="recurring_monthly">Monthly Recurring</SelectItem>
          <SelectItem value="recurring_yearly">Yearly Recurring</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 