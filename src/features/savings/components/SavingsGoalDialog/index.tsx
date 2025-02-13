
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSavingsGoalForm } from "../../hooks/useSavingsGoalForm";
import type { SavingsGoal } from "../../types/goal";
import { SavingsGoalForm } from "../SavingsGoalForm";

interface SavingsGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  goal?: SavingsGoal | null;
}

export function SavingsGoalDialog({ 
  open, 
  onOpenChange,
  mode,
  goal
}: SavingsGoalDialogProps) {
  const {
    form,
    selectedType,
    setSelectedType,
    handleSubmit,
    handleEndGoal,
    isSubmitting,
    isEndingGoal
  } = useSavingsGoalForm({
    mode,
    goal,
    onSuccess: () => onOpenChange(false)
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? "Update Savings Goal" : "Create New Savings Goal"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <SavingsGoalForm
            mode={mode}
            goal={goal}
            onEndGoal={handleEndGoal}
            isSubmitting={isSubmitting}
            isEndingGoal={isEndingGoal}
            register={form.register}
            watch={form.watch}
            setValue={form.setValue}
            errors={form.formState.errors}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
