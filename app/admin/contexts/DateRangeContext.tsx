"use client";

import { addDays } from "date-fns";
import React, { createContext, useState, ReactNode } from "react";
import { DateRange } from "react-day-picker";

interface DateRangeContextType {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
}

const defaultDateRange: DateRange = {
  from: new Date(),
  to: addDays(new Date(), 7),
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
