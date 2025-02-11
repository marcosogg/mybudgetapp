
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import { SavingsGoalType } from "../../types/goal";
import type { SavingsGoalFormValues } from "../../types/form";
import { GoalNameField } from "./fields/GoalNameField";
import { GoalTypeSelect } from "./fields/GoalTypeSelect";
import { GoalAmountInput } from "./fields/GoalAmountInput";
import { GoalDateFields } from "./fields/GoalDateFields";
import { GoalNotesField } from "./fields/GoalNotesField";
import { GoalFormActions } from "./fields/GoalFormActions";
import type { SavingsGoal } from "../../types/goal";

interface SavingsGoalFormProps {
  mode: 'create' | 'edit';
  goal?: SavingsGoal | null;
  onEndGoal?: () => void;
  isSubmitting: boolean;
  isEndingGoal: boolean;
  register: UseFormRegister<SavingsGoalFormValues>;
  watch: UseFormWatch<SavingsGoalFormValues>;
  setValue: UseFormSetValue<SavingsGoalFormValues>;
  errors: FieldErrors<SavingsGoalFormValues>;
  selectedType: SavingsGoalType;
  onTypeChange: (type: SavingsGoalType) => void;
}

export function SavingsGoalForm({
  mode,
  goal,
  onEndGoal,
  isSubmitting,
  isEndingGoal,
  register,
  watch,
  setValue,
  errors,
  selectedType,
  onTypeChange
}: SavingsGoalFormProps) {
  return (
    <div className="space-y-4">
      <GoalNameField 
        register={register}
        errors={errors}
      />

      <GoalTypeSelect
        value={selectedType}
        onChange={onTypeChange}
        disabled={mode === 'edit'}
      />

      <GoalAmountInput
        goalType={selectedType}
        register={register}
        errors={errors}
      />

      <GoalDateFields
        goalType={selectedType}
        watch={watch}
        setValue={setValue}
        errors={errors}
      />

      <GoalNotesField register={register} />

      <GoalFormActions 
        mode={mode}
        goal={goal}
        onEndGoal={onEndGoal}
        isSubmitting={isSubmitting}
        isEndingGoal={isEndingGoal}
      />
    </div>
  );
}
