
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { TransactionFormValues } from "./types/formTypes";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TransactionFormValues) => void;
  initialData?: TransactionFormValues;
  mode: "add" | "edit";
}

export function TransactionDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: TransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Transaction" : "Edit Transaction"}
          </DialogTitle>
        </DialogHeader>
        <TransactionForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
