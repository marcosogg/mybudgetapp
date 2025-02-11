
import { z } from "zod";

export const budgetFormSchema = z.object({
  category_id: z.string().min(1, "Please select a category"),
  amount: z.string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Please enter a valid amount greater than 0"
    ),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
