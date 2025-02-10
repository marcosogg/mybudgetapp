
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Budget } from "@/hooks/budget/types";
import { useProfile } from "@/hooks/useProfile";
import { useBudgetDelete } from "@/hooks/budget/useBudgetDelete";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface BudgetTableProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
}

export function BudgetTable({ budgets, onEdit }: BudgetTableProps) {
  const { profile } = useProfile();
  const { mutate: deleteBudget, isPending: isDeleting } = useBudgetDelete();
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);
  
  const monthlyIncome = (profile?.monthlyIncome?.salary || 0) + (profile?.monthlyIncome?.bonus || 0);

  const handleDelete = (budget: Budget) => {
    setDeletingBudget(budget);
  };

  const confirmDelete = () => {
    if (deletingBudget) {
      deleteBudget(deletingBudget.id);
    }
    setDeletingBudget(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>% of Income</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.map((budget) => {
            const percentage = monthlyIncome > 0 
              ? ((budget.amount / monthlyIncome) * 100).toFixed(1) 
              : '0.0';

            return (
              <TableRow key={budget.id}>
                <TableCell>{budget.category?.name}</TableCell>
                <TableCell>${budget.amount.toLocaleString()}</TableCell>
                <TableCell>{percentage}%</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(budget)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(budget)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            )}
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deletingBudget} onOpenChange={() => setDeletingBudget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the budget for {deletingBudget?.category?.name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
