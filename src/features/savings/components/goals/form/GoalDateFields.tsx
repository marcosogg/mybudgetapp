import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
  const periodEnd = watch("periodEnd");

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Start Date</Label>
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
              {periodStart ? format(periodStart, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={periodStart}
              onSelect={(date) => setValue("periodStart", date)}
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

      {goalType === 'one_time' && (
        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !periodEnd && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {periodEnd ? format(periodEnd, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={periodEnd}
                onSelect={(date) => setValue("periodEnd", date)}
                disabled={(date) => date < periodStart}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.periodEnd && (
            <p className="text-sm text-destructive">
              {errors.periodEnd.message as string}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 