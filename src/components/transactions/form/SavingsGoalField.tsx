
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransactionFormValues } from "../types/formTypes";

// Note: This component is no longer used since savings_goal_id has been removed
// This is kept for reference only but should be considered deprecated
interface SavingsGoalFieldProps {
  form: UseFormReturn<TransactionFormValues & { savings_goal_id?: string }>;
}

export function SavingsGoalField({ form }: SavingsGoalFieldProps) {
  const { data: goals } = useQuery({
    queryKey: ['savings-goals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (error) throw error;
      return data;
    }
  });

  // This component is deprecated and should not be used
  // It remains only for reference
  console.warn('SavingsGoalField is deprecated and should not be used');
  
  return (
    <div className="hidden">
      {/* Component hidden and not functional */}
    </div>
  );
}
