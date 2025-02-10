import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, startOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import type { SavingsGoalType } from "../../../types/savings";
import type { FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";

interface GoalDateFieldsProps {
  goalType: SavingsGoalType;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors;
}

export function GoalDateFields({ 
  goalType, 
  watch, 
  setValue, 
  errors 
}: GoalDateFieldsProps) {
  const periodStart = watch("periodStart");

  // One-time goals don't need dates
  if (goalType === "one_time") {
    return null;
  }

  // Annual goals automatically use current year
  if (goalType === "recurring_yearly") {
    return (
      <div className="text-sm text-muted-foreground">
        Annual goals automatically use the current year as their start date.
      </div>
    );
  }

  // Monthly goals use MonthPicker
  return (
    <div className="space-y-2">
      <Label>Start Month</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !periodStart && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {periodStart ? format(periodStart, "MMMM yyyy") : "Select month"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={periodStart}
            onSelect={(date) => setValue("periodStart", startOfMonth(date))}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {errors.periodStart && (
        <p className="text-sm text-destructive">
          {errors.periodStart.message as string}
        </p>
      )}
    </div>
  );
} 