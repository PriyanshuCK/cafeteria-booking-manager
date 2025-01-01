"use client";
import { useContext } from "react";
import { BookingOverview } from "../../BookingOverview";
import { BookingContext } from "../../contexts/BookingsContext";

export default function BookingOverviewPage() {
  const { bookings } = useContext(BookingContext)!;
  return (
    <>
      <h2 className="text-xl font-semibold">Booking Overview</h2>
      <p className="text-sm text-gray-500 mb-4">
        View reports on bookings trends.
      </p>
      <BookingOverview bookings={bookings} />
    </>
  );
}
