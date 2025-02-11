
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useReminderActions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const archiveReminder = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("reminders")
        .update({ status: "archived" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast({
        title: "Success",
        description: "Reminder has been archived.",
      });
    },
  });

  const deleteReminder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast({
        title: "Success",
        description: "Reminder has been deleted.",
      });
    },
  });

  return {
    archiveReminder: archiveReminder.mutate,
    deleteReminder: deleteReminder.mutate,
  };
}
