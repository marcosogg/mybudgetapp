
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../services/categoryService";
import { toast } from "sonner";

const categoryService = new CategoryService();

export function useCategories() {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories()
  });

  const createCategory = useMutation({
    mutationFn: (name: string) => categoryService.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    }
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      categoryService.updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  });

  return {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
