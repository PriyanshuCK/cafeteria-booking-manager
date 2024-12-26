"use client";
import { useContext } from "react";
import { BookingOverview } from "../../BookingOverview";
import { BookingContext } from "../../contexts/BookingsContext";

export default function BookingOverviewPage() {
  const { bookings } = useContext(BookingContext)!;
  return (
    <>
      <h1 className="text-3xl font-semibold my-10">Booking Overview</h1>
      <BookingOverview bookings={bookings} />
    </>
  );
}
