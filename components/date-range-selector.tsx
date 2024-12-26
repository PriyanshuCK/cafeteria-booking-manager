"use client";

import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface DateRangeSelectorProps {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
}

export function DateRangeSelector({
  dateRange,
  setDateRange,
}: DateRangeSelectorProps) {
  return (
    <DatePickerWithRange
      className="max-w-sm"
      date={dateRange}
      setDate={setDateRange}
    />
  );
}
