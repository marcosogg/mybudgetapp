
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
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
  return (
    <>
      <div className="space-y-2">
        <Label>Start Date</Label>
        <DatePicker
          date={watch("period_start")}
          onChange={(date) => date && setValue("period_start", date)}
        />
      </div>

      {goalType === 'one_time' && (
        <div className="space-y-2">
          <Label>End Date</Label>
          <DatePicker
            date={watch("period_end")}
            onChange={(date) => setValue("period_end", date)}
          />
          {errors.period_end && (
            <p className="text-sm text-destructive">
              End date is required for one-time goals
            </p>
          )}
        </div>
      )}
    </>
  );
}
