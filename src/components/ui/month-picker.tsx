import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthPickerProps {
  date?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
}

export function MonthPicker({
  date,
  onChange,
  className,
}: MonthPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM yyyy") : "Pick a month"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          initialFocus
          disabled={(date) => {
            // Only allow selecting the first day of each month
            return date.getDate() !== 1;
          }}
          fromDate={new Date()} // Can't pick months in the past
        />
      </PopoverContent>
    </Popover>
  );
} 