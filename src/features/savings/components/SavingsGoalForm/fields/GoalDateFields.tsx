
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MonthPicker } from "@/components/budget/MonthPicker";
import type { SavingsGoalType } from "@/features/savings/types/goal";
import type { SavingsGoalFormValues } from "@/features/savings/types/form";
import { UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import { startOfMonth, startOfYear } from "date-fns";

interface GoalDateFieldsProps {
  goalType: SavingsGoalType;
  watch: UseFormWatch<SavingsGoalFormValues>;
  setValue: UseFormSetValue<SavingsGoalFormValues>;
  errors: FieldErrors<SavingsGoalFormValues>;
}

export function GoalDateFields({ goalType, watch, setValue, errors }: GoalDateFieldsProps) {
  const handleMonthChange = (date: Date) => {
    setValue("period_start", startOfMonth(date));
  };

  const handleYearChange = (value: string) => {
    const year = parseInt(value);
    if (!isNaN(year)) {
      setValue("period_start", startOfYear(new Date(year, 0)));
    }
  };

  if (goalType === 'recurring_monthly') {
    const currentValue = watch("period_start") || new Date();

    return (
      <div className="space-y-2">
        <Label>Start Month</Label>
        <MonthPicker
          selectedMonth={currentValue}
          onMonthChange={handleMonthChange}
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
