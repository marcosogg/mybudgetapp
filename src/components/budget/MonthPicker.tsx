
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
  console.log('MonthPicker - selectedMonth:', selectedMonth);
  
  if (!(selectedMonth instanceof Date) || isNaN(selectedMonth.getTime())) {
    console.error('Invalid date provided to MonthPicker:', selectedMonth);
    selectedMonth = new Date();
  }

  const handlePreviousMonth = () => {
    const newDate = subMonths(selectedMonth, 1);
    console.log('Previous month:', newDate);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(selectedMonth, 1);
    console.log('Next month:', newDate);
    onMonthChange(newDate);
  };

  const formattedDate = format(selectedMonth, "MMMM yyyy");
  console.log('Formatted date:', formattedDate);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 px-3 text-sm", // Reduced height and padding, smaller text
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8" // Slightly smaller buttons in the popover
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center font-medium min-w-[120px]">
            {formattedDate}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8" // Slightly smaller buttons in the popover
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

