import { endOfYear } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReminders } from "@/hooks/reminders/useReminders";
import { ReminderCard } from "./ReminderCard";
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  useCalendar,
} from "@/components/ui/calendar";

export function CalendarView() {
  const { month, year } = useCalendar();
  const { data: reminders } = useReminders('active', endOfYear(new Date()));

  // Transform reminders into the Feature format expected by the calendar
  const reminderFeatures = reminders?.map((reminder) => ({
    id: reminder.id,
    name: reminder.name,
    startAt: new Date(reminder.due_date),
    endAt: new Date(reminder.due_date),
    status: {
      id: reminder.status,
      name: reminder.status,
      color: reminder.status === 'active' ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
    },
  })) || [];

  // Get selected date reminders for the details panel
  const selectedDateReminders = reminders?.filter((reminder) => {
    const reminderDate = new Date(reminder.due_date);
    return reminderDate.getMonth() === month && reminderDate.getFullYear() === year;
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr,400px]">
      <Card>
        <CardContent className="pt-6">
          <CalendarProvider>
            <CalendarDate>
              <CalendarDatePicker>
                <CalendarMonthPicker />
                <CalendarYearPicker 
                  start={new Date().getFullYear() - 1} 
                  end={new Date().getFullYear() + 5} 
                />
              </CalendarDatePicker>
              <CalendarDatePagination />
            </CalendarDate>
            <CalendarHeader />
            <CalendarBody features={reminderFeatures}>
              {({ feature }) => (
                <CalendarItem 
                  key={feature.id} 
                  feature={feature}
                  className="text-xs"
                />
              )}
            </CalendarBody>
          </CalendarProvider>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedDateReminders?.length ? (
            <p className="text-sm text-muted-foreground">
              No reminders for this period
            </p>
          ) : (
            selectedDateReminders.map((reminder) => (
              <ReminderCard 
                key={`${reminder.id}-${reminder.due_date}`} 
                reminder={reminder} 
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}