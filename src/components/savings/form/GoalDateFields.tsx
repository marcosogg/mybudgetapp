import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { MonthPicker } from "@/components/ui/month-picker";
import type { SavingsGoalType } from "@/types/savings";
import type { SavingsGoalFormValues } from "@/types/savings";
import { UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";

interface GoalDateFieldsProps {
  goalType: SavingsGoalType;
  watch: UseFormWatch<SavingsGoalFormValues>;
  setValue: UseFormSetValue<SavingsGoalFormValues>;
  errors: FieldErrors<SavingsGoalFormValues>;
}

export function GoalDateFields({ goalType, watch, setValue, errors }: GoalDateFieldsProps) {
  if (goalType === 'one_time') {
    return null; // No date fields for one-time goals
  }

  if (goalType === 'recurring_monthly') {
    return (
      <div className="space-y-2">
        <Label>Start Month</Label>
        <MonthPicker
          date={watch("period_start")}
          onChange={(date) => date && setValue("period_start", date)}
        />
        {errors.period_start && (
          <p className="text-sm text-destructive">
            {errors.period_start.message}
          </p>
        )}
      </div>
    );
  }

  // For recurring_yearly, we don't show any date fields as it uses the current year
  return null;
}
