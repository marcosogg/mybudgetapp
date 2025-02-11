
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GOAL_TYPE_LABELS, GOAL_TYPE_DESCRIPTIONS } from "@/features/savings/utils/constants";
import type { SavingsGoalType } from "@/features/savings/types/goal";

interface GoalTypeSelectProps {
  value: SavingsGoalType;
  onChange: (value: SavingsGoalType) => void;
  disabled?: boolean;
}

export function GoalTypeSelect({ value, onChange, disabled }: GoalTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Goal Type</Label>
      <Select
        value={value}
        onValueChange={(value: SavingsGoalType) => onChange(value)}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a goal type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(GOAL_TYPE_LABELS).map(([type, label]) => (
            <SelectItem key={type} value={type}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        {GOAL_TYPE_DESCRIPTIONS[value]}
      </p>
    </div>
  );
}
