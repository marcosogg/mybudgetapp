import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reminder } from "@/types/reminder";
import { endOfMonth, format, isSameDay, startOfMonth, addMonths, isAfter, isBefore } from "date-fns";

export function useReminders(status: 'active' | 'archived' = 'active', endDate?: Date) {
  return useQuery({
    queryKey: ["reminders", status, endDate?.toISOString()],
    queryFn: async () => {
      const today = new Date();
      const monthStart = startOfMonth(today);
      const queryEndDate = endDate || endOfMonth(today);

      const { data: baseReminders, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("status", status)
        .order("due_date", { ascending: true });

      if (error) throw error;

      // Process reminders and generate recurring instances
      const processedReminders = baseReminders.flatMap((reminder) => {
        const typedReminder = reminder as Reminder;
        const reminderDate = new Date(typedReminder.due_date);
        const results: Reminder[] = [];

        if (!typedReminder.is_recurring) {
          // For non-recurring reminders, only include if within range
          if (!isAfter(reminderDate, queryEndDate) && !isBefore(reminderDate, monthStart)) {
            results.push(typedReminder);
          }
        } else {
          // For recurring reminders, generate instances for each month in range
          let currentDate = reminderDate;
          while (!isAfter(currentDate, queryEndDate)) {
            if (!isBefore(currentDate, monthStart)) {
              results.push({
                ...typedReminder,
                due_date: format(currentDate, 'yyyy-MM-dd'),
              });
            }
            currentDate = addMonths(currentDate, 1);
          }
        }

        return results;
      });

      return processedReminders;
    },
  });
}