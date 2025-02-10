
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SavingsGoalType } from "@/types/savings";
import type { SavingsGoalFormValues } from "@/types/savings";
import { UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import { startOfMonth, startOfYear } from "date-fns";

interface GoalDateFieldsProps {
  goalType: SavingsGoalType;
  watch: UseFormWatch<SavingsGoalFormValues>;
  setValue: UseFormSetValue<SavingsGoalFormValues>;
  errors: FieldErrors<SavingsGoalFormValues>;
}

export function GoalDateFields({ goalType, watch, setValue, errors }: GoalDateFieldsProps) {
  const handleMonthChange = (value: string) => {
    const [year, month] = value.split("-").map(Number);
    if (year && month) {
      setValue("period_start", startOfMonth(new Date(year, month - 1)));
    }
  };

  const handleYearChange = (value: string) => {
    const year = parseInt(value);
    if (!isNaN(year)) {
      setValue("period_start", startOfYear(new Date(year, 0)));
    }
  };

  if (goalType === 'recurring_monthly') {
    const currentValue = watch("period_start");
    const monthValue = currentValue 
      ? `${currentValue.getFullYear()}-${String(currentValue.getMonth() + 1).padStart(2, '0')}`
      : "";

    return (
      <div className="space-y-2">
        <Label>Start Month</Label>
        <Input
          type="month"
          value={monthValue}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="w-full"
        />
      </div>
    );
  }

  if (goalType === 'recurring_yearly') {
    const currentValue = watch("period_start");
    const yearValue = currentValue ? currentValue.getFullYear().toString() : "";

    return (
      <div className="space-y-2">
        <Label>Start Year</Label>
        <Input
          type="number"
          min={new Date().getFullYear()}
          max={new Date().getFullYear() + 10}
          value={yearValue}
          onChange={(e) => handleYearChange(e.target.value)}
          className="w-full"
        />
      </div>
    );
  }

  // No date fields needed for one-time goals
  return null;
}
