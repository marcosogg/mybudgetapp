import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ReminderFormValues } from "@/types/reminder";
import { useReminderSubmit } from "@/hooks/reminders/useReminderSubmit";

interface ReminderFormProps {
  onSuccess: () => void;
  defaultValues?: ReminderFormValues;
}

export function ReminderForm({ onSuccess, defaultValues }: ReminderFormProps) {
  const form = useForm<ReminderFormValues>({
    defaultValues: defaultValues || {
      name: "",
      amount: 0,
      due_date: new Date().toISOString().split("T")[0],
      is_recurring: false,
    },
  });

  const { mutate: submitReminder, isPending } = useReminderSubmit();

  const onSubmit = (values: ReminderFormValues) => {
    submitReminder(values, {
      onSuccess: () => {
        onSuccess();
        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_recurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Monthly Recurring</FormLabel>
                <div className="text-sm text-muted-foreground">
                  This reminder will repeat every month
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving..." : "Save Reminder"}
        </Button>
      </form>
    </Form>
  );
}