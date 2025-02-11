
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Category } from "../types/category";
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

interface CategoryListItemProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoryListItem({ category, onEdit, onDelete }: CategoryListItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <span className="font-medium">{category.name}</span>
      <div className="space-x-2">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{category.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(category)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
