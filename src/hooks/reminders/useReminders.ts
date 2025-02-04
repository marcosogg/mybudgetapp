import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reminder } from "@/types/reminder";
import { endOfMonth, format, startOfMonth } from "date-fns";

export function useReminders(status: 'active' | 'archived' = 'active') {
  return useQuery({
    queryKey: ["reminders", status],
    queryFn: async () => {
      const today = new Date();
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);

      // Fetch base reminders
      const { data: baseReminders, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("status", status)
        .or(`is_recurring.eq.false,and(is_recurring.eq.true,due_date.gte.${format(monthStart, 'yyyy-MM-dd')})`)
        .order("due_date", { ascending: true });

      if (error) throw error;

      // Process recurring reminders
      const reminders = baseReminders.map((reminder) => {
        const typedReminder = reminder as Reminder;
        
        if (!typedReminder.is_recurring) return typedReminder;

        // For recurring reminders, adjust the due date to current month if needed
        const reminderDate = new Date(typedReminder.due_date);
        if (reminderDate < monthStart) {
          return {
            ...typedReminder,
            due_date: format(
              new Date(today.getFullYear(), today.getMonth(), reminderDate.getDate()),
              'yyyy-MM-dd'
            ),
          };
        }
        return typedReminder;
      });

      return reminders;
    },
  });
}