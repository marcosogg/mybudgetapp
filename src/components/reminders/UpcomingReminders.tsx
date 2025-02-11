
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReminders } from "@/hooks/reminders/useReminders";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export function UpcomingReminders() {
  const { data: reminders, isLoading } = useReminders();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold tracking-tight">Upcoming Reminders</CardTitle>
        <Button size="sm" onClick={() => navigate("/reminders")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading reminders...</p>
        ) : !reminders?.length ? (
          <p className="text-sm text-muted-foreground">No upcoming reminders</p>
        ) : (
          reminders.slice(0, 3).map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{reminder.name}</p>
                <p className="text-sm text-muted-foreground">
                  Due: {format(new Date(reminder.due_date), "MM/dd/yyyy")}
                </p>
              </div>
              <span className="font-bold text-primary">
                ${reminder.amount.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
