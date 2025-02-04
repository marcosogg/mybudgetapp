import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReminderForm } from "./ReminderForm";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: {
    name: string;
    amount: number;
    due_date: string;
    is_recurring: boolean;
  };
}

export function ReminderDialog({ open, onOpenChange, defaultValues }: ReminderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit Reminder" : "Add Reminder"}</DialogTitle>
        </DialogHeader>
        <ReminderForm onSuccess={() => onOpenChange(false)} defaultValues={defaultValues} />
      </DialogContent>
    </Dialog>
  );
}