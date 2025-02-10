
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addMonths, subMonths } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthPickerProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  className?: string;
}

export function MonthPicker({ selectedMonth, onMonthChange, className }: MonthPickerProps) {
  const handlePreviousMonth = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(selectedMonth, 1));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(selectedMonth, "MMMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center font-medium">
            {format(selectedMonth, "MMMM yyyy")}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
