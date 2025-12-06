import type { JSX } from "react/jsx-runtime";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

export default function DatePicker({
  date,
  placeHolder = "Select date ...",
  maxDate,
  minDate,
  defaultFormat = "PPP",
  onDateChange,
  fullWidth = false,
}: {
  placeHolder?: string;
  date: Date;
  maxDate?: Date;
  minDate?: Date;
  defaultFormat?: string;
  onDateChange?: (date: Date) => void;
  fullWidth?: boolean;
}): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(date);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!selectedDate}
          className={cn(
            "data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal",
            fullWidth && "w-full"
          )}
        >
          <CalendarIcon />
          {selectedDate ? (
            format(selectedDate, defaultFormat)
          ) : (
            <span>{placeHolder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="label"
          selected={selectedDate}
          onSelect={(d) => {
            if (d) {
              setOpen(false);
              setSelectedDate(d);
              onDateChange?.(d);
            }
          }}
          buttonVariant="ghost"
        />
      </PopoverContent>
    </Popover>
  );
}
