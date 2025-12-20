import { Calendar } from "@/components/ui/calendar";
import { useState, type JSX } from "react";

export default function HomeCalendar(): JSX.Element {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 12));
  // TODO: Sync with user's calendar (Google Calendar)

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
      buttonVariant="ghost"
    />
  );
}
