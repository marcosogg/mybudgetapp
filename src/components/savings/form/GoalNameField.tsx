
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { SavingsGoalFormValues } from "@/types/savings";

interface GoalNameFieldProps {
  register: UseFormRegister<SavingsGoalFormValues>;
  errors: FieldErrors<SavingsGoalFormValues>;
}

export function GoalNameField({ register, errors }: GoalNameFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Goal Name</Label>
      <Input
        {...register("name")}
        placeholder="Enter goal name"
      />
      {errors.name && (
        <p className="text-sm text-destructive">
          {errors.name.message}
        </p>
      )}
    </div>
  );
}
