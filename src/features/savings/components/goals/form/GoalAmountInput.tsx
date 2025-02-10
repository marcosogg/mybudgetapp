import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { SavingsGoalType } from "../../../types/savings";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface GoalAmountInputProps {
  goalType: SavingsGoalType;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export function GoalAmountInput({ goalType, register, errors }: GoalAmountInputProps) {
  const isRecurring = goalType !== 'one_time';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="targetAmount">
          Target Amount {isRecurring && "(Total)"}
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            {...register("targetAmount")}
            id="targetAmount"
            type="text"
            inputMode="decimal"
            className="pl-6"
            placeholder="0.00"
          />
        </div>
        {errors.targetAmount && (
          <p className="text-sm text-destructive">
            {errors.targetAmount.message as string}
          </p>
        )}
      </div>

      {isRecurring && (
        <div className="space-y-2">
          <Label htmlFor="recurringAmount">
            {goalType === 'recurring_monthly' ? 'Monthly' : 'Yearly'} Amount
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              {...register("recurringAmount")}
              id="recurringAmount"
              type="text"
              inputMode="decimal"
              className="pl-6"
              placeholder="0.00"
            />
          </div>
          {errors.recurringAmount && (
            <p className="text-sm text-destructive">
              {errors.recurringAmount.message as string}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 