"use client";

import React, { createContext, useState, ReactNode } from "react";
import { DateRange } from "react-day-picker";

interface DateRangeContextType {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
}

const defaultDateRange: DateRange = {
  from: new Date("2024-11-01"),
  to: new Date(),
};

export const DateRangeContext = createContext<DateRangeContextType | undefined>(
  undefined
);

export const DateRangeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange
  );

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};
