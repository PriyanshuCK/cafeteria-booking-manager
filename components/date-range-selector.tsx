"use client";

import { DateRangeContext } from "@/app/admin/contexts/DateRangeContext";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useContext } from "react";

export function DateRangeSelector() {
  const context = useContext(DateRangeContext);

  if (!context) {
    throw new Error(
      "DateRangeSelector must be used within a DateRangeProvider"
    );
  }

  const { dateRange, setDateRange } = context;

  return (
    <DatePickerWithRange
      className="max-w-sm"
      date={dateRange}
      setDate={setDateRange}
    />
  );
}
