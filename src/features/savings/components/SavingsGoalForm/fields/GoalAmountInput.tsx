
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SavingsGoalType } from "@/features/savings/types/goal";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { SavingsGoalFormValues } from "@/features/savings/types/form";

interface GoalAmountInputProps {
  goalType: SavingsGoalType;
  register: UseFormRegister<SavingsGoalFormValues>;
  errors: FieldErrors<SavingsGoalFormValues>;
}

export function GoalAmountInput({ goalType, register, errors }: GoalAmountInputProps) {
  const isRecurring = goalType !== 'one_time';
  const fieldName = isRecurring ? "recurring_amount" : "target_amount";
  const label = isRecurring 
    ? `${goalType === 'recurring_monthly' ? 'Monthly' : 'Yearly'} Target`
    : 'Target Amount';

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName}>{label}</Label>
      <Input
        {...register(fieldName)}
        type="number"
        min="0"
        step="0.01"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {errors[fieldName] && (
        <p className="text-sm text-destructive">
          {errors[fieldName]?.message}
        </p>
      )}
    </div>
  );
}
