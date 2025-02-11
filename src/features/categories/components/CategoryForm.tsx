
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Category } from "../types/category";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
  category?: Category;
}

export function CategoryForm({
  open,
  onOpenChange,
  onSubmit,
  category
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {category ? "Save Changes" : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
