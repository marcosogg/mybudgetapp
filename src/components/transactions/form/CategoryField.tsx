
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "../types/formTypes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFieldProps {
  form: UseFormReturn<TransactionFormValues>;
  mode?: "add" | "edit";
  onCategoryChange?: (categoryId: string | null) => void;
}

export const CategoryField = ({ form, mode = "add", onCategoryChange }: CategoryFieldProps) => {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (error) throw error;
      return data;
    },
  });

  const handleCategoryChange = (value: string) => {
    form.setValue('category_id', value === 'null' ? null : value);
    onCategoryChange?.(value === 'null' ? null : value);
  };

  return (
    <FormField
      control={form.control}
      name="category_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select
            onValueChange={handleCategoryChange}
            defaultValue={field.value || "null"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {mode === "add" && (
                <SelectItem value="null">No category</SelectItem>
              )}
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
