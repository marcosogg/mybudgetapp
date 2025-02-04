import { useState } from "react";
import { format, endOfYear } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReminders } from "@/hooks/reminders/useReminders";
import { ReminderCard } from "./ReminderCard";

export function CalendarView() {
  const [date, setDate] = useState<Date>(new Date());
  // Fetch reminders up to end of year to show future recurring reminders
  const { data: reminders } = useReminders('active', endOfYear(new Date()));

  const selectedDateReminders = reminders?.filter((reminder) =>
    format(new Date(reminder.due_date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr,400px]">
      <Card>
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="w-full"
            modifiers={{
              reminder: (date) =>
                reminders?.some(
                  (reminder) =>
                    format(new Date(reminder.due_date), "yyyy-MM-dd") ===
                    format(date, "yyyy-MM-dd")
                ) || false,
            }}
            modifiersStyles={{
              reminder: {
                fontWeight: "bold",
                color: "var(--primary)",
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Reminders for {format(date, "MMMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedDateReminders?.length ? (
            <p className="text-sm text-muted-foreground">
              No reminders for this day
            </p>
          ) : (
            selectedDateReminders.map((reminder) => (
              <ReminderCard key={`${reminder.id}-${reminder.due_date}`} reminder={reminder} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}