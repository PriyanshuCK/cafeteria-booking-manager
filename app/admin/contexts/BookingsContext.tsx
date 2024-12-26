"use client";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { MealBooking } from "../../lib/definitions";
import { DateRangeContext } from "./DateRangeContext";
import { fetchBookings } from "../../lib/actions";

export interface BookingContextType {
  bookings: MealBooking[];
  setBookings: React.Dispatch<React.SetStateAction<MealBooking[]>>;
  loading: boolean;
  error: string | null;
}

export const BookingContext = createContext<BookingContextType | undefined>(
  undefined
);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookings, setBookings] = useState<MealBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { dateRange } = useContext(DateRangeContext)!;

  useEffect(() => {
    const fetchBookingsData = async () => {
      if (dateRange?.from && dateRange?.to) {
        setLoading(true);
        setError(null);
        try {
          const fetchedBookings = await fetchBookings(
            dateRange.from,
            dateRange.to
          );
          setBookings(fetchedBookings);
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
          setError((error as Error).message || "Failed to fetch bookings");
          alert("Failed to fetch bookings. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookingsData();
  }, [dateRange]);

  return (
    <BookingContext.Provider value={{ bookings, setBookings, loading, error }}>
      {children}
    </BookingContext.Provider>
  );
};
