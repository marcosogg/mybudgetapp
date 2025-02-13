import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "../types/formTypes";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeTags, getTagStyle } from "@/utils/tagUtils";

interface TagsFieldProps {
  form: UseFormReturn<TransactionFormValues>;
}

export const TagsField = ({ form }: TagsFieldProps) => {
  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();
      
      if (value) {
        const currentTags = form.getValues('tags');
        const normalizedTag = normalizeTags(value)[0];
        
        if (normalizedTag && !currentTags.includes(normalizedTag)) {
          form.setValue('tags', [...currentTags, normalizedTag]);
        }
        
        input.value = '';
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {field.value.map((tag) => {
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
            <FormControl>
              <Input
                placeholder="Type a tag and press Enter or comma"
                onKeyDown={handleTagInput}
                className="mt-2"
              />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};