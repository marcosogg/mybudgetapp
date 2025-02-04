import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { CategoryBadge } from "./CategoryBadge";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import { getTagStyle } from "@/utils/tagUtils";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TransactionTableRowProps {
  transaction: Transaction;
  formatCurrency: (amount: number) => string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionTableRow = ({
  transaction,
  formatCurrency,
  onEdit,
  onDelete,
}: TransactionTableRowProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback to original string if parsing fails
    }
  };

  return (
    <TableRow key={transaction.id}>
      <TableCell>{formatDate(transaction.date)}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell>
        <CategoryBadge categoryName={transaction.category?.name ?? null} />
      </TableCell>
      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {transaction.tags?.map((tag) => {
            const style = getTagStyle(tag);
            const Icon = style.icon;
            return (
              <Badge
                key={tag}
                variant="secondary"
                className={`flex items-center gap-1 ${style.bg} ${style.text}`}
              >
                <Icon className="h-3 w-3" />
                {tag}
              </Badge>
            );
          })}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(transaction)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this transaction? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(transaction)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};