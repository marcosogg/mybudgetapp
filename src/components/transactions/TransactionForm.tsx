
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DateField } from "./form/DateField";
import { DescriptionField } from "./form/DescriptionField";
import { AmountField } from "./form/AmountField";
import { CategoryField } from "./form/CategoryField";
import { TagsField } from "./form/TagsField";
import { normalizeTags } from "@/utils/tagUtils";
import { supabase } from "@/integrations/supabase/client";
import { useTransactionSubmit } from "./hooks/useTransactionSubmit";
import { useRealtimeUpdates } from "./hooks/useRealtimeUpdates";
import { TransactionFormProps, TransactionFormValues } from "./types/formTypes";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function TransactionForm({ initialData, onSubmit, onCancel }: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: 0,
      category_id: null,
      tags: [],
    },
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(form.getValues('category_id'));

  // Fetch active savings goals for tag suggestions
  const { data: savingsGoals } = useQuery({
    queryKey: ['savings-goals-tags', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      
      // Get the savings category
      const { data: savingsCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', 'Savings')
        .maybeSingle();

      if (savingsCategory?.id !== selectedCategory) return [];

      const { data: goals } = await supabase
        .from('savings_goals')
        .select('tag')
        .not('tag', 'is', null);

      return goals?.map(goal => goal.tag).filter(Boolean) || [];
    },
    enabled: !!selectedCategory
  });

  const { handleMapping } = useTransactionSubmit();
  useRealtimeUpdates();

  const handleSubmit = async (values: TransactionFormValues) => {
    const normalizedTags = normalizeTags(values.tags.join(','));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && values.description && values.category_id) {
        await handleMapping(values.description, values.category_id, user.id);
      }
    } catch (error) {
      console.error("Error managing mapping:", error);
    }

    // Ensure amount is negative for expenses
    const amount = values.amount > 0 ? -values.amount : values.amount;
    onSubmit({ ...values, amount, tags: normalizedTags });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DateField form={form} />
        <DescriptionField form={form} />
        <AmountField form={form} />
        <CategoryField 
          form={form} 
          mode={initialData ? "edit" : "add"} 
          onCategoryChange={(categoryId) => setSelectedCategory(categoryId)}
        />
        <TagsField 
          form={form} 
          suggestedTags={savingsGoals} 
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update" : "Create"} Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
}
