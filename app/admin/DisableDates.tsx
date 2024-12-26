"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toggleDisabledDate } from "../lib/actions";
import { DatePicker } from "@/components/ui/date-picker";

export function DisableDates({
  disabledDates: initialDisabledDates,
}: {
  disabledDates: string[];
}) {
  const [disabledDates, setDisabledDates] = useState<Date[]>(
    initialDisabledDates.map((d) => new Date(d))
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleToggleDate = async () => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const result = await toggleDisabledDate(dateString);
      if (result.success) {
        if (result.disabled) {
          setDisabledDates([...disabledDates, selectedDate]);
        } else {
          setDisabledDates(
            disabledDates.filter((d) => d.getTime() !== selectedDate.getTime())
          );
        }
      } else {
        alert("Failed to toggle date: " + result.error);
      }
    }
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          filterDate={isWeekday}
          placeholderText="Select a date to disable/enable"
          highlightDates={disabledDates}
        />
        <Button onClick={handleToggleDate} disabled={!selectedDate}>
          {disabledDates.some((d) => d.getTime() === selectedDate?.getTime())
            ? "Enable Date"
            : "Disable Date"}
        </Button>
      </div>
      <div>
        <h3 className="font-semibold">Currently Disabled Dates:</h3>
        <ul>
          {disabledDates.map((date) => (
            <li key={date.toISOString()}>{date.toDateString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
