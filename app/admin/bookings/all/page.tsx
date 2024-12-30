"use client";
import { useContext } from "react";
import { BookingManagement } from "../../BookingManagement";
import { BookingContext } from "../../contexts/BookingsContext";
import { DateRangeSelector } from "@/components/date-range-selector";

export default function AllBookingsPage() {
  const { bookings, setBookings } = useContext(BookingContext)!;
  return (
    <>
      <h2 className="text-2xl font-semibold mt-2">All Bookings</h2>
      <p className="text-sm text-gray-500 mb-4">
        View and manage all bookings.
      </p>
      <div className="flex items-center gap-4 mb-6">
        <p>Showing bookings in date range:</p>
        <DateRangeSelector />
      </div>
      <BookingManagement bookings={bookings} setBookings={setBookings} />
    </>
  );
}
